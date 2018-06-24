import React, { Component } from 'react';
import BMLH from './util/bmlastheard';
import BMAgg from './util/bmagg';
import moment from 'moment';
import Header from './components/Header';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startup: true,
      bmConnected: false,
      msgs: []
    };

    this.bmlh = new BMLH();
    this.bmagg = new BMAgg();

    this.handleMqttMsg = this.handleMqttMsg.bind(this);
    this.handleConnectionChange = this.handleConnectionChange.bind(this);
    this.handleConnectionBtn = this.handleConnectionBtn.bind(this);
  }

  handleConnectionBtn() {
    if (this.state.bmConnected) {
      // disconnect
      this.bmlh.close();
    } else {
      // connect
      this.bmlh.open();
      this.setState({ startup: true });
    }
  }

  handleConnectionChange(connected) {
    if (this.state.startup) {
      // turn off startup state
      this.setState({ startup: false, bmConnected: connected });
    } else {
      this.setState({ bmConnected: connected });
    }
  }

  handleMqttMsg(msg) {
    console.log('Session stop received', msg);
    this.bmagg.addSession(msg);
    console.log('Top TGs', this.bmagg.topTalkGroups);
    this.setState({ msgs: [ msg, ...this.state.msgs ] });
  }

  componentDidMount() {
    const msgFilter = (msg) => {
      if (msg.DestinationID > 90 && msg.SessionType === 7 && msg.Event === 'Session-Stop') {
        const start = moment.unix(msg.Start);
        const stop = moment.unix(msg.Stop);
        const diff = stop.diff(start, 'seconds');

        return diff > 0;
      } else {
        return false;
      }
    };

    this.bmlh.onConnectionChange(this.handleConnectionChange);
    this.bmlh.onMqtt(this.handleMqttMsg, true, msgFilter);
    this.bmlh.open();
  }

  render() {
    const { startup, bmConnected, msgs } = this.state;

    return (
      <div className="App">
        <Header
          enabled={!startup}
          connected={bmConnected}
          onConnectionClick={this.handleConnectionBtn} />

        <h1>Brandmeister Hot Groups</h1>

        <table width="100%">
          <thead><tr>
            <th>Talk Group</th>
            <th>Talk Time</th>
            <th>Last Active</th>
          </tr></thead>
          <tbody>
          {
            this.bmagg.topTalkGroups.map((tg, idx) => (
              <tr key={idx}>
                <td>{ `${tg.name} (${tg.id})` }</td>
                <td>{ `${tg.talkTime} seconds`}</td>
                <td>{ moment.unix(tg.lastActive).format('ddd h:mm:ssa') }</td>
              </tr>
            ))
          }
          </tbody>
        </table>

        <table width="100%">
          <thead>
          <tr>
            <th>Start</th>
            <th>Stop</th>
            <th>Duration</th>
            <th>From</th>
            <th>To</th>
            <th>Link</th>
            <th>Type</th>
          </tr>
          </thead>
          <tbody>
          {
            msgs.map((msg, idx) => {
              const start = moment.unix(msg.Start);
              const stop = moment.unix(msg.Stop);
              return (
              <tr key={idx}>
                <td>{ start.format('ddd h:mm:ssa') }</td>
                <td>{ stop.format('ddd h:mm:ssa') }</td>
                <td>{ `${stop.diff(start, 'seconds')} seconds` }</td>
                <td>{ `${msg.SourceCall} (${msg.SourceID})` }</td>
                <td>{ `${msg.DestinationName} (${msg.DestinationID})` }</td>
                <td>{ msg.LinkName }</td>
                <td>{ msg.SessionType }</td>
              </tr>
              );
            })
          }
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;

// https://ask.brandmeister.network/question/729/using-js-php-to-query-brandmeister-last-heard-data/
// https://socket.io/docs/client-api/
