function getType(title, config) {
  if(title == "" || title == "Task Switching") return {id: 0, type: "idle"}
  for(let typeData of config.data) {
    if(!typeData.keywords) continue;
    if(typeData.isWebsite) {
      if(title.includes(" - Google Chrome")) {
        for(let keyword of typeData.keywords) {
          if(title.includes(keyword)) {
            return {id: typeData.id, type: typeData.type};
          }
        }
      }
    } else {
      for(let keyword of typeData.keywords) {
        if(title.includes(keyword)) {
          return {id: typeData.id, type: typeData.type};
        }
      }
    }
  }
  if(title.includes(" - Google Chrome")) return {id: 2, type: "webbrowsing"}
  return {id: 1, type: "other"};
}

function encodeActivity(activity) {
  // first 8-bits = type
  // second 32-bits = start - unix epoch - works til  
  // third 24-bits = duration
  
  let result = 0n;
  result += BigInt(activity.type);
  result += BigInt(activity.start) << 8n;
  result += BigInt(activity.dur) << (8n+32n);
  return result;
}

function decodeActivity(activity) {
    const typeMask = 0xFFn, startMask = 0xFFFFFFFF00n, durMask = 0xFFFFFF0000000000n;
    activity = BigInt(activity);
    return {
        type: Number(activity & typeMask),
        start: Number((activity & startMask) >> (8n)),
        dur: Number((activity & durMask) >> (8n+32n)),
    }
}

module.exports.getType = getType;
module.exports.encodeActivity = encodeActivity;
module.exports.decodeActivity = decodeActivity;
