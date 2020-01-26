// common filters

import _ from 'lodash';
import log from './logger';

export const hasNameFilter = (item) => ( _.has(item, 'name') && !_.isEmpty(item.name) );

export const hasCallsignFilter = (item) => ( _.has(item, 'callsign') && !_.isEmpty(item.callsign) );

export const createNameFilter = (fname) => {
  try {
    const re = new RegExp(fname, 'i');
    return (item) => ( _.has(item, 'name') && item.name.search(re) >= 0 );
  } catch (err) {
    log(`Ignoring invalid filter expression: ${fname}`, err);
    return (item) => true;
  }
}

export const createCallsignFilter = (fcallsign) => {
  try {
    const re = new RegExp(fcallsign, 'i');
    return (item) => ( _.has(item, 'callsign') && item.callsign.search(re) >= 0 );
  } catch (err) {
    log(`Ignoring invalid filter expression: ${fcallsign}`, err);
    return (item) => true;
  }
}

export const createNameCallsignFilter = (fname, fcallsign) => {
  const matchesName = createNameFilter(fname);
  const matchesCallsign = createCallsignFilter(fcallsign);

  return (item) => ( matchesName(item) || matchesCallsign(item) );
}
