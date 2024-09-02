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

// Models
const User = new Database("Duser");
const CreditCard = new Database("Dcreditcard");
const Agency = new Database("Dagent");
//DEFAULT STATUS VALUES SEE IN CONSTANTS JS FILE
const {
    DELETE,
    ACTIVE,
    INACTIVE
} = Constants;

module.exports = {
    getAll: async function(ctx) {
        return await sequelize12.query('EXEC sp_getCustomerDetails @status=:status', { replacements: { status: ctx.params.status }, type: Sequ.QueryTypes.SELECT }).then(res => {
                return this.requestSuccess("Customer Lists", res);
            })
        .catch((err) => {
            if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else
                return this.requestError(err);
        });
    },

    getCardList: async function(ctx) {

        return CreditCard.find(ctx, {query: {userid: ctx.params.id}}).then(res=>{
            console.log(res)
            return this.requestSuccess("Card List.", res.data);
        })
        .catch((err) => {
            if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else
                return this.requestError(err);
        });
    },
  
    status: function(ctx) {
        if (ctx.params.type == 2) {
            return Agency.updateBy(ctx, ctx.params.id, {
                agentstatus: ctx.params.status
            }, {
                query: {
                    id: ctx.params.id
                }
            }).then(res => {
                return Agency.find(ctx, {query: {status: 1}}),then(res=>{
                    return this.requestSuccess("Requested agency status changed.", res.data);
                })                
            }).catch(err => {
                return this.requestError(CodeTypes.UNKOWN_ERROR);
            })
        } else {
            return User.updateBy(ctx, ctx.params.id, {
                userstatus: ctx.params.status
            }, {
                query: {
                    id: ctx.params.id
                }
            }).then(res => {
                return User.find(ctx, {query: {status: 1, usertypeid: 3}}).then(res=>{
                    return this.requestSuccess("Requested User status changed.", res.data);
                })                
            }).catch(err => {
                console.log(err);
                return this.requestError(CodeTypes.UNKOWN_ERROR);
            })
        }
    },

    remove: function(ctx) {
        if (ctx.params.type == 2) {
            return Agency.updateBy(ctx, ctx.params.id, {
                status: 2
            }, {
                query: {
                    id: ctx.params.id
                }
            }).then(res => {
                return User.find(ctx, {query: {status: 1, usertypeid: 3}}).then(res=>{
                    return this.requestSuccess("Requested User status changed.", res.data);
                })                  
            }).catch(err => {
                return this.requestError(CodeTypes.UNKOWN_ERROR);
            })
        } else {
            return User.updateBy(ctx, ctx.params.id, {
                status: 2
            }, {
                query: {
                    id: ctx.params.id
                }
            }).then(res => {
                return User.find(ctx, {query: {status: 1, usertypeid: 3}}).then(res=>{
                    return this.requestSuccess("Requested User status changed.", res.data);
                })  
               // return this.requestSuccess("Requested User has deleted successfully");
            }).catch(err => {
                return this.requestError(CodeTypes.UNKOWN_ERROR);
            })
        }
    },


    activity_log: async function(ctx) {
        let playersList = await sequelize12.query('EXEC SP_ActivityLog @Id:searchmail', { replacements: { searchmail: ctx.params.name }, type: Sequ.QueryTypes.SELECT });
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