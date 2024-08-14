import type { AuthenticationContext } from '~/auth';
import { useAuth } from '~/auth';
import LoadingPage from '~/pages/LoadingPage';
import { coerceArray } from '~/utils';
import { differenceInMinutes } from 'date-fns';
import _ from 'lodash';
import React from 'react';
import type { Location, NavigateProps } from 'react-router-dom';
import { Navigate, useLocation } from 'react-router-dom';

import { getUser } from './service';

interface Props extends React.PropsWithChildren {
  routes: RouteItem[];
  location: Location;
  authContext: AuthenticationContext;
}

interface State {
  waitAuth: boolean;
  navigate?: NavigateProps;
  activeRoute?: BaseRouteItem;
}

const flattenRoutes = (routes: RouteItem[], meta: Record<string, any> = {}) => {
  return routes.reduce<BaseRouteItem[]>((prev, cur) => {
    const { collapse, ...rest } = cur as CollapseRouteItem;
    if (meta.auth && !rest.meta?.auth) {
      rest.meta ??= {};
      rest.meta.auth = meta.auth;
    }
    if (rest.route) prev.push(rest);
    if (Array.isArray(collapse)) prev.push(...flattenRoutes(collapse, rest.meta));
    return prev;
  }, []);
};

let lastUserCheck: Date;

class AuthorizationComponent extends React.Component<Props> {
  static defaultProps: Partial<Props> = {
    routes: [],
  };

  state: State = {
    waitAuth: true,
    activeRoute: null,
    navigate: null,
  };

  flatRoutes: BaseRouteItem[];

  constructor(props: Props) {
    super(props);
    this.flatRoutes = flattenRoutes(props.routes);
  }

  componentDidMount() {
    this.updateActiveRoute();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      authContext: [prevAuthState],
    } = prevProps;

    const {
      routes,
      location: { pathname },
      authContext: [authState],
    } = this.props;

    const { activeRoute } = this.state;
    let shouldUpdateActiveRoute = false;
    const newState: Partial<State> = null;
    let shouldCheckAuth = false;

    if (prevProps.routes !== routes) {
      this.flatRoutes = flattenRoutes(routes);
      shouldUpdateActiveRoute = true;
    }

    if (prevProps.location.pathname !== pathname) {
      shouldUpdateActiveRoute = true;
    }

    if (
      prevState.activeRoute !== activeRoute ||
      prevAuthState.user !== authState.user ||
      prevAuthState.token !== authState.token
    ) {
      shouldCheckAuth = true;
    }

    if (shouldUpdateActiveRoute) {
      this.updateActiveRoute(newState);
    } else if (newState) {
      this.setState(newState);
    } else if (shouldCheckAuth) {
      this.checkAuth();
    }
  }

  updateActiveRoute(newState: Partial<State> = {}, callback?: () => void) {
    const activeRoute = this.flatRoutes.find(route => route.route === this.props.location.pathname);

    this.setState({ ...newState, activeRoute }, callback);
  }

  async checkAuth() {
    const {
      authContext: [authState],
    } = this.props;
    const { activeRoute } = this.state;
    // eslint-disable-next-line prefer-const
    let { user, token } = authState;

    const authOptions = activeRoute?.meta?.auth;
    if (activeRoute && authOptions) {
      // Auth required

      if (!lastUserCheck || differenceInMinutes(new Date(), lastUserCheck) > 30) {
        lastUserCheck = new Date();
        try {
          user = await getUser();
        } catch (error) {
          user = null;
        }
      }

      const authorized = Boolean(user) && Boolean(token);
      // const isSuperuser = (user?.permissions ?? []).includes('superuser');
      let forbidden = false;

      if (user && typeof authOptions === 'object') {
        const allowedRoles = authOptions.roles ?? [];
        // const allowedPermissions = authOptions.permissions ?? [];
        const roles = coerceArray(user.roles);
        // const permissions = user.permissions ?? [];
        const matchedRole = _.intersection(allowedRoles, roles);
        // const matchedPerms = _.intersection(allowedPermissions, permissions);
        forbidden = matchedRole.length < 1;
      }

      if (authorized) {
        this.setState({ waitAuth: false, navigate: forbidden ? { to: '/error/403' } : null });
      } else {
        const next = activeRoute.route ?? '';
        this.setState({
          waitAuth: true,
          navigate: { to: `/login?next=${next}`, replace: true },
        });
      }
    } else {
      this.setState({ waitAuth: false, navigate: null });
    }
  }

  render() {
    const { waitAuth, navigate } = this.state;
    const { children } = this.props;

    if (navigate) return <Navigate {...navigate} />;

    if (waitAuth) return <LoadingPage />;

    return <>{children}</>;
  }
}

const AuthorizationMemo = React.memo(AuthorizationComponent);
const Authorization = React.forwardRef<
  AuthorizationComponent,
  Omit<Props, 'location' | 'authContext'>
>((props, ref) => {
  const location = useLocation();
  const authContext = useAuth();

  return <AuthorizationMemo ref={ref} location={location} authContext={authContext} {...props} />;
});

export default Authorization;
