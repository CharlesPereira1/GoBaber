import produce from 'immer';

// armazena informações de estados começados pelos campos abaixo
const INITIAL_STATE = {
  token: null,
  signed: false,
  loading: false,
};

/**
 * no case, toda vez que uma action for disparada retorna produce pega o estado
 * cria um draft e se pode manipular o mesmo da maneira que quiser
 * as informaçoes estão no action.payload
 * -----------------------------------------
 * para não precisar repetir o return produce, basta traze-lo para em volta
 * do switch e nas actions trazer o {} e no fim de cada action informar break;
 */
export default function auth(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@auth/SIGN_IN_REQUEST': {
        draft.loading = true;
        break;
      }
      case '@auth/SIGN_IN_SUCCESS': {
        draft.token = action.payload.token;
        draft.signed = true;
        draft.loading = false;
        break;
      }
      case '@auth/SIGN_FAILURE': {
        draft.loading = false;
        break;
      }
      case '@auth/SIGN_OUT': {
        draft.token = null;
        draft.signed = false;
        break;
      }
      default:
    }
  });
}
