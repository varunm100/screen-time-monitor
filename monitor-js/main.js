const activeWin = require('active-win');
const fs = require('fs');
const { getType, encodeActivity, decodeActivity} = require('./Activity')
const readLastLines = require('read-last-lines');

let config = {};
let events = [];

fs.readFile("./config.json", "utf8", (err, data) => {
  if(err) console.log(err);
  else {
   config = JSON.parse(data);
   startPolling();
  }
})
const outputFile = "C:\\Users\\varun\\Documents\\ActivityMonitor.org";

function getCurrTime() {
  return Math.floor(Date.now()/1000);
}

function getActiveWin() {
  let res = activeWin.sync();
  return res ? res.title : '';
}

async function updateEventFile(pos){
  let lastLine = await readLastLines.read(outputFile, 1);
  let prevEvent = Number.parseInt(lastLine);
  if(prevEvent) {
    prevEvent = decodeActivity(prevEvent);
    if(prevEvent.start == events[pos].start) {
      let stats = fs.statSync(outputFile);
      fs.truncateSync(outputFile, stats.size-lastLine.length);
    }
  }
  let output = "";
  for(let i = pos; i < events.length; ++i){
    output += (encodeActivity(events[i])+'\n'); 
  }
  fs.appendFileSync(outputFile, output);
}

let first = false, count=1, prevEvent, firstType=0, pos=0;
function startPolling() {
  events.push({ type: getType(getActiveWin(), config).id, start: getCurrTime(), dur: 0});
  prevEvent = { type: events[events.length-1].type, start: events[events.length-1].start, dur: events[events.length-1].dur};
  firsType = prevEvent.type;
  let period = Math.floor(config.autosaveFreq/config.pollingFreq);
  setInterval(() => {
    let title = getActiveWin();
    let currType = getType(title, config);
    console.log(`${currType.type} | ${title}`);
    currType = currType.id;
    if(first) firstType = currType, first=false;
    let currTime = getCurrTime();
    events[events.length-1].dur = events[events.length-1].dur+Math.floor(config.pollingFreq/1000); 
    if(currType != prevEvent.type) {
      prevEvent.type = currType;
      prevEvent.start = currTime;
      events.push({type: currType, start: currTime, dur: 0 });
    }
    if(period - count++ == 0) {
      // auto-save
      updateEventFile(pos, firstType)
      count = 1;
      first = true;
      pos = events.length-1;
    }
  }, config.pollingFreq);
}