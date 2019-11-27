import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

// import '../../../config/ReactotronConfig';
import history from '~/services/history';
import api from '~/services/api';

import { signInSuccess, signFailure } from './actions';

export function* signIn({ payload }) {
  /**
   * aplicando try catch para verificar erro de login, caso o usuário não
   * informe o usuário corretamente ele cai no catch action de SIGN_FILURE
   */
  try {
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
      toast.error('Usuário não é prestador');
      return;
    }

    // se for prestador será signInSuccess
    yield put(signInSuccess(token, user));

    // salva inforo de token que será utilizado em todas as requisiçoes
    api.defaults.headers.Authorization = `Bearer ${token}`;

    history.push('/dashboard');
  } catch (err) {
    toast.error('Falha na autenticação, verifique seus dados');
    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;

    yield call(api.post, 'users', {
      name,
      email,
      password,
      provider: true,
    });

    history.push('/');
  } catch (err) {
    toast.error('Falha no cadastro, verifique seus dados');

    yield put(signFailure());
  }
}

export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

// takeLatest sempre que ouvir a informação SIGN_IN_REQUEST executar função signIn
export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
]);
