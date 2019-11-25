import storage from 'redux-persist/lib/storage';
// redux-persist utilizado para integrar com varios bancos de dados
import { persistReducer } from 'redux-persist';

export default reducers => {
  // whitelist é utilizado para colocar o nome dos reducer que será armazenado informações
  const persistedReducer = persistReducer(
    {
      key: 'gobarber',
      storage,
      whitelist: ['auth', 'user'],
    },
    reducers
  );

  return persistedReducer;
};
