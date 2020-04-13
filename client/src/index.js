import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const options = {
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    offset: '30px',
    transition: transitions.SCALE
  }
   
  const Root = () => (
    <AlertProvider template={AlertTemplate} {...options}>
      <App />
    </AlertProvider>
  )
  
ReactDOM.render(<Root />, document.getElementById('root'));
serviceWorker.unregister();
