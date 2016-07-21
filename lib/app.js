'use strict';

/**
 * Dependencies
 */

const Metrics = require('./utils/metrics').Metrics;
var AppNavigator = require('./views/navigator');
var ReactNative = require('react-native');
var theme = require('../config').theme;
var { connect, Provider } = require('react-redux');
var { bindActionCreators } = require('redux');
var debug = require('./debug')('App');
var React = require('react');
const Scanner = require('./scanner');
const store = require('./store');
const actionCreators = require('./action-creators');
const actions = bindActionCreators(actionCreators, store.dispatch);

var {
  BackAndroid,
  StyleSheet,
  StatusBar,
  AppState,
  Alert,
  View,
} = ReactNative;


/**
 * The length of time we expect to
 * find nearby items in.
 *
 * If nothing is found in this time
 * period, we assume there's nothing
 * there.
 *
 * @type {Number}
 */
const INITIAL_SCAN_PERIOD = 8000; // 8secs

/**
 * Main app view
 *
 * @type {ReactComponent}
 */
class AppView extends React.Component {
  constructor(props) {
    super(props);

    // Metrics
    Metrics.launch();
    Metrics.install();

    // initial state
    this.state = {
      listExpanded: false,
      items: []
    };

    this.scanning = false;

    this.scanner = props.scanner || new Scanner({  // eslint-disable-line
      onFound: actions.addItem,
      onLost: actions.removeItem,
    });

    this.scanner.on('networkerror', this.onScannerNetworkError.bind(this));

    // respond to app background/foreground changes
    AppState.addEventListener('change', this.onAppStateChanged.bind(this));

    // respond to android hardware back button press
    BackAndroid.addEventListener('hardwareBackPress', this.onAndroidBack.bind(this))
  }

  componentDidMount() {
    debug('mounted');
    this.startScanning();
  }

  startScanning() {
    if (this.scanning) return;
    debug('start scanning');
    this.scanner.start()
      .then(() => {
        this.setState({ initialScanPeriod: true });
        this.scanning = true;

        clearTimeout(this.initialScanPeriodTimeout);
        this.initialScanPeriodTimeout = setTimeout(() => {
          this.setState({ initialScanPeriod: false });
        }, INITIAL_SCAN_PERIOD);
      });
  }

  stopScanning() {
    if (!this.scanning) return;
    debug('stop scanning');
    this.scanner.stop();
    this.setState({ initialScanPeriod: false });
    this.scanning = false;
    debug('stopped', this.scanning);
  }

  render() {
    debug('render');

    return (
        <Provider store={store}>
          <AppNavigator actions={actions}/>
        </Provider>
    );
  }

  /**
   * Responds to Android hardware back button.
   *
   * Returning `false` indicates the app
   * isn't handling the event and allows
   * the system to respond.
   *
   * @return {Boolean}
   */
  onAndroidBack() {
    debug('android back');

    // contract list if expanded
    // if (this.state.listExpanded) {
    //   this.contractList();
    //   return true;
    // }

    // let system handle event
    // (minimises android app)
    return false;
  }

  onAppStateChanged(state) {
    debug('app state changed', state);
    switch (state) {
      case 'active': this.startScanning(); break;
      case 'background': this.stopScanning(); break;
    }
  }

  onScannerNetworkError() {
    debug('on network error');
    if (this.networkAlertOpen) return;
    this.networkAlertOpen = true;

    Alert.alert(
      'Network error',
      'Please check your internet connection',
      [{
        text: 'OK',
        onPress: this.onNetworkAlertClosed.bind(this)
      }]
    );
  }

  onNetworkAlertClosed() {
    setTimeout(() => this.networkAlertOpen = false, 500)
  }
}

AppView.propTypes = {
  style: View.propTypes.style
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    flex: 1,
    backgroundColor: theme.colorBackground
  },

  headerBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    height: 56,
    backgroundColor: 'rgba(242,242,242,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  }
});

/**
 * Exports
 */

module.exports = AppView;
