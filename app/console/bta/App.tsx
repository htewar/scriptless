"use client"

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './redux/store/configureStore';
import AppRoutes from "./routes/AppRoutes"


const App: React.FC = () => {
  return <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AppRoutes />
    </PersistGate>
  </Provider>
}

export default App