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

// Country Models
const Country = new Database("Dcountry");

//DEFAULT STATUS VALUES SEE IN CONSTANTS JS FILE
const {
    DELETE,
    ACTIVE,
    INACTIVE
} = Constants;

module.exports = {

    create: async function(ctx) {
        let country = {};
        country['countryname'] = ctx.params.countryname;
        country['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE };
        return Country.find(ctx, { query: country })
            .then((res) => {
                if (res.data.length === 0) {
                    return Country.insert(ctx, ctx.params)
                        .then((res) => {
                            return Country.find(ctx, { query: {status: 1} })
                            .then((res) => {
                                var arr = res.data;
                                return this.requestSuccess("List of Country's", arr);
                            })
                            // return this.requestSuccess("Address Country Created", ctx.params.countryname);
                        })
                        .catch((err) => {
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'countryname')
                                    return this.requestError(CodeTypes.ALREADY_EXIST);
                            } else if (err instanceof MoleculerError)
                                return Promise.reject(err);
                            else
                                return this.requestError(CodeTypes.UNKOWN_ERROR);
                        });
                } else {
                    return this.requestError(CodeTypes.ALREADY_EXIST);
                }
            })
    },
    update: function(ctx) {
        let country = {};
        country['id'] = ctx.params.id
            // country['status'] = ctx.params.status ? ctx.params.status : { [Op.ne]: DELETE };
        return Country.find(ctx, { query: country })
            .then((res) => {
                return Country.updateBy(ctx, ctx.params.id, ctx.params, {
                    query: {
                        id: ctx.params.id
                    }
                }).then(_ => {
                    return Country.find(ctx, { query: {status: 1} })
                    .then((res) => {
                        var arr = res.data;
                        return this.requestSuccess("List of Country's", arr);
                    })
                    // return this.requestSuccess("Address Country Updated", res.data.countryname);
                })

            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    },
    remove: function(ctx) {

        return Country.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                return Country.updateBy(ctx, ctx.params.id, {
                    status: 2
                }, {
                    query: {
                        id: ctx.params.id
                    }
                }).then(res => {
                    return this.requestSuccess("Requested Country Deleted", res);
                })

            })
    },
    status: function(ctx) {
        return Country.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                Country.updateBy(ctx, res.data.id, {
                    status: 2
                }, {
                    query: {
                        id: ctx.params.id
                    }
                })
                return this.requestSuccess("Requested Country Status Updated", ctx.params.id);

            })
    },
    get: function(ctx) {
        let country = {};
        country['id'] = ctx.params.id,
            country['status'] = 1;
        return Country.find(ctx, { query: country })
            .then((res) => {
                var arr = res.data;
                return this.requestSuccess("List of Country's", arr);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },
    getAll: function(ctx) {
        let country = {};
        country['status'] = 1;
        return Country.find(ctx, { query: country })
            .then((res) => {
                var arr = res.data;
                return this.requestSuccess("List of Country's", arr);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },

}