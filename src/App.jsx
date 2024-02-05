import React from 'react';
import ReactGA from 'react-ga4';
import moment from 'moment';
import BMLH from './util/bmlastheard';
import BMAgg from './util/bmagg';
import BMAct from './util/bmactive';
import Header from './components/Header';
import Footer from './components/Footer';
import CurrentlyActive from './components/CurrentlyActive';
import TopGroups from './components/TopGroups';
import TopCallsigns from './components/TopCallsigns';
import { startSessionFilter, endSessionFilter } from './util/session';
import './App.css';
import Controls from './components/Controls';

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
      latestSessions: [],
      aggregationWindowMins: 5,
      maxAggregationWindowMins: 10,
    };

    this.bmlh = new BMLH();
    this.bmact = new BMAct(this.state.aggregationWindowMins);
    this.bmagg = new BMAgg(this.state.aggregationWindowMins, this.state.maxAggregationWindowMins);

    this.updateActives = this.updateActives.bind(this);
    this.updateAggregations = this.updateAggregations.bind(this);
    this.handleStartMsg = this.handleStartMsg.bind(this);
    this.handleStopMsg = this.handleStopMsg.bind(this);
    this.handleConnectionChange = this.handleConnectionChange.bind(this);
    this.handleConnectionBtn = this.handleConnectionBtn.bind(this);
    this.handleAggregatorPrune = this.handleAggregatorPrune.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  updateActives() {
    this.setState({
      activeSessions: this.bmact.activeSessions,
      activeGroups: this.bmact.activeTalkgroups,
      activeCallsigns: this.bmact.activeCallsigns,
    });
  }

  updateAggregations() {
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
    // add local start time
    msg.localStart = moment().unix();

    const endResults = this.bmact.addSessionStart(msg)
    if (endResults) {
      this.updateActives();

      if (this.bmagg.addEndedSessions(endResults)) {
        this.updateAggregations();
      }
    }
  }

  handleStopMsg(msg) {
    // add local stop time
    msg.localStop = moment().unix();

    const endResult = this.bmact.addSessionStop(msg)
    if (endResult) {
      this.updateActives();

      if (this.bmagg.addEndedSessions([endResult])) {
        this.updateAggregations();
      }
    }
  }

  handleAggregatorPrune() {
    if (this.bmagg.prune()) {
      this.updateAggregations();
    }
  }

  handleReset() {
    if (process.env.NODE_ENV === 'production') {
      ReactGA.event({ category: 'Aggregation', action: 'Clear' });
    }

    this.bmact.reset();
    this.updateActives();
    this.bmagg.reset();
    this.updateAggregations();
  }

  componentDidMount() {
    this.bmlh.onConnectionChange(this.handleConnectionChange);
    this.bmlh.onMqtt(this.handleStartMsg, true, startSessionFilter);
    this.bmlh.onMqtt(this.handleStopMsg, false, endSessionFilter);

    if (process.env.NODE_ENV === 'production') {
      // only use analytics in prod
      ReactGA.initialize('G-LSNRGQJRG7');
      ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Brandmeister Top Activity" });

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
    const {
      startup,
      bmConnected,
      activeSessions,
      topGroups,
      topCallsigns,
      aggregationWindowMins, } = this.state;

    return (
      <React.Fragment>
        <Header
          enabled={!startup}
          connected={bmConnected}
          onConnectionClick={this.handleConnectionBtn} />
        
        <main id="App">
          <Controls
            aggMins={aggregationWindowMins}
            enabled={!startup}
            connected={bmConnected}
            onConnectionClick={this.handleConnectionBtn}
            onResetClick={this.handleReset} />
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
