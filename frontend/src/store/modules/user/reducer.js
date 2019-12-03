/**
 * este modulo é usado para o usuário assim que logado poder fazer alteraçoes
 * cadastrais em seus dados pessoais para depois manipular. É praticamente uma cópia do auth.
 */
import produce from 'immer';

const INITIAL_STATE = {
  profile: null,
};
/**
 * um reducer pode ouvir actions(@auth/SIGN_IN_SUCCESS) de outros modulos
 */
export default function user(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@auth/SIGN_IN_SUCCESS': {
        draft.profile = action.payload.user;
        break;
      }
      case '@user/UPDATE_PROFILE_SUCCESS': {
        draft.profile = action.payload.profile;
        break;
      }
      case '@auth/SIGN_OUT': {
        draft.profile = null;
        break;
      }
      default:
    }
  });
}
