import logo from './logo.svg';
import './App.css';
import React from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          This is Kai's React app!
        </p>
        <Timer/>
      </header>
    </div>
  );
}

class Timer extends React.Component {
  constructor() {
    super();
    let defaultNumPlayers = 3;
    let initialSeconds = 600;
    this.state = { 
      numPlayers: defaultNumPlayers, 
      initialSeconds: initialSeconds,
      currentPlayer: 0,
      players: this.makePlayers(defaultNumPlayers, initialSeconds),
    };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.numPlayersChange = this.numPlayersChange.bind(this);
    this.initialTimeChange = this.initialTimeChange.bind(this);
    this.switchPlayer = this.switchPlayer.bind(this);
  }

  secondsToTime(secs){
    let minutes = Math.floor(secs / 60);
    let seconds = secs - (minutes * 60);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return `${minutes}:${seconds}`;
  }

  makeState(defaultNumPlayers, initialSeconds) {
    return { 
      numPlayers: defaultNumPlayers, 
      initialSeconds: initialSeconds,
      currentPlayer: 0,
      players: this.makePlayers(defaultNumPlayers, initialSeconds),
    }
  }

  makePlayers(numPlayers, initialSeconds) {
    let players = [];
    for (let i = 0; i < numPlayers; i++) {
      players = players.concat({
        seconds: initialSeconds,
      })
    } 
    return players;
  }

  componentDidMount() {
    
  }

  startTimer() {
    // this.setState(this.makeState(this.numPlayers, this.initialSeconds))
    if (this.timer == 0) {
      this.timer = setInterval(this.countDown, 1000);
    } else {
      clearInterval(this.timer);
      this.timer = 0;
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.players[this.state.currentPlayer].seconds - 1;

    this.state.players[this.state.currentPlayer].seconds = seconds;

    this.setState({
      players: this.state.players,
    });
    
    // Check if we're at zero.
    if (seconds == 0) { 
      clearInterval(this.timer);
    }
  }

  numPlayersChange(event) {
    this.setState({ numPlayers: parseInt(event.target.value) });
  }

  initialTimeChange(event) {
    this.setState({ initialSeconds: parseInt(event.target.value) * 60 });
  }

  switchPlayer() {
    let nextPlayer = (this.state.currentPlayer + 1) % this.state.numPlayers;
    this.setState({ currentPlayer: nextPlayer });
  }

  /*
  this.state: {
    players: [
      {
        seconds: 600,
      },
      {
        seconds: 600,
      },
      {
        seconds: 600,
      },
      {
        seconds: 600,
      }
    ]
    currentPlayer: 3,
    numPlayers: 4
  }

  players = []
  for ( 4 times ) {
    players.append {
      seconds: beginningSeconds
    }
  }

  this.state.players[currentPlayer].seconds

  this.timer: every second, subtract 1 from the current player's seconds

  we'll also need buttons for incrementing the currentPlayer to the next player

  */
  render() {
    console.log(this.state);
    return (
      <div>
        <b>Number of players: </b>
        <select defaultValue="3" onChange={this.numPlayersChange}>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <br/>
        <b>Initial timer: </b>
        <select defaultValue="10" onChange={this.initialTimeChange}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
        <br/><br/>
        <div>
          {this.state.players.map((player, i) => {
            return <div key={i}>
                Player {i}: {this.secondsToTime(player.seconds)}
              </div>
          })}
        </div>
        <button onClick={this.startTimer}>Start</button>
        <button onClick={this.switchPlayer}>Next Player</button>
      </div>
    );
  }
}

export default App;
