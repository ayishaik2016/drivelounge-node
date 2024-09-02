"use strict";

const { MoleculerError } = require("moleculer").Errors;
const pipe = require("pipe");
const CodeTypes = require("./../../../fixtures/error.codes");
const Constants = require("./../../../plugin/constants");
const Database = require("./../../../adapters/Database");
const fs = require("fs");
const path = require("path");
const { finished } = require("stream");
const Op = require('sequelize').Op;
const Sequ = require("sequelize");

const Config = require("../../../config");
let config = Config.get('/mssqlEnvironment');
//database connections for store Procedures (admin review list api)
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

const Enquiry = new Database("Denquiry");

//DEFAULT STATUS VALUES SEE IN CONSTANTS JS FILE

const {
    DELETE,
    ACTIVE,
    INACTIVE
} = Constants;

module.exports = {

    // Review creation
    create: async function(ctx) {
        return Enquiry.insert(ctx, ctx.params)
            .then(res => {
                return this.requestSuccess("Enquiry successfully sent", res.data);
            })
            .catch((err) => {
                if (err.name === 'Database Error' && Array.isArray(err.data)) {
                    if (err.data[0].type === 'unique' && err.data[0].field === 'username')
                        return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
                } else if (err instanceof MoleculerError)
                    return Promise.reject(err);
                else
                    return this.requestError(err);
            });
    },

    getAll: async function(ctx) {
        return Enquiry.find(ctx, { query: { status: 1 } }).then(res => {
            if (res) {
                return this.requestSuccess("Enquiry List", res.data);
            }
        }).catch((err) => {
            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                if (err.data[0].type === 'unique' && err.data[0].field === 'username')
                    return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
            } else if (err instanceof MoleculerError)
                return Promise.reject(err);
            else
                return this.requestError(err);
        });
    },

    remove: function(ctx) {
        return Enquiry.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                return Enquiry.updateBy(ctx, res.data.id, {
                    status: 2
                }, {
                    query: {
                        id: ctx.params.id
                    }
                }).then(res => {
                    return Enquiry.find(ctx, { query: { status: 1 } }).then(res => {
                        if (res) {
                            return this.requestSuccess("Enquiry List", res.data);
                        }
                    })
                })
            })

    }
}