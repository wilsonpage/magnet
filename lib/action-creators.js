
exports.addItem = (item) => {
  return {
    type: 'ADD_ITEM',
    item
  };
}

exports.removeItem = (id) => {
  return {
    type: 'REMOVE_ITEM',
    id
  };
}

exports.openItem = (id) => {
  return {
    type: 'OPEN_ITEM',
    id
  };
}

exports.closeItem = () => {
  return {
    type: 'CLOSE_ITEM'
  };
}
