import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import './index.css'
import "./bootstrap.min.css";
import App from './App.jsx'
import store from './store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
        <App />
      </PayPalScriptProvider>

    </Provider>
  </StrictMode>,
)

