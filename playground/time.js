const moment = require("moment");

var date = moment();
console.log(date.format("hh:mm A"));
date.add(1, "year").subtract(1, "month");
console.log(date.format("Do MMM YYYY"));
