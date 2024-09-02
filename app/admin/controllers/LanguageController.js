"use strict";

const { MoleculerError } 	= require("moleculer").Errors;
const CodeTypes = require("../../../fixtures/error.codes");
const Constants = require("../../../plugin/constants");
const Database = require("../../../adapters/Database");
const Op = require('sequelize').Op;

//Models
const Language = new Database("Dlanguage");

//DEFAULT STATUS VALUES SEE IN CONSTANTS JS FILE

const {
	DELETE,
	ACTIVE,
	INACTIVE
} = Constants;

/**
 *
 * @annotation Language
 * @permission 
 * @whitelist getall,getone,create,update,remove
 */
module.exports = {

    // Language creation
    create: async function(ctx) {
        let findcond = {};
        findcond['languagename'] = ctx.params.languagename;
        return Language.find(ctx, { query: findcond }).then((res) => {
            if(res.data.length == 0 ){
               return Language.insert(ctx,{
                languagename: ctx.params.languagename,
                languageshortname: ctx.params.languagecode
            }); 
        }else{
            return this.requestError("Language name is already exists!" , res );
        }
        }).then((res) => {
            return this.requestSuccess("Language details inserted successfully!",res);
        });
    },

    // Language update
    update: async function(ctx) {
        let find = {};
        find['languagename'] = ctx.params.languagename;
        find['id'] = { [Op.ne]: ctx.params.id };
        return Language.find(ctx, { query: find }).then((res) => {
             if(res.data.length == 0 ){
               return Language.updateBy(ctx,1,{
                languagename: ctx.params.languagename,
                languageshortname: ctx.params.languagecode
            },{ query: {
                id: ctx.params.id
        }}
        ); 
       }else{
        return this.requestError("Email is already exists!" , res );
            }
        }).then((res) => {
            return res;
        });
    },

    remove: function(ctx) {
        return Language.updateBy(ctx, 1, {
            status:2
        }, { query: {
                id: ctx.params.id
            }
        })
        .then((res)=>{
            return this.requestSuccess("Language Deleted successfully", res.data);
        })
        .catch( (err) => {
            return err;
        });    
    },


    // Language getall
    getall: function(ctx) {
        let condition = {'status' :{ [Op.ne]: 2 }};
        return Language.find(ctx , {query : condition }).then((res) => {
                return this.requestSuccess("Language details updated successfully!",res);
        })
        .catch( (err) => {
            if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else
                return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },


    // Language getall
    getone: function(ctx) {
        let condition = {'id' : ctx.params.id};
        return Language.find(ctx , {query : condition }).then((res) => {
            return this.requestSuccess("Language details updated successfully!",res);
        })
        .catch( (err) => {
            if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else
                return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    }
}
