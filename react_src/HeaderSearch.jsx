import React, {Component} from 'react';
import axios from './libs/axios';

export default class HeaderSearch extends Component{
  constructor(props){
    super(props);

    this.state={
      result: [],
      kw: ''
    };
  }

  async doSearch(str){
    str=str.trim();

    if(str){
      try{
        let {data}=await axios({
          url: `/autocomplete/${str}`
        });

        this.setState({result: data, kw: str});
      }catch(e){
        alert('数据请求失败，请稍后重试');
        console.error(e);
      }
    }else{
      this.setState({result: [], kw: ''});
    }
  }

  render(){
    const {result}=this.state;

    return (
      <div className="header-search-module">
        <div className="header-search-block">
          <input className="header-search-input" type="text" placeholder="搜索商家或地点" defaultValue={window.kw} onInput={ev=>this.doSearch(ev.target.value)} />
          <button className="header-search-btn" onClick={()=>{
            window.open(`/list?kw=${this.state.kw}`, '_blank')
          }}>
            <span className="header-icon icon-search-new center">
              <img src="./images/search.png" alt="" />
            </span>
          </button>
        </div>
        {result.length>0?(
          <div className="header-search-suggest">
            <div className="header-search-noinput">
              {/*<div className="header-search-history">
                <h6>最近搜索</h6>
                <div className="header-search-clean">删除搜索历史</div>
                <ul>
                  <li><a href="#">亦庄</a></li>
                </ul>
              </div>*/}
              <h6>热门搜索</h6>
              <div className="header-search-hotword">
                {result.map(({title},index)=>(
                  <a href={`/list?kw=${title}`} key={index}>{title}</a>
                ))}
              </div>
            </div>
          </div>
        ):''}
        <div className="header-search-hotword">
          <a href="#">欢乐水魔方水上乐园</a>
          <a href="#">古北水镇</a>
          <a href="#">北京欢乐谷</a>
          <a href="#">北京失恋博物展</a>
          <a href="#">八达岭长城</a>
        </div>
      </div>
    );
  }
}
