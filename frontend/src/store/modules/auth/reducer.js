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
 */
export default function auth(state = INITIAL_STATE, action) {
  switch (action.type) {
    case '@auth/SIGN_IN_SUCCESS':
      return produce(state, draft => {
        draft.token = action.payload.token;
        draft.signed = true;
      });
    default:
      return state;
  }
}
