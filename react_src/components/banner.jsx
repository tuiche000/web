import React, {Component} from 'react';
import {wait, rmTransition} from '../libs/animate';

export default class Banner extends Component{
  constructor(props){
    super(props);

    this.state={
      now: 0,
      left: 0
    };
  }

  get cur(){
    const {sliders}=this.props;

    return sliders[this.state.now];
  }

  get next(){
    const {sliders}=this.props;

    return sliders[(this.state.now+1)%sliders.length];
  }

  async gotoNext(){
    const {sliders}=this.props;
    const slider=document.querySelector('.slider-content');

    this.setState({
      left: -550
    });

    await wait(slider);
    await rmTransition(slider);

    this.setState({
      left: 0,
      now: (this.state.now+1)%sliders.length
    }, ()=>{
      setTimeout(()=>{
        slider.style.transition='';
      }, 10);
    });
  }

  async gotoPrev(){
    const {sliders}=this.props;
    const slider=document.querySelector('.slider-content');

    await rmTransition(slider);

    this.setState({
      left: -550,
      now: (this.state.now+sliders.length-1)%sliders.length
    }, async ()=>{
      setTimeout(()=>{
        slider.style.transition='';

        setTimeout(()=>{
          this.setState({
            left: 0
          });
        }, 10);
      }, 10);
    });
  }

  render(){
    const {banners}=this.props;

    return (
      <div className="right-banner">
        <div className="home-header-links" data-bid="2">
          <a href="#">美团外卖</a>
          <a href="#">猫眼电影</a>
          <a href="#" data-bid="1">美团酒店</a>
          <a href="#">民宿/公寓</a>
          <a href="#">商家入驻</a>
          <a href="#">美团公益</a>
        </div>
        <div className="banner-row">
          <div className="item banner-slider shadow">
            <div className="slider">
              <div className="slider-content" style={{width: '1100px', transform: `translateX(${this.state.left}px)`}}>
                <div className="slider-item">
                  <div className="slider-img-div" style={{backgroundImage: `url(${this.cur.img})`}} />
                </div>
                <div className="slider-item" style={{left: '550px'}}>
                  <div className="slider-img-div" style={{backgroundImage: `url(${this.next.img})`}} />
                </div>
              </div>
              <div className="slider-pagination">
                <div className="pagination cur" />
                <div className="pagination" />
              </div>
              <div className="btn btn-next" onClick={()=>{
                this.gotoNext()
              }}><i className="iconfont icon-arrow-right-" /></div>
              <div className="btn btn-pre" onClick={()=>{this.gotoPrev()}}><i className="iconfont icon-arrow-left-" /></div>
            </div>
          </div>
          <div className="item shadow pic-1" style={{backgroundImage: `url(${banners[0].img})`}} />
          <div className="item banner-logincard">
            <div className="login-container">
              {/* 未登录 */}
              <div className="default" style={{display: 'none'}}>
                <div className="head-img-row">
                  <img src="http://s0.meituan.net/bs/fe-web-meituan/e350c4a/img/avatar.jpg" alt="" />
                </div>
                <p className="user-name">Hi！你好</p>
                <a href="#" className="btn-login">注册</a>
                <a href="#" className="btn-login">立即登录</a>
              </div>
              {/* 登录后 */}
              <div className="default">
                <div className="setting">
                  <div className="icon"><i className="iconfont icon-icon_setting" /></div>
                </div>
                <div className="head-img-row">
                  <img src="http://s0.meituan.net/bs/fe-web-meituan/e350c4a/img/avatar.jpg" alt="" />
                </div>
                <div className="nickname-row">
                  <p className="user-name">你好</p>
                </div>
                <div className="fn-row clearfix">
                  <div className="fn-item">
                    <div className="icon">
                      <i className="iconfont icon-fenshiduanxiaoshou" />
                    </div>
                    <div className="fn-name">
                      我的订单
                    </div>
                  </div>
                  <div className="fn-item">
                    <div className="icon">
                      <i className="iconfont icon-weixintongzhi" />
                    </div>
                    <div className="fn-name">
                      我的收藏
                    </div>
                  </div>
                  <div className="fn-item">
                    <div className="icon">
                      <i className="iconfont icon-qunfariji" />
                    </div>
                    <div className="fn-name">
                      抵用券
                    </div>
                  </div>
                </div>
                <div className="fn-row clearfix">
                  <div className="fn-item">
                    <div className="icon">
                      <i className="iconfont icon-caiwuxiangqing" />
                    </div>
                    <div className="fn-name">
                      余额
                    </div>
                  </div>
                  <div className="fn-item">
                    <div className="icon">
                      <i className="iconfont icon-gengduo" />
                    </div>
                    <div className="fn-name">
                      更多
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="banner-row">
          <div className="item pic-2 shadow" style={{backgroundImage: `url(${banners[1].img})`}} />
          <div className="item pic-3 shadow" style={{backgroundImage: `url(${banners[2].img})`}} />
          <div className="item pic-4 shadow" style={{backgroundImage: `url(${banners[3].img})`}} />
          <div className="item download-app">
            <div className="qrcode-box">
              <img src="http://s1.meituan.net/bs/fe-web-meituan/60ac9a0/img/download-qr.png" alt="下载APP" />
            </div>
            <div className="app-name">美团APP手机版</div>
            <div className="sl">
              <span className="red">1元起</span>
              <span className="gary">吃喝玩乐</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
