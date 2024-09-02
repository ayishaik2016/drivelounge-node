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

const Favorites = new Database("Dfavorites");

//DEFAULT STATUS VALUES SEE IN CONSTANTS JS FILE

const {
    DELETE,
    ACTIVE,
    INACTIVE
} = Constants;

module.exports = {

    // Review creation
    create: async function(ctx) {
        return Favorites.findOne(ctx, {
            query: {
                userid: ctx.params.userid,
                carid: ctx.params.carid
            }
        }).then(res => {
            console.log(res)
            if(res.data !== undefined){
                return Favorites.updateBy(ctx, res.data.id, {
                    isfavorites: true
                }, {
                    query: {
                        id: res.data.id
                    }
                })
            }else{
                return Favorites.insert(ctx, {
                    userid: ctx.params.userid,
                    agentid: ctx.params.agentid,
                    carid: ctx.params.carid,
                    isfavorites: true
                })
                .catch((err) => {
                    if (err.name === 'Database Error' && Array.isArray(err.data)) {
                        if (err.data[0].type === 'unique' && err.data[0].field === 'carid' && err.data[0].field === 'userid')
                            return this.requestError(CodeTypes.ALREADY_EXIST);
                    } else if (err instanceof MoleculerError)
                        return Promise.reject(err);
                    else
                        return this.requestError(err);
                });
            }
        })
        
    },

    update: function(ctx) {
        return Favorites.findOne(ctx, {
                query: {
                    userid: ctx.params.userid,
                    carid: ctx.params.carid
                }
            })
            .then( res => {
                console.log(res);
                return Favorites.updateBy(ctx, res.data.id, {
                    isfavorites: false
                }, {
                    query: {
                        id: res.data.id
                    }
                }).then(async res => {
                    return await sequelize12.query('exec sp_getfavoritesbyuser @UserId=:userid', {
                        replacements: { userid: ctx.params.userid },
                        type: Sequ.QueryTypes.SELECT
                    })
                    .then(res => {
                        if (res)
                            return this.requestSuccess("Favorites List", res);
                        else
                            return this.requestError(CodeTypes.NOTHING_FOUND);
                    })
                    .catch(err => {
                        console.log(err)
                        return this.requestError(CodeTypes.UNKOWN_ERROR);
                    });
                })

            })
    },

    
    get: async function(ctx) {    
            return await sequelize12.query('exec sp_getfavoritesbyuser @UserId=:userid', {
                replacements: { userid: ctx.params.userid },
                type: Sequ.QueryTypes.SELECT
            })
            .then(res => {
                if (res)
                    return this.requestSuccess("Favorites List", res);
                else
                    return this.requestError(CodeTypes.NOTHING_FOUND);
            })
            .catch(err => {
                console.log(err)
                return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },
}