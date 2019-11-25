/**
 * este modulo é usado para o usuário assim que logado poder fazer alteraçoes
 * cadastrais em seus dados pessoais para depois manipular. É praticamente uma cópia do auth.
 */
import produce from 'immer';

const INITIAL_STATE = {
  profile: null,
};

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case '@auth/SIGN_IN_SUCCESS':
      return produce(state, draft => {
        draft.profile = action.payload.user;
      });
    default:
      return state;
  }
}
