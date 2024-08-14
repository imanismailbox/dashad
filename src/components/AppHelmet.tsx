import React from "react";
import { Helmet } from "react-helmet";
// import { useSelector } from "react-redux";

interface Props extends React.PropsWithChildren {
  title: string;
  description?: string;
}

const AppHelmet: React.FC<Props> = ({ title, description, children }) => {
  // const { app_name } = useSelector(({ prefs }) => prefs);
  const app_name = "Dashad ui";

  return (
    <Helmet>
      <title>{title ? `${title} | ${app_name}` : app_name}</title>
      {description && <meta name="description" content={description} />}
      {children}
    </Helmet>
  );
};

export default AppHelmet;
