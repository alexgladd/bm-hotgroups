import React from 'react';
import ReactGA from 'react-ga';
import BMLH from './util/bmlastheard';
import BMAgg from './util/bmagg';
import Header from './components/Header';
import Footer from './components/Footer';
import TopGroups from './components/TopGroups';
import TopCallsigns from './components/TopCallsigns';
import LatestActivity from './components/LatestActivity';
import log from './util/logger';
import { getDurationSeconds } from './util/session';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startup: true,
      bmConnected: false,
      topGroups: [],
      topCallsigns: [],
      latestSessions: []
    };

    this.bmlh = new BMLH();
    this.bmagg = new BMAgg(2, 3);

    this.updateAggregations = this.updateAggregations.bind(this);
    this.handleMqttMsg = this.handleMqttMsg.bind(this);
    this.handleConnectionChange = this.handleConnectionChange.bind(this);
    this.handleConnectionBtn = this.handleConnectionBtn.bind(this);
    this.handleAggregatorPrune = this.handleAggregatorPrune.bind(this);
  }

  updateAggregations() {
    log('Top TGs', this.bmagg.topTalkGroups);
    log('Top Callsigns', this.bmagg.topCallsigns);

    this.setState({
      topGroups: this.bmagg.topTalkGroups,
      topCallsigns: this.bmagg.topCallsigns,
      latestSessions: this.bmagg.latestActivity,
    });
  }

  handleConnectionBtn() {
    if (this.state.bmConnected) {
      // disconnect
      if (process.env.NODE_ENV === 'production') {
        ReactGA.event({ category: 'BM Connection', action: 'Disconnect' });
      }

      this.bmlh.close();

      if (this.pruneIntervalId) {
        clearInterval(this.pruneIntervalId);
      }
    } else {
      // connect
      if (process.env.NODE_ENV === 'production') {
        ReactGA.event({ category: 'BM Connection', action: 'Connect' });
      }

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
    log('Session stop received', msg);

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

    if (process.env.NODE_ENV === 'production') {
      // only use analytics in prod
      ReactGA.initialize('UA-121772253-1');
      ReactGA.pageview(window.location.pathname);

      // only open automatically in prod
      this.bmlh.open();
      this.pruneIntervalId = setInterval(this.handleAggregatorPrune, 60000);
    } else {
      this.setState({ startup: false });
    }
  }

  componentWillUnmount() {
    this.bmlh.close();
    
    if (this.pruneIntervalId) {
      clearInterval(this.pruneIntervalId);
    }
  }

  render() {
    const { startup, bmConnected, topGroups, topCallsigns, latestSessions } = this.state;

    return (
      <React.Fragment>
        <Header
          enabled={!startup}
          connected={bmConnected}
          onConnectionClick={this.handleConnectionBtn} />
        
        <main id="App">
          <LatestActivity sessions={latestSessions} />
          <TopGroups talkGroups={topGroups} />
          <TopCallsigns callsigns={topCallsigns} />
        </main>

        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
