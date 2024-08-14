import axios from 'axios';
import PropTypes from 'prop-types';
import type { PropsWithChildren } from 'react';
import React, { createContext, useContext, useReducer } from 'react';
import type { User } from '~/models/User';
import { storageGet, storageRemove, storageSet } from '~/utils';

export interface AuthState {
  user?: User;
  token?: string;
  openLogoutDialog?: boolean;
}

export interface AuthActionType {
  SET_USER: User | null;
  SET_TOKEN: string | null;
  TOGGLE_LOGOUT_DIALOG: boolean;
  LOGOUT: null;
}

export interface AuthAction<T extends keyof AuthActionType = keyof AuthActionType> {
  type: T;
  value: AuthActionType[T];
}

export type AuthenticationContext = [
  AuthState,
  React.Dispatch<React.ReducerAction<React.Reducer<AuthState, AuthAction>>>,
];

const USER_KEY = 'USER';
const TOKEN_KEY = 'ACCESS_TOKEN';

let user: User;
const savedUser = storageGet(USER_KEY);
if (savedUser)
  try {
    user = JSON.parse(savedUser);
  } catch (error) {
    user = null;
  }

const initialState: AuthState = {
  user,
  token: storageGet(TOKEN_KEY),
  openLogoutDialog: false,
};

if (initialState.token) {
  axios.defaults.headers.common.Authorization = `Bearer ${initialState.token}`;
}

const logout = () => {
  storageRemove(USER_KEY);
  storageRemove(TOKEN_KEY);
  axios.defaults.headers.common.Authorization = undefined;
};

axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      logout();
    }
    return Promise.reject(err);
  }
);

function reducer(state = initialState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':
      const user = action.value as User;
      if (user) storageSet(USER_KEY, JSON.stringify(user));
      else storageRemove(USER_KEY);
      return { ...state, user };
    case 'SET_TOKEN':
      const token = action.value as string;
      if (token) {
        storageSet(TOKEN_KEY, token);
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      } else {
        logout();
      }
      return { ...state, token };
    case 'TOGGLE_LOGOUT_DIALOG':
      return { ...state, openLogoutDialog: !!action.value };
    case 'LOGOUT':
      logout();
      return { ...state, user: null, token: null };
    default:
      return state;
  }
}

export const AuthContext = createContext<AuthenticationContext>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <AuthContext.Provider value={useReducer(reducer, initialState)}>{children}</AuthContext.Provider>
);

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export interface AuthComponentProps {
  authState: AuthenticationContext[0];
  authDispatch: AuthenticationContext[1];
}

export function withAuth<P extends AuthComponentProps, C extends React.ComponentType<P>>(
  component: C
) {
  const InnerComponent: React.FC<P & { wrappedComponentRef?: React.Ref<C> }> = ({
    wrappedComponentRef,
    ...rest
  }) => (
    <AuthContext.Consumer>
      {([authState, authDispatch]) =>
        React.createElement(component as any, {
          authState,
          authDispatch,
          ref: wrappedComponentRef,
          ...rest,
        })
      }
    </AuthContext.Consumer>
  );
  return InnerComponent;
}
