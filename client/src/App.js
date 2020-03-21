import React from 'react';
import './styles/App.css';
import EnterScore from './components/EnterScore';

function App() {

  return (

    <div className="App">
      <header className="App-header">
        <h1>Scoreboard</h1>
      </header>
      <EnterScore />
    </div>

  );
}

export default App;
