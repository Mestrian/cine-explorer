"use strict"; 

const listeners = [];

export const state = {
  mode: "movie",              //movie || tv
  trendingType: "week",      //week || day
  searchTerm: "",           //
  items: [],               //
  selectedItem: null      //item id
}

export function setState(partialState){
  Object.assign(state, partialState);

  listeners.forEach(fn => {
    fn(state);
  });
}

export function subscribe(fn) {
  listeners.push(fn);
  fn(state);
}

