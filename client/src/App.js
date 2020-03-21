import React from 'react';
import './styles/App.css';
import Score from './components/Score';

function App() {

  return (

    <div className="App">
      <header className="App-header">
        <h1>Scoreboard</h1>
      </header>
      <Score />
    </div>

  );
}

export default App;
