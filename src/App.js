import {useState, useEffect} from 'react';
import Timeline from './Components/Timeline';
import moment from 'moment'
import { getTypeStr, getTotals, getTimeFromSec, getColor} from './Activity';
import { PieChart } from 'react-minimal-pie-chart';

const { ipcRenderer } = window.require('electron');

let config;
let data;

let tlItems = [];
let groups = []
let grandTotal = 0;
let totals = [];
let piechart = [];
let totalUsage = 0;

function getCurrTime() {
  return new Date().toISOString().substr(11, 8);
}

function updateDataOnTime(value) {
  if(value === 'today') {
    let now = new Date();
    let startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let timestamp = startOfDay / 1000;
    let newData = data.filter(event => event.start >= timestamp);
      totals = getTotals(newData, config);
      let i=0;
      grandTotal = totals.reduce((accum, total) => (accum+total));
      piechart = [];
      totalUsage = 0;
      for(let total of totals) {
        if(Math.floor((total/grandTotal)*100) > 0) {
          piechart.push({title: getTypeStr(i, config), value: total, color: getColor(i, config)})
        }
        if(i !== 0) totalUsage += total;
        ++i;
      }
      console.log(piechart);
  } else if(value === 'alltime') {
      totals = getTotals(data, config);
      totalUsage = 0;
      let i=0;
      grandTotal = totals.reduce((accum, total) => (accum+total));
      piechart = [];
      for(let total of totals) {
        if(Math.floor((total/grandTotal)*100) > 0) {
          piechart.push({title: getTypeStr(i, config), value: total, color: getColor(i, config)})
        }
        if(i !== 0) totalUsage += total;
        ++i;
      }
  }
}

function App() {
  const [update, setUpdate] = useState(false);
  const [time, setTime] = useState(getCurrTime());
  const [changeTime, setChangeTime] = useState('alltime');
  useEffect(() => {
    ipcRenderer.on('data', (e, msg) => {
      config = msg.config;
      data = msg.data;
      if(e) console.log(e)
      console.log(`Got data ${msg}`)
      totals = getTotals(msg.data, msg.config);
      let i  =0;
      grandTotal = totals.reduce((accum, total) => accum+=total);
      totalUsage = grandTotal - totals[0];
      for(let total of totals) {
        if(Math.floor((total/grandTotal)*100) > 0) {
          piechart.push({title: getTypeStr(i, msg.config), value: total, color: getColor(i, config)})
        }
        ++i;
      }
      for(let group of msg.config.data) {
        groups.push({id: group.id, title: group.type})
      }
      i = 0;
      tlItems = msg.data.map((event) => {
        return {
          id: i++,
          group: event.type,
          title: getTypeStr(event.type, msg.config),
          canMove: false,
          canResize: false,
          start_time: event.start*1000,
          end_time: event.start*1000+event.dur*1000,
          bgColor: getColor(event.type, config),
        }  
      })
      console.log(tlItems[0])
      console.log(groups[0])
      setUpdate(true);
      setInterval(()=>{setTime(getCurrTime())}, 1000);
    })
  }, [update]);

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <Timeline 
        groups={groups}
        items={tlItems}
        style={{height: '120%'}}/>
        <div>
          <select name="time" id="timeperiod" onChange={(e) => {
            updateDataOnTime(e.currentTarget.value);
            setChangeTime(e.currentTarget.value);
            console.log(e.currentTarget.value);
          }}>
            <option value="alltime">All Time</option>
            <option value="today">Today</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
        <div style={{display: 'flex', padding: '25px'}}>
        <div style={{flex: 1, paddingLeft: '15px', border: '1px solid white', borderRadius: '15px'}}>
          <p style={{color: 'gray', fontSize: '23px'}}> Total Usage: {getTimeFromSec(totalUsage)}</p>
      {
        totals.map((total, i) => {
          return (
            <p style={{color: getColor(i, config), fontSize: '23px'}}>{getTypeStr(i, config)} - {getTimeFromSec(total)}</p>
          )
        })
      }
        </div>
      <div style={{flex: 1, margin: '20px', border: '1px solid white', borderRadius: '15px'}}>
      <PieChart data={piechart}
                label={({ dataEntry }) => `${dataEntry.title.toUpperCase()} - ${Math.round(dataEntry.percentage)} %`}
                labelStyle={(index) => ({
        fontSize: '4px',
        fontFamily: 'sans-serif',
      })}
      style={{ height: '100%' }}/>
      </div>
      <div style={{flex: 1, display: 'flex', border: '1px solid white', borderRadius: '15px', justifyContent: 'center', alignItems: 'center'}}>
       <p style={{fontSize: '6vw'}}>{time}</p> 
      </div>
        </div>
    </div>
  );
}

export default App;