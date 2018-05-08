import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor () {
    super()
    this.state = {
      age: 0,
      principle: 0,
      interest: 0,
      month: 3,
      isShow: false,
      plan: true, // true principleFunc flase installmentFunc
      data: []
    }
  }
  principleFunc () {
    this.setState({
      plan: true
    })
  }
  installmentFunc () {
    this.setState({
      plan: false
    })
  }
  onAgeChange (e) {
    this.setState({age: e.target.value})
  }
  onPrincipleChange (e) {
    this.setState({principle: e.target.value})
  }
  onInterestChange (e) {
    this.setState({interest: e.target.value})
  }
  onMonthChange(event) {
    this.setState({month: event.target.value});
  }
  PMT (ir, np, pv, fv ) {
    /*
    ir - interest rate per month
    np - number of periods (months)
    pv - present value
    fv - future value (residual value)
    */
    let pmt = ( ir * ( pv * Math.pow ( (ir+1), np ) + fv ) ) / ( ( ir + 1 ) * ( Math.pow ( (ir+1), np) -1 ) );
    return pmt;
   }
  PMT(rate, periods, present, future, type) {
    // Credits: algorithm inspired by Apache OpenOffice
  
    // Initialize type
    var type = (typeof type === 'undefined') ? 0 : type;
  
    // Evaluate rate (TODO: replace with secure expression evaluator)
    rate = eval(rate);
  
    // Return payment
    var result;
    if (rate === 0) {
      result = (present + future) / periods;
    } else {
      var term = Math.pow(1 + rate, periods);
      if (type === 1) {
        result = (future * rate / (term - 1) + present * rate / (1 - 1 / term)) / (1 + rate);
      } else {
        result = future * rate / (term - 1) + present * rate / (1 - 1 / term);
      }
    }
    return -result;
  }
  calculatePrincipleFunc () {
    let time = 12 * (60 - parseFloat(this.state.age))
    let period = Math.ceil(this.PMT(parseInt(this.state.interest) / 100, time,  parseInt(this.state.principle), 0, 0))*-1
    let period2 = this.PMT(0.02, 6, 12000, 0, 0)
    console.log("age", this.state.age)
    console.log("period",period) 
    console.log("period2",period2) 
    
    console.log("time",time)
    let interestPerPeriod = 0
    let tmpMonth = parseInt(this.state.month)
    let day = 0
    let _data = []
    let principle_tmp = parseInt(this.state.principle)
    let start = 0
    for (let i = 0; i< time; i++) {
      if (tmpMonth === 1 || tmpMonth === 3|| tmpMonth === 5 || tmpMonth === 7 || tmpMonth === 8 || tmpMonth === 10 || tmpMonth === 12) {
        day = 31
        interestPerPeriod = day * principle_tmp * parseInt(this.state.interest) * 12 / 365 / 100
      } else if (tmpMonth === 2) {
        day = 28
        interestPerPeriod = day * principle_tmp * parseInt(this.state.interest) * 12  / 365 / 100
      } else if (tmpMonth === 4 || tmpMonth === 6 || tmpMonth === 9 || tmpMonth === 11) {
        day = 30
        interestPerPeriod = day * principle_tmp * parseInt(this.state.interest) * 12  / 365 / 100
      }
      if( i === time-1) period = principle_tmp
      start = principle_tmp
      principle_tmp = principle_tmp - (period - interestPerPeriod)
      _data.push ({
        start: start,
        principle_tmp: (period - interestPerPeriod),
        period: period,
        interestPerPeriod: interestPerPeriod
      })
      // console.log("day: ", day)
      // console.log("month: ", tmpMonth)
      if(++tmpMonth > 12)
        tmpMonth = 1
    } 
     
    this.setState({
      isShow: true,
      data: _data
    })
  }
  render() {
    const loanTable = this.state.data.map((data ,index) => (
      <tr key={index}>
        <td>{index+1}</td>
        <td>{parseFloat(data.start).toFixed(2)}</td>
        <td>{parseFloat(data.period).toFixed(2)}</td>
        <td>{parseFloat(data.interestPerPeriod).toFixed(2)}</td>
        <td>{parseFloat(data.principle_tmp).toFixed(2)}</td>
      </tr>
    ))
    return (
      <div className="App" class="container-fluid">
          <h1 align="center">คำนวนเงินกู้</h1>
          <div className="input-field">
            <input placeholder="อายุ" className="validate"  class="form-control" type="text" onChange={this.onAgeChange.bind(this)}/><br/>
          </div>
          <div className="input-field">
            <button class="btn btn-default"  onClick={this.principleFunc.bind(this)}>คำนวนจากเงินต้น</button>
            <button class="btn btn-default"  onClick={this.installmentFunc.bind(this)}>คำนวนจากเงินผ่อนชำระต่องวด</button>
          </div>
          {this.state.plan ? 'principleFunc' : 'installmentFunc'}
          <div>
            <input placeholder="เงินต้น" className="validate"  class="form-control" type="text" onChange={this.onPrincipleChange.bind(this)}/><br/>
            <input placeholder="ดอกเบี้ย" className="validate"  class="form-control" type="text" onChange={this.onInterestChange.bind(this)}/><br/>
            <select value={this.state.month} onChange={this.onMonthChange.bind(this)}>
              <option value="1">ม.ค.</option>
              <option value="2">ก.พ.</option>
              <option value="3">มี.ค.</option>
              <option value="4">เม.ย.</option>
              <option value="5">พ.ค.</option>
              <option value="6">มิ.ย.</option>
              <option value="7">ก.ค.</option>
              <option value="8">ส.ต.</option>
              <option value="9">ก.ย.</option>
              <option value="10">ต.ค.</option>
              <option value="11">พ.ย.</option>
              <option value="12">ธ.ค.</option>
            </select>
            <button class="btn btn-default"  onClick={this.calculatePrincipleFunc.bind(this)}>คำนวน</button>
          </div>
          <div>
            {this.state.isShow ? <table border='1'>
          <thead>
            <tr>
              <th>งวดที่</th>
              <th>เงินต้นคงเหลือ</th>
              <th>จ่ายต่อเดือน</th>
              <th>ดอกเบี้ยต่อเดือน</th>
              <th>เงินต้นชำระต่อเดือน</th>
            </tr>
          </thead>
          <tbody>
            {loanTable}
          </tbody>
        </table> : 'no eiei'}
          </div>
      </div>
    );
  }
}

export default App;
