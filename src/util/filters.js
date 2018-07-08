// common filters

import _ from 'lodash';

export const hasNameFilter = (item) => ( _.has(item, 'name') && !_.isEmpty(item.name) );

export const createNameFilter = (fname) => {
  const re = new RegExp(fname, 'i');

  return (item) => ( _.has(item, 'name') && item.name.search(re) >= 0 );
}
