
/**
 * Dependencies
 */

const { Provider, bindActionCreators } = require('react-redux');
const actionCreators = require('../action-creators');
const store = require('../store');
const React = require('react');
const App = require('./app');

class MyProvider extends React.Component {
  constructor(props) {
    super(props);

    this.scanner = props.scanner || new Scanner({  // eslint-disable-line
      onFound: actions.addItem,
      onLost: actions.removeItem,
    });
  }

  render() {
    return <Provider store={store} {...actions}><App/></Provider>;
  }
}

module.exports = MyProvider;
