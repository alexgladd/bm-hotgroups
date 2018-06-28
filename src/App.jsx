import React, { Component } from 'react';
import BMLH from './util/bmlastheard';
import BMAgg from './util/bmagg';
import moment from 'moment';
import Header from './components/Header';
import TopGroups from './components/TopGroups';
import TopCallsigns from './components/TopCallsigns';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startup: true,
      bmConnected: false,
      topGroups: [],
      topCallsigns: [],
      msgs: []
    };

    this.bmlh = new BMLH();
    this.bmagg = new BMAgg(1, 2);

    this.updateAggregations = this.updateAggregations.bind(this);
    this.handleMqttMsg = this.handleMqttMsg.bind(this);
    this.handleConnectionChange = this.handleConnectionChange.bind(this);
    this.handleConnectionBtn = this.handleConnectionBtn.bind(this);
    this.handleAggregatorPrune = this.handleAggregatorPrune.bind(this);
  }

  updateAggregations() {
    console.log('Top TGs', this.bmagg.topTalkGroups);
    console.log('Top Callsigns', this.bmagg.topCallsigns);

    this.setState({
      topGroups: this.bmagg.topTalkGroups,
      topCallsigns: this.bmagg.topCallsigns
    });
  }

  handleConnectionBtn() {
    if (this.state.bmConnected) {
      // disconnect
      this.bmlh.close();

      if (this.pruneIntervalId) {
        clearInterval(this.pruneIntervalId);
      }
    } else {
      // connect
      this.bmlh.open();
      this.pruneIntervalId = setInterval(this.handleAggregatorPrune, 60000);
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

    if (this.bmagg.addSession(msg)) {
      this.updateAggregations();
    }
  }

  handleAggregatorPrune() {
    if (this.bmagg.prune()) {
      this.updateAggregations();
    }
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

    this.pruneIntervalId = setInterval(this.handleAggregatorPrune, 60000);
  }

  componentWillUnmount() {
    if (this.pruneIntervalId) {
      clearInterval(this.pruneIntervalId);
    }
  }

  render() {
    const { startup, bmConnected, topGroups, topCallsigns, msgs } = this.state;

    return (
      <div>
        <Header
          enabled={!startup}
          connected={bmConnected}
          onConnectionClick={this.handleConnectionBtn} />
        
        <div id="App">
          <TopGroups talkGroups={topGroups} />
          <TopCallsigns callsigns={topCallsigns} />
          <div>Sessions</div>
        </div>

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
