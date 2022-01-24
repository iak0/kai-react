import logo from './logo.svg';
import './App.css';
import React from 'react';
import Button from '@mui/material/Button';

const COLORS = ["#f88", "#8f8", "#88f"];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Board Game Timer
        </p>
      </header>
      <div className='App-body'>
        <Timer/>
      </div>
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
      screen: 1,
      timerActive: false,
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
    // If negative, just call the same function on the positive version of the number, and append a negative sign
    if (secs < 0) {
      return "-" + this.secondsToTime(-secs);
    }

    let minutes = Math.floor(secs / 60);
    let seconds = secs - (minutes * 60);

    seconds = seconds.toFixed(2)
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
        color: COLORS[i],
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
      players: this.makePlayers(this.state.numPlayers, this.state.initialSeconds),
      screen: 2,
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
      this.timer = setInterval(this.countDown, 10); 
      this.setState({timerActive: true});
    } else {
      // stop calling this.countdown() every second
      clearInterval(this.timer);
      this.timer = null;
      this.setState({timerActive: false});
    }
  }

  /**
   * This is called once per second when the timer is active.
   */
  countDown() {
    // Remove one second
    let players = this.state.players
    let seconds = players[this.state.currentPlayer].seconds - 0.01;

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
    if (this.state.screen === 1) {
      return (
        <div className="wrapper">
          <div className="form-wrapper">
            <div className="form">
              <b>Number of players: </b>
              <select defaultValue="3" onChange={this.numPlayersChange}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <br />
              <b>Initial timer: </b>
              <select defaultValue="10" onChange={this.initialTimeChange}>
                <option value="0.5">0.5</option>
                <option value="1">1</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </div>
          
          <Button className="button" variant="contained" onClick={this.createTimers}>Create Timers</Button>
          </div>
        </div>
      );
    } 
    else if (this.state.screen === 2) {
      return (
        <div className="timer-wrapper">
            {this.state.players.map((player, i) => {
              return <div key={i} 
                          className={i === this.state.currentPlayer ? "selected" : "unselected"} 
                          style={{backgroundColor: player.color}}
                          onClick={this.switchPlayer}>
                  Player {i+1}: {this.secondsToTime(player.seconds)}
                </div>
            })}
          <div>
            <Button variant="contained" onClick={this.toggleTimer}>{this.state.timerActive ? "Pause" : "Start"}</Button>
            <Button variant="contained" onClick={this.switchPlayer}>Next Player</Button>
          </div>
        </div> 
      );
    }
  }
}

export default App;
