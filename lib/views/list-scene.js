
/**
 * Dependencies
 */

const ReactNative = require('react-native');
const { connect } = require('react-redux');
const ListView = require('./list');
const React = require('react');

const {
  StyleSheet,
} = ReactNative;

class ListScene extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <ListView
        ref="list"
        style={{flex:1}}
        items={this.props.items}
        scanning={this.props.scanning}
        onRefresh={this.onRefresh.bind(this)}
        onItemPressed={this.props.onItemPress}
        onItemSwiped={this.onItemSwiped.bind(this)}/>
    );
  }

  onRefresh() {}
  onItemSwiped() {}
}

ListScene.propTypes = {
  items: React.PropTypes.array,
  scanning: React.PropTypes.bool,
  navigator: React.PropTypes.object,
  onItemPress: React.PropTypes.func.isRequired
};

const mapStateToProps = function(store) {
  console.log('items', store.items);
  return { items: store.items };
}

/**
 * Exports
 */

module.exports = connect(mapStateToProps)(ListScene);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
