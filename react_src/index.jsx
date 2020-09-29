import React from 'react';
import ReactDOMServer from 'react-dom/server';

import BannerContainer from './BannerContainer';
import HeaderSearch from './HeaderSearch';
import List from './List';
import Cart from './Cart';

if(typeof window!=='undefined'){
  window.BannerContainer=BannerContainer;
  window.HeaderSearch=HeaderSearch;
  window.List=List;
  window.Cart=Cart;
}

export function render(options){
  return ReactDOMServer.renderToString(<BannerContainer {...options} />);
}
