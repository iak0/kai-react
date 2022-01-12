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
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Timer/>
      </header>
    </div>
  );
}

class Timer extends React.Component {
  constructor() {
    super();
    this.state = { time: {}, seconds: 600 };
    this.timer = 0;
    this.toggleTimer = this.toggleTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }

  toggleTimer() {
    if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    } else {
      clearInterval(this.timer);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;

    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });
    
    // Check if we're at zero.
    if (seconds == 0) { 
      clearInterval(this.timer);
    }
  }

  render() {
    return(
      <div>
        <div>
          <button onClick={this.toggleTimer}>Start</button>
          m: {this.state.time.m} s: {this.state.time.s}
        </div>
        <div>
          <button onClick={this.toggleTimer}>Start</button>
          m: {this.state.time.m} s: {this.state.time.s}
        </div>
        <div>
          <button onClick={this.toggleTimer}>Start</button>
          m: {this.state.time.m} s: {this.state.time.s}
        </div>
      </div>
    );
  }
}


export default App;
