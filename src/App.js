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

/**
 * This is a React Component which displays a multi-player timer.
 * 
 * The state for this component looks something like:
 * this.state: {
 *   players: [
 *     {
 *       seconds: 600,
 *     },
 *     {
 *       seconds: 600,
 *     }
 *   ]
 *   currentPlayer: 0,
 *   numPlayers: 2,
 *   initialTimer: 600s
 * }
 */
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
    this.timer = null; 
    this.createTimers = this.createTimers.bind(this);
    this.toggleTimer = this.toggleTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.numPlayersChange = this.numPlayersChange.bind(this);
    this.initialTimeChange = this.initialTimeChange.bind(this);
    this.switchPlayer = this.switchPlayer.bind(this);
  }

  /**
   * Converts an integer number of seconds into a string in the MM:SS format.
   */
  secondsToTime(secs){
    let minutes = Math.floor(secs / 60);
    let seconds = secs - (minutes * 60);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return `${minutes}:${seconds}`;
  }

  /**
   * Based on the number of players and initial time chosen, returns a list of players.
   * 
   * e.g. numPlayers = 2, initialSeconds = 600 returns a list:
   *   [
   *     { seconds: 600 }, 
   *     { seconds: 600 }
   *   ]
   */ 
  makePlayers(numPlayers, initialSeconds) {
    let players = [];
    for (let i = 0; i < numPlayers; i++) {
      players = players.concat({
        seconds: initialSeconds,
      })
    } 
    return players;
  }

  /**
   * This is called when the "Create Timers" button is pressed.
   * Based on the number of players and initial time chosen, creates the
   * correct number of players and timers.
   * 
   * This does not start the countdown on the timers.
   */ 
  createTimers() {
    this.setState({
      players: this.makePlayers(this.state.numPlayers, this.state.initialSeconds)
    });
  }

  /**
   * This is called when the "Start/Pause/Resume" button is pressed.
   * Starts counting down on the timers if it is not running (timer = null). 
   * Otherwise, it stops the timer countdown and sets the timer to null.
   */
  toggleTimer() {
    // TODO: prevent timer from being started if any of the players' times is <= 0
    if (this.timer == null) {
      // starts calling this.countdown() every second
      this.timer = setInterval(this.countDown, 1000); 
    } else {
      // stop calling this.countdown() every second
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * This is called once per second when the timer is active.
   */
  countDown() {
    // Remove one second
    let players = this.state.players
    let seconds = players[this.state.currentPlayer].seconds - 1;

    players[this.state.currentPlayer].seconds = seconds;

    // set state so a re-render happens.
    this.setState({
      players: players,
    });
    
    // Check if we're at zero.
    if (seconds === 0) { 
      clearInterval(this.timer);
    }
  }

  /**
   * This is called when the user makes a selection in the "Number of Players" dropdown
   */
  numPlayersChange(event) {
    this.setState({ numPlayers: parseInt(event.target.value) });
  }

  /**
   * This is called when the user makes a selection in the "Initial time" dropdown
   */
  initialTimeChange(event) {
    this.setState({ initialSeconds: parseInt(event.target.value) * 60 });
  }

  /**
   * This is called when the "Next Player" button is called.
   */
  switchPlayer() {
    let nextPlayer = (this.state.currentPlayer + 1) % this.state.numPlayers;
    this.setState({ currentPlayer: nextPlayer });
  }

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
          <option value="1">1</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
        <br/>
        <button onClick={this.createTimers}>Create Timers</button>
        <br/><br/>
        <div>
          {this.state.players.map((player, i) => {
            return <div key={i}>
                Player {i}: {this.secondsToTime(player.seconds)}
              </div>
          })}
        </div>
        <button onClick={this.toggleTimer}>Start/Pause/Resume</button>
        <br/>
        <button onClick={this.switchPlayer}>Next Player</button>
      </div>
    );
  }
}

export default App;
