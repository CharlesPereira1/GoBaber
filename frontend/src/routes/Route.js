import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import AuthLayout from '~/pages/_layouts/auth';
import DefaultLayout from '~/pages/_layouts/default';

export default function RouteWrapper({
  component: Component,
  isPrivate,
  ...rest
}) {
  // armazena se o usuário está logado ou não, padrão é false
  const signed = false;

  // se o usuario não estiver logado e a propriedade is private for true ele continua na pagina de login
  if (!signed && isPrivate) {
    return <Redirect to="/" />;
  }

  // se estiver logado e a rota não for privada o usuário é redirecionado para o dashboard
  if (signed && !isPrivate) {
    return <Redirect to="/dashboard" />;
  }

  // se o usuario estiver autenticado na aplicaçao uso o layout default, senão uso o AuthLayout
  const Layout = signed ? DefaultLayout : AuthLayout;

  //
  return (
    <Route
      {...rest}
      render={props => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  );
}

// propType começa com letra minuscula quando chamado na variavel principal
RouteWrapper.propTypes = {
  isPrivate: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
};

RouteWrapper.defaultProps = {
  isPrivate: false,
};
