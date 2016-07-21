'use strict';

/**
 * Dependencies
 */

const { createStore, combineReducers } = require('redux');

const initialState = {
  items: [],
  openItem: null,
  indicateScanning: false
};

const reducer = (state, action) => {
  if (!state) return initialState;
  console.log('action', action.type, action);

  switch (action.type) {
    case 'ADD_ITEM': return { ...state, items: [action.item, ...state.items] };
    case 'OPEN_ITEM': return { ...state, openItem: findItem(state.items, action.id) };
    case 'CLOSE_ITEM': return { ...state, openItem: null };
    default: return state;
  }
};

function findItem(items, id) {
  console.log('find item', id);
  for (var i = 0; i < items.length; i++) {
    if (items[i].id === id) return items[i];
  }
}

/**
 * Exports
 */

module.exports = createStore(reducer);
