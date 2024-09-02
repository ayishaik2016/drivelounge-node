"use strict";

module.exports = {
  create: {
        appname: {type: "string", min: 4,required: true},
        appdescription: {type: "string", min: 4,required: true},
        metakeyword: {type: "string", min: 4,required: true},
        metadescription: {type: "string", min: 4,required: true},
        email: {type: "string", min: 4,required: true},
        contactnumber: {type: "string", min: 4,required: true},
        contactaddress: {type: "string", min: 4,required: true},
        mapkey: {type: "string", min: 4,required: true},
        site_copyright: {type: "string", min: 4,required: true},
        // hour_format: {type: "string", min: 2,required: true},
        // currency_code: {type: "string", min: 3,required: true},
        currency_decimalplace:  {type: "number", min: 1,required: true},
        currency_symbol:  {type: "boolean", required: true},
        // time_zone: {type: "string", min: 2,required: true},
        // vouchercode_digit: {type: "number", min: 1,required: true},
        // payment_mode: {type: "string", min: 3,required: true},
        // devicetype: {type: "string", min: 1,required: true},
        // devicetoken: {type: "string", min: 4,required: true}
  },
  update: {
        appname: {type: "string", min: 4,required: true},
        appdescription: {type: "string", min: 4,required: true},
        metakeyword: {type: "string", min: 4,required: true},
        metadescription: {type: "string", min: 4,required: true},
        email: {type: "string", min: 4,required: true},
        contactnumber: {type: "string", min: 4,required: true},
        contactaddress: {type: "string", min: 4,required: true},
        mapkey: {type: "string", min: 4,required: true},
        site_copyright: {type: "string", min: 4,required: true},
        // hour_format: {type: "string", min: 2,required: true},
        // currency_code: {type: "string", min: 3,required: true},
        currency_decimalplace:  {type: "number", min: 1,required: true},
        currency_symbol:  {type: "boolean", required: true},
        // time_zone: {type: "string", min: 2,required: true},
        // vouchercode_digit: {type: "number", min: 1,required: true},
        // payment_mode: {type: "string", min: 3,required: true},
        // devicetype: {type: "string", min: 1,required: true},
        // devicetoken: {type: "string", min: 4,required: true}
  },
  get: {
  }
}
