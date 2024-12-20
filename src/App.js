import './App.css';
import React from 'react';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      minutes: 25,
      seconds: 0,
      breakLength: 5,
      sessionLength: 25,
      isRunning: false,
      hasBreak: true,
    }
    this.interval = null;
  }

  tick = () => {
    this.setState((prevState) => {
      const { minutes, seconds, hasBreak} = prevState;
      if (seconds <= 0) {
        if (minutes === 0) {
          document.getElementById('beep').play()
          return{
            minutes: (hasBreak ? this.state.breakLength : this.state.sessionLength),
            seconds: 0,
            hasBreak: !hasBreak
          }
        }
        if (minutes < 0) {// bizzare case of the test that put -36 on Sessionlength
          return{
            minutes: 1,
            seconds: 0,
            sessionLength: 1,
          }
        }
        return { minutes: minutes - 1, seconds: 59 };
      }
      return { seconds: seconds - 1 };
    });
  };

  formatTime = () => { // chamado no render
    const { minutes, seconds } = this.state;
    const minutesStr = String(minutes).padStart(2, "0");
    const secondsStr = String(seconds).padStart(2, "0");
    return `${minutesStr}:${secondsStr}`;
  };

  toggleTimer = () => {
    const { isRunning } = this.state;
    if (isRunning) {
      clearInterval(this.interval); // Pausar
    } else {
      this.interval = setInterval(this.tick, 1000); // Iniciar
    };
    this.setState({ isRunning: !isRunning });
  };

  resetTimer = () => {
    const audio = document.getElementById('beep')
    audio.pause();
    audio.currentTime = 0;
    clearInterval(this.interval);
    this.setState({
      minutes: 25,
      seconds: 0,
      breakLength: 5,
      sessionLength: 25,
      isRunning: false,
      hasBreak: true,
    });
  };

  componentWillUnmount() {
    clearInterval(this.interval); // Limpar o intervalo quando o componente for desmontado
  }

  reduceBreaklength = () => {
    const minimunBreaklength = 1;
    const {isRunning, breakLength} = this.state;
    if(!isRunning && breakLength > minimunBreaklength) {
      this.setState((oldState) => {return { breakLength: oldState.breakLength - 1}})
    };
  }

  addBreaklength = () => {
    if(!this.state.isRunning && this.state.breakLength < 60) {
      this.setState((oldState) => {return { breakLength: oldState.breakLength + 1}})
    };
  }

  reduceSessionLength = () => {
    const minimunSessionLength = 1;
    const {isRunning, sessionLength} = this.state;
    if(!isRunning && sessionLength > minimunSessionLength) {
      this.setState((oldState) => {
        return {
          sessionLength: oldState.sessionLength - 1,
          minutes: oldState.sessionLength - 1,
          seconds: 0
        }},
      )      
    }
  }

  addSessionLength = () => {
    if(!this.state.isRunning && this.state.sessionLength < 60) {
      this.setState((oldState) => {
        return { 
          sessionLength: oldState.sessionLength + 1,
          minutes: oldState.sessionLength + 1,
          seconds: 0
        }
      })
    }
  }

  render() {
    return (
      <div className="App">
        <div className="length-control">
          <div id="break-label">Break Length</div>
          <button id="break-decrement" value="-" onClick={this.reduceBreaklength} >
            -
          </button>
          <div id="break-length">{this.state.breakLength}</div>
          <button id="break-increment" value="+" onClick={this.addBreaklength} >
            +
          </button>
        </div>
        <div className="length-control">
          <div id="session-label">Session Length</div>
          <button id="session-decrement" value="-" onClick={this.reduceSessionLength}>
            -
          </button>
          <div id="session-length">{this.state.sessionLength}</div>
          <button id="session-increment" value="+" onClick={this.addSessionLength}>
            +
          </button>
        </div>
        <div className="timer">
          <div className="timer-wrapper">
            <div id="timer-label">{this.state.hasBreak ? 'Session' : 'Break'}</div>
            <div id="time-left">{this.formatTime()}</div>
          </div>
        </div>
        <div className="timer-control">
          <button id="start_stop" onClick={this.toggleTimer}>
            Start/Stop
          </button>
          <button id="reset" onClick={this.resetTimer}>
            Reset
          </button>
        </div>
        <audio id="beep" preload="auto" src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"></audio>
      </div>
    );
  }
}

export default App;
