
/**
 * Dependencies
 */

const ReactNative = require('react-native');
const React = require('react');

var {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} = ReactNative;

class ItemScene extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.root}>
        <TouchableOpacity onPress={this.props.onClose}><Text>Back</Text></TouchableOpacity>
        <View>
          <Text>{this.props.item.displayUrl}</Text>
        </View>
      </View>
    );
  }
}

ItemScene.propTypes = {
  onClose: React.PropTypes.func.isRequired,
  item: React.PropTypes.object.isRequired,
};

/**
 * Exports
 */

module.exports = ItemScene;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
