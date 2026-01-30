"use strict"; 

const listeners = [];

export const state = {
  mode: "movie",              //conectar
  trendingType: "week",      //conectar
  searchTerm: "",           //feito
  items: [],               //feito
  selectedItem: null      //feito
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

