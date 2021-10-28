export function timeToMinute (times) {
  if (times <= -1) {
    return '00:00:00'
  }
  var t = ''
  var hour = Math.floor(times / 3600)
  var min = Math.floor(times / 60) % 60
  var sec = times % 60
  if (hour < 10) {
    t = '0' + hour + ':'
  } else {
    t = hour + ':'
  }
  if (min < 10) {
    t += '0'
  }
  t += min + ':'
  if (sec < 10) {
    t += '0'
  }
  t += sec.toFixed(2)
  t = t.substring(0, t.length - 3)
  return t
}
