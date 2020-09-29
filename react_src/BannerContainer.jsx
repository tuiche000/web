import React, {Component} from 'react';
import Catalog from './components/catalog';
import Banner from './components/banner';

export default class BannerContainer extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div>
        <Catalog {...this.props} />
        <Banner {...this.props} />
      </div>
    );
  }
}
