import React, { Component } from 'react';
import './App.scss';
import {HiMoon, HiOutlineRefresh, HiSun, HiChevronDown} from 'react-icons/hi';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();

    this.state = {
      moreShown: false,
      data: {},
      location: {},
      quote: {},
      timeOfDay: ''
    }
  }

  getQuote = () => {
    // GETS random quote information
    axios.request({
      method: 'GET',
      url: 'https://quotes15.p.rapidapi.com/quotes/random/',
      headers: {
        'x-rapidapi-key': 'bc394ec79emshcdd01a0d9a29d3dp18f005jsn33a14c5b131e',
        'x-rapidapi-host': 'quotes15.p.rapidapi.com'
      }
    }).then(res=> {
      this.setState({
        quote: res.data
      })
    }).catch(err=>{
      console.error(err)
    });
  }

  getTimeZone = () => {
      // GETS timezone information
    axios.request({
      method: 'GET',
      url: 'https://ip-geo-location.p.rapidapi.com/ip/check',
      params: {format: 'json'},
      headers: {
        'x-rapidapi-key': 'bc394ec79emshcdd01a0d9a29d3dp18f005jsn33a14c5b131e',
        'x-rapidapi-host': 'ip-geo-location.p.rapidapi.com'
      }
    }).then(res=> {
      this.setState({
        location: res.data
      })
    }).catch(err=> {
      console.error(err)
    });
  }

  getTime = () => {
    // GETS time information
    axios.request({
      method: 'GET',
      url: 'https://world-time2.p.rapidapi.com/ip',
      headers: {
        'x-rapidapi-key': 'bc394ec79emshcdd01a0d9a29d3dp18f005jsn33a14c5b131e',
        'x-rapidapi-host': 'world-time2.p.rapidapi.com'
      }
    }).then(res=> {
      this.setState({
        data: res.data
      })
    }).catch(err=> {
      console.error(err)
    });
  }

  checkTimeOfDay = () => {
    const hours = new Date().getHours();
    if (hours >= 18 || hours <= 6) {
      this.setState({
        timeOfDay: 'night'
      })
    } else {
      this.setState({
        timeOfDay: 'day'
      })
    }
  }

  refresh = () => {
    this.getQuote();
    this.getTime();
    this.getTimeZone();
    this.checkTimeOfDay();
  }

  componentDidMount() {
    this.getQuote();
    this.getTime();
    this.getTimeZone();
    this.checkTimeOfDay();
  }

  toggleMoreShow = () => {
    if (this.state.moreShown) {
      this.setState({
        moreShown: false
      })
    } else {
      this.setState({
        moreShown: true
      })
    }
  }

  render() {
    const { data, location, quote, timeOfDay } = this.state;
    return (
      <div className={timeOfDay === 'day' ? "app__container dayBG" : "app__container nightBG"}>
        <div className={this.state.moreShown ? "section-1 shown-1" : "section-1"}>
          <div className="quote__container">
            <p>{quote?.content}<br/><br/><strong>{quote?.originator?.name}</strong></p>
            <HiOutlineRefresh onClick={() => this.refresh()} className="icon"/>
          </div>
          <div className="clock__container">
            <div className="clock">
              <div className="clock-intro">
                { timeOfDay === 'day' ? <HiSun className="icon"/> : <HiMoon className="icon"/> }
                { timeOfDay === 'day' ? 
                  <p className="desktop-greeting">Good Morning, It's Currently</p> :
                  <p className="desktop-greeting">Good Evening, It's Currently</p> }
                {timeOfDay === 'day' ? 
                  <p className="mobile-greeting">Good Morning</p> :
                  <p className="mobile-greeting">Good Evening</p> }
              </div>
              <div className="clock-time">
                <h1>{new Date(data.datetime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}).replace("AM","").replace("PM","")}</h1>
                <p>{data.abbreviation}</p>
              </div>
              <p className="clock-location">In {location?.city?.name}, {location?.area?.name}</p>
            </div>
            <div onClick={()=>this.toggleMoreShow()} className="more-less">
              {this.state.moreShown ? <p>Less</p> : <p>More</p>}
              <div>
                <HiChevronDown className="icon" style={this.state.moreShown ? null : {transform: 'rotate(180deg)'} } />
              </div>
            </div>
          </div>
        </div>
        <div className={this.state.moreShown ? "section-2 shown-2" : "section-2"} 
            style={timeOfDay === 'day' ? {backgroundColor: 'rgba(255,255,255,.75)', color: 'black'} : {backgroundColor: 'rgba(0,0,0,.75)', color: 'white'}}>
          <div className="info__container-1">
            <div className="info-group">
              <p>Current Timezone</p>
              <h2>{location?.time?.timezone}</h2>
            </div>
            <div className="info-group">
              <p>Day of the Year</p>
              <h2>{data.day_of_year}</h2>
            </div>
          </div>
          <div className="div-line"/>
          <div className="info__container-2">
            <div className="info-group">
              <p>Day of the Week</p>
              <h2>{data.day_of_week}</h2>
            </div>
            <div className="info-group">
              <p>Week Number</p>
              <h2>{data.week_number}</h2>
            </div>
          </div>
          <div className="mobile-info__container">
            <div className="mobile-info">
              <p>Current Timezone</p>
              <h3>{location?.time?.timezone}</h3>
            </div>
            <div className="mobile-info">
              <p>Day of the Year</p>
              <h3>{data.day_of_year}</h3>
            </div>
            <div className="mobile-info">
              <p>Day of the Week</p>
              <h3>{data.day_of_week}</h3>
            </div>
            <div className="mobile-info">
              <p>Week Number</p>
              <h3>{data.week_number}</h3>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
