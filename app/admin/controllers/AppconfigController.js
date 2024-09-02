"use strict";

const { MoleculerError } = require("moleculer").Errors;
const pipe = require("pipe");
const CodeTypes = require("../../../fixtures/error.codes");
const Constants = require("../../../plugin/constants");
const Database = require("../../../adapters/Database");
const activity = require("../../../helpers/activitylog");
const fs = require("fs");
const path = require("path");
const { finished } = require("stream");
const Op = require('sequelize').Op;


//Models
const Appconfig = new Database("Dappconfig");

//DEFAULT STATUS VALUES SEE IN CONSTANTS JS FILE

const {
    DELETE,
    ACTIVE,
    INACTIVE
} = Constants;

/**
 *
 * @annotation AppconfigController
 * @permission 'Create,Update,Remove,Getall,Status'  
 */

module.exports = {
    create: function(ctx) {
        return Appconfig.insert(ctx, ctx.params)
            .then((res) => {
                return "App configuartion added";
            })
    },
    get: async function(ctx) {
        let findconfig = {};
        findconfig['status'] = 1;
        return Appconfig.find(ctx, { query: findconfig })
            .then((res) => {
                console.log(res);
                return this.requestSuccess("App configuration lsit", res.data);
            })
            .catch((err) => {
                console.log(err)
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },
    update: async function(ctx) {
        
        return Appconfig.find(ctx, { query: {status: 1} })
            .then(res => {
                console.log(res)
                if (res.data.length) {
                    return Appconfig.updateBy(ctx, res.data[0].id, ctx.params, {
                            query: {
                                id: res.data[0].id
                            }
                        })
                        .then((res) => {
                            ctx.meta.log = "Activity log Updated.";
                            activity.setLog(ctx);
                            return this.requestSuccess("Configurations Updated", res.data[0]);
                        })
                        .catch((err) => {
                            return err;
                        });
                } else {
                    return Appconfig.insert(ctx, ctx.params)
                        .then((res) => {
                            return this.requestSuccess("App configuration lsit", res.data);
                        })
                }

            })
            .catch((err) => {
                console.log(err)
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    }
}