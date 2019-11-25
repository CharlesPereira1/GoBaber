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

    history.push('/dashboard');
  } catch (err) {
    toast.error('Falha na autenticação, verifique seus dados');
    yield put(signFailure());
  }
}

// takeLatest sempre que ouvir a informação SIGN_IN_REQUEST executar função signIn
export default all([takeLatest('@auth/SIGN_IN_REQUEST', signIn)]);
