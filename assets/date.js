Number.prototype.pad = function (size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

module.exports = {
  logTime: function () {
    const date = new Date();
    const h = parseInt(date.getUTCHours()).pad(2);
    const m = parseInt(date.getUTCMinutes()).pad(2);
    const s = parseInt(date.getUTCSeconds()).pad(2);
    const ms = parseInt(date.getUTCMilliseconds()).pad(3);
    return `[${h}:${m}:${s}:${ms}]`;
  },
  getStartOfDay: function () {
    /**
     * @returns Date object
     */
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  },
};
