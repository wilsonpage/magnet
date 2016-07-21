
/**
 * Dependencies
 */

const debug = require('../debug')('AppNavigator');
const ReactNative = require('react-native');
const { connect } = require('react-redux');
const ItemScene = require('./item-scene');
const ListScene = require('./list-scene');
const React = require('react');

const {
  StyleSheet,
  Navigator,
  View,
} = ReactNative;

/**
 * Main app view
 *
 * @type {ReactComponent}
 */
class AppNavigator extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps);
    if (nextProps.openItem !== this.props.openItem) this.onOpenItemChange(nextProps.openItem);
  }

  render() {
    return (
      <Navigator
        ref="navigator"
        initialRoute={{type: 'list'}}
        configureScene={() => Navigator.SceneConfigs.FloatFromBottom}
        renderScene={this.renderScene.bind(this)}
      />
    );
  }

  renderScene(route, navigator) {
    switch (route.type) {
      case 'list': return <ListScene
        items={this.props.items}
        onItemPress={this.props.actions.openItem}
        navigator={navigator} />
      case 'item': return <ItemScene
        navigator={navigator}
        onClose={this.props.actions.closeItem}
        item={this.props.openItem} />
    }
  }

  onOpenItemChange(item) {
    if (item) this.refs.navigator.push({ type: 'item' })
    else this.refs.navigator.pop();
  }
}

AppNavigator.propTypes = {
  style: View.propTypes.style,
  openItem: React.PropTypes.object,
  actions: React.PropTypes.object,
  items: React.PropTypes.array,
}

const styles = StyleSheet.create({

});

const mapStateToProps = function(store) {
  return {
    openItem: store.openItem,
    items: store.items,
  };
}

/**
 * Exports
 */

module.exports = connect(mapStateToProps)(AppNavigator);
