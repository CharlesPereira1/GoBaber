import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '~/services/api';

import { updateProfileSuccess, updateProfileFailure } from './actions';

export function* updateProfile({ payload }) {
  try {
    // eslint-disable-next-line camelcase
    const { name, email, avatar_id, ...rest } = payload.data;

    // Object.assign - serve para unir dois objetos
    // eslint-disable-next-line prefer-object-spread
    const profile = Object.assign(
      { name, email, avatar_id },
      rest.oldPassword ? rest : {}
    );

    // Pega usuário logado
    const response = yield call(api.put, 'users', profile);

    yield put(updateProfileSuccess(response.data));

    // Toast -  componentea de msg de sucesso e error flutuante em tela
    toast.success('Perfil atualizado com sucesso!');
  } catch (err) {
    toast.error('Erro ao atualizar perfil, confira seus dados!');
    yield put(updateProfileFailure());
  }
}

// quando for disparada executa um saga(funçao) que se chama updateProfile
export default all([takeLatest('@user/UPDATE_PROFILE_REQUEST', updateProfile)]);
