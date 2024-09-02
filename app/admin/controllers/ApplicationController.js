"use strict";

const { MoleculerError } = require("moleculer").Errors;
const webPush = require("web-push");
const CodeTypes = require("../../../fixtures/error.codes");
const Constants = require("../../../plugin/constants");
const Database = require("../../../adapters/Database");
const Config = require("./../../../config");
const { finished } = require("stream");
const Op = require('sequelize').Op;
// database connections for store Procedures (dashboard counts api)
const Sequ = require("sequelize");
const { QueryTypes } = require("sequelize");

let config = Config.get('/mssqlEnvironment');
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

// Car Models
const Application = new Database("Dapplications");

//DEFAULT STATUS VALUES SEE IN CONSTANTS JS FILE

const {
    DELETE,
    ACTIVE,
    INACTIVE
} = Constants;

module.exports = {

    create: async function(ctx) {
        console.log(ctx.params)
        return Application.insert(ctx, ctx.params).then(res => {
            return this.requestSuccess("Your application number is", res.data.id);
        }).catch((err) => {
            console.log(err)
            if (err instanceof MoleculerError)
                return Promise.reject(err);
            else
                return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },

    update: async function(ctx) {
        let appinfo = {};
        appinfo['id'] = ctx.params.id;
        appinfo['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE };
        return Application.find(ctx, { query: appinfo })
            .then((res) => {
                if (res.data.length) {
                    console.log(res.data)
                    return Application.updateBy(ctx, res.data[0].id, {
                        applicationstatus: ctx.params.applicationstatus
                    }, {
                        query: { id: ctx.params.res.data[0].id }
                    }).then(_ => {
                        return this.requestSuccess("Application status updated");
                    }).catch((err) => {
                        if (err instanceof MoleculerError)
                            return Promise.reject(err);
                        else
                            return this.requestError(CodeTypes.UNKOWN_ERROR);
                    });
                } else {
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                }
            })
    },

    remove: function(ctx) {
        return Application.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                Application.updateBy(ctx, res.data.id, {
                    status: 2
                }, {
                    query: {
                        id: ctx.params.id
                    }
                })
                return this.requestSuccess("Application removed", ctx.params.id);

            })
    },

    getAll: async function(ctx) {
        return await sequelize12.query(`exec sp_getapplications @applicationid=:applicationid,
        @applicationno=:applicationno,@applicantname=:applicantname, @applicantemail=:applicantemail,
        @applicationstatus=:applicationstatus `, {
                replacements: {
                    applicationid: ctx.params.applicationid,
                    applicationno: ctx.params.applicationno,
                    applicantname: ctx.params.applicantname,
                    applicantemail: ctx.params.applicantemail,
                    applicationstatus: ctx.params.applicationstatus
                },
                type: Sequ.QueryTypes.SELECT
            })
            .then(res => {
                if (res)
                    return this.requestSuccess("Application details", res);
                else
                    return this.requestError(CodeTypes.NOTHING_FOUND);
            })
            .catch(err => {
                console.log(err)
                return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },

}