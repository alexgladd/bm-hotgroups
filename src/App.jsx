import React from 'react';
import ReactGA from 'react-ga';
import moment from 'moment';
import BMLH from './util/bmlastheard';
import BMAgg from './util/bmagg';
import BMAct from './util/bmactive';
import Header from './components/Header';
import Footer from './components/Footer';
import CurrentlyActive from './components/CurrentlyActive';
import TopGroups from './components/TopGroups';
import TopCallsigns from './components/TopCallsigns';
import log from './util/logger';
import { startSessionFilter, endSessionFilter } from './util/session';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startup: true,
      bmConnected: false,
      activeSessions: [],
      activeGroups: [],
      topGroups: [],
      activeCallsigns: [],
      topCallsigns: [],
      latestSessions: []
    };

    this.bmlh = new BMLH();
    this.bmact = new BMAct(5);
    this.bmagg = new BMAgg(2, 5);

    this.updateActives = this.updateActives.bind(this);
    this.updateAggregations = this.updateAggregations.bind(this);
    this.handleStartMsg = this.handleStartMsg.bind(this);
    this.handleStopMsg = this.handleStopMsg.bind(this);
    this.handleConnectionChange = this.handleConnectionChange.bind(this);
    this.handleConnectionBtn = this.handleConnectionBtn.bind(this);
    this.handleAggregatorPrune = this.handleAggregatorPrune.bind(this);
  }

  updateActives() {
    // log('Active TGs', this.bmact.activeTalkgroups);
    // log('Active Callsigns', this.bmact.activeCallsigns);

    this.setState({
      activeSessions: this.bmact.activeSessions,
      activeGroups: this.bmact.activeTalkgroups,
      activeCallsigns: this.bmact.activeCallsigns,
    });
  }

  updateAggregations() {
    // log('Top TGs', this.bmagg.topTalkGroups);
    // log('Top Callsigns', this.bmagg.topCallsigns);

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

      this.bmact.reset();
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

  handleStartMsg(msg) {
    log('Session start received', msg);

    // add local start time
    msg.localStart = moment().unix();

    const endResults = this.bmact.addSessionStart(msg)
    if (endResults) {
      log('Session end results', endResults);
      this.updateActives();
    }
  }

  handleStopMsg(msg) {
    log('Session end received', msg);

    // add local stop time
    msg.localStop = moment().unix();

    const endResult = this.bmact.addSessionStop(msg)
    if (endResult) {
      log('Session end result', endResult);
      this.updateActives();
    }

    if (this.bmagg.addSession(msg)) {
      this.updateAggregations();
    }
  }

  // handleDebugMsg(msg) {
  //   log('Message received', msg);
  // }

  handleAggregatorPrune() {
    if (this.bmagg.prune()) {
      this.updateAggregations();
    }
  }

  componentDidMount() {
    // const startMsgFilter = (msg) => {
    //   return msg.DestinationID > 90 && msg.SessionType === 7 && msg.Event === 'Session-Start';
    // };

    // const stopMsgFilter = (msg) => {
    //   if (msg.DestinationID > 90 && msg.SessionType === 7 && msg.Event === 'Session-Stop') {
    //     return getDurationSeconds(msg) > 0;
    //   } else {
    //     return false;
    //   }
    // };

    this.bmlh.onConnectionChange(this.handleConnectionChange);
    this.bmlh.onMqtt(this.handleStartMsg, true, startSessionFilter);
    this.bmlh.onMqtt(this.handleStopMsg, false, endSessionFilter);

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
    const { startup, bmConnected, activeSessions, topGroups, topCallsigns } = this.state;

    return (
      <React.Fragment>
        <Header
          enabled={!startup}
          connected={bmConnected}
          onConnectionClick={this.handleConnectionBtn} />
        
        <main id="App">
          <CurrentlyActive sessions={activeSessions} />
          <TopGroups talkGroups={topGroups} />
          <TopCallsigns callsigns={topCallsigns} />
        </main>

        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
