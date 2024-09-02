const { DateTime } = require("luxon");

module.exports = {
    convertToLocal: function(ctx, utcDateTime) {
        const d = DateTime.fromISO(utcDateTime, {zone: 'UTC+3'});
        console.log(d.toLocaleString(DateTime.DATETIME_MED));
        return d.toLocaleString(DateTime.DATETIME_MED);
    }
}