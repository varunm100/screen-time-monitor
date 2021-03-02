function decodeEvent(event) {
    const typeMask = 0xFFn, startMask = 0xFFFFFFFF00n, durMask = 0xFFFFFF0000000000n;
    return {
        type: Number(event & typeMask),
        start: Number((event & startMask) >> (8n)),
        dur: Number((event & durMask) >> (8n+32n)),
    }
}

function getTypeStr(id, config) {
  return config.data[id].type;
}

function getColor(id, config){
  return '#'+config.data[id].color;
}

function getTimeFromSec(seconds) {
  return new Date(seconds*1000).toISOString().slice(-13, -5)
}

function getTotals(events, config){
  let totals = new Array(config.data.length).fill(0);
  for (let event of events) {
    totals[event.type] += event.dur+1;
  }
  return totals;
}

module.exports.getTimeFromSec = getTimeFromSec;
module.exports.decodeEvent = decodeEvent;
module.exports.getTypeStr = getTypeStr;
module.exports.getTotals = getTotals;
module.exports.getColor = getColor;