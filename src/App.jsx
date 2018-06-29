import React, { Component } from 'react';
import BMLH from './util/bmlastheard';
import BMAgg from './util/bmagg';
import Header from './components/Header';
import TopGroups from './components/TopGroups';
import TopCallsigns from './components/TopCallsigns';
import LatestActivity from './components/LatestActivity';
import { getDurationSeconds } from './util/session';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startup: true,
      bmConnected: false,
      topGroups: [],
      topCallsigns: [],
      latestSessions: [],
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
      topCallsigns: this.bmagg.topCallsigns,
      latestSessions: this.bmagg.latestActivity,
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
        return getDurationSeconds(msg) > 0;
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
    const { startup, bmConnected, topGroups, topCallsigns, latestSessions } = this.state;

    return (
      <div>
        <Header
          enabled={!startup}
          connected={bmConnected}
          onConnectionClick={this.handleConnectionBtn} />
        
        <div id="App">
          <LatestActivity sessions={latestSessions} />
          <TopGroups talkGroups={topGroups} />
          <TopCallsigns callsigns={topCallsigns} />
        </div>
      </div>
    );
  }
}

export default App;
