"use strict";
// DEVELOPED ON 14-07-2023

const { MoleculerError } = require("moleculer").Errors;
const pipe = require("pipe");
const CodeTypes = require("../../../fixtures/error.codes");
const Constants = require("../../../plugin/constants");
const Database = require("../../../adapters/Database");
const fs = require("fs");
const path = require("path");
const webPush = require("web-push");
const Config = require("../../../config");
const { finished } = require("stream");
const Op = require('sequelize').Op;
const mail_template = __dirname;
const handlebars = require('handlebars');

const activity = require("../../../helpers/activitylog");

let config = Config.get('/mssqlEnvironment');
const Sequ = require("sequelize");
const { QueryTypes } = require("sequelize");
const sequelize12 = new Sequ(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    options: {
        encrypt: false
    },
    dialectOptions: {
        options: {
            encrypt: false
        }
    },
    instancename: "MSQLEXPRESS",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});
//Models

const Booking = new Database("Dbooking");
// const Bookingfilt = new Database("Dbooking", [
//     "id",
//     "bookingkey",
//     "bookingno",
//     "vendorid",
//     "customerid",
//     "service_date",
//     "service_time",
//     "subtotal",
//     "mincartvalue",
//     "coupon_code",
//     "actualrate",
//     "discountvalue",
//     "vat_percent",
//     "vat_amount",
//     "totalcost",
//     "payment_method",
//     "payment_status",
//     "booking_status",
//     "devicetype",
//     "devicetoken",
//     "location",
//     "status"
// ]);
const BookingBilling = new Database("Dbookingbilling");
// const Bookingsublistfilt = new Database("Tbookingsublist", [
//     "id",
//     "bookingsublistkey",
//     "bookingid",
//     "vendorid",
//     "serviceid",
//     "servicename",
//     "servicecost",
//     "status"
// ]);
const UsedCoupon = new Database("Dusedcoupon");
const UserCoupon = new Database("Dusercoupon");
const Coupon = new Database("Dcoupon");

const User = new Database("Duser");
// const Vendorcoupon = new Database("Mvendorcoupon");
// const Vendorfilt = new Database("Mvendor");
// const Vendorlangfilt = new Database("Mvendorlang");
// const Citylang = new Database("Mcitylang");
// const CountryLang = new Database("Mcountrylang");
// const Bookingstatus = new Database("Mbookingstatus",[
//     "id",
//     "bookingstatuskey",
//     "bookingstatus",
//     "status"
// ]);
//DEFAULT STATUS VALUES SEE IN CONSTANTS JS FILE

const {
    STATUS,
    DELETE,
    ACTIVE,
    INACTIVE,
    RESERVATION,
    BOOKED
} = Constants;

module.exports = {
    getcounts: async function(ctx) {
        
        return await sequelize12.query('EXEC sp_getDashboardCounts_new @id=:id,@hasDate=:hasDate,@from=:from,@to=:to', {
                replacements: { id: ctx.params.id, hasDate: ctx.params.hasdate, from: ctx.params.from, to: ctx.params.to }
            }).then(res => {
                return this.requestSuccess("Dashboard Counts", res);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(err);
            });
    },

    getpiecounts: async function(ctx) {
        return await sequelize12.query('EXEC sp_DashboardPiechartCount @userid=:userid,@daystype=:type,@hasDate=:hasDate,@from=:from,@to=:to', {
                replacements: { userid: ctx.params.id, type: ctx.params.type, hasDate: ctx.params.hasdate, from: ctx.params.from, to: ctx.params.to }
            }).then(res => {
                return this.requestSuccess("Dashboard Counts", res);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(err);
            });
    },

    getbarcounts: async function(ctx) {
        return await sequelize12.query('EXEC sp_DashboardBarchartCount @userid=:userid,@daystype=:type,@hasDate=:hasDate,@from=:from,@to=:to', {
                replacements: { userid: ctx.params.id, type: ctx.params.type, hasDate: ctx.params.hasdate, from: ctx.params.from, to: ctx.params.to }
            }).then(res => {
                return this.requestSuccess("Dashboard Counts", res);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(err);
            });
    },


    activity_log: async function(ctx) {
        let playersList = await sequelize12.query('EXEC SP_ActivityLog :searchmail', { replacements: { searchmail: ctx.params.name }, type: Sequ.QueryTypes.SELECT });
        return this.requestSuccess("Booking Logs", playersList);
    },

    earnings: async function(ctx) {
        let earnings_obj = {};
        let playersList = await sequelize12.query('EXEC sp_totalcustomerdiscount :customerid', { replacements: { customerid: ctx.params.customerid }, type: Sequ.QueryTypes.SELECT });
        console.log("EEEEEEEEEEEEEEEEEEEEe", playersList[0]['total_customer_discount'])
        earnings_obj['Total Earnings'] = playersList[0]['total_customer_discount'];

        let playersList1 = await sequelize12.query('EXEC sp_customerdiscountlist :customerid', { replacements: { customerid: ctx.params.customerid }, type: Sequ.QueryTypes.SELECT });
        earnings_obj['Total Earnings list'] = playersList1;

        return this.requestSuccess("Total Earnings", earnings_obj);
    },

    earnings_list: async function(ctx) {

    }
}