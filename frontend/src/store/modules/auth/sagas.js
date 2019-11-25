import { takeLatest, call, put, all } from 'redux-saga/effects';

import history from '~/services/history';
import api from '~/services/api';

import { signInSuccess } from './actions';

export function* signIn({ payload }) {
  // login de usuário
  const { email, password } = payload;

  // chamada api do RestFull. Metodo call usuado para fazer envio de requisiçoes assyncronas
  const response = yield call(api.post, 'sessions', {
    email,
    password,
  });

  // se der certo a requisiçao será enviado um token e um user
  const { token, user } = response.data;

  // condiçao que se o usuário não for prestador de serviço não deixar logar
  if (!user.provider) {
    console.tron.error('Usuário não é prestador');
    return;
  }
  // se for prestador será signInSuccess
  yield put(signInSuccess(token, user));

  history.push('/dashboard');
}

// takeLatest sempre que ouvir a informação SIGN_IN_REQUEST executar função signIn
export default all([takeLatest('@auth/SIGN_IN_REQUEST', signIn)]);
