"use strict";
// DEVELOPED ON 14-07-2023

const { MoleculerError } 	= require("moleculer").Errors;
const pipe = require("pipe");
const CodeTypes = require("../../../fixtures/error.codes");
const Constants = require("./../../../plugin/constants");
const Database = require("../../../adapters/Database");
const fs = require("fs");
const path = require("path");
const { finished } = require("stream");
const Op = require('sequelize').Op;


//Models

const Module = new Database("Dmodule");
const Modulelang = new Database("Dmodulelang");

//DEFAULT STATUS VALUES SEE IN CONSTANTS JS FILE

const {
	DELETE,
	ACTIVE,
	INACTIVE
} = Constants;

//For Roles Filtrations
/**
 *
 * @annotation Module
 * @permission create,update,remove,get
 * @whitelist status,getall
 */
module.exports = {

    // Module creation with multiple language
    create: async function(ctx) {
        /*
            To validate the primary language
            field already exist and to convert the first letter 
            in caps and remaining small
            below map function and capitalized function is used
        */
    //     var langid = [];
    //     var langname = [];
    //     var testname = "";
    //     ctx.params.language.map((item)=>{
    //         testname = item.modulename.toLowerCase();
    //         function capitalizeFirstLetter(str) {                
    //             const capitalized = str.replace(/^./, str[0].toUpperCase());
    //             return capitalized;
    //         }
    //         const catname1 = capitalizeFirstLetter(testname);
    //         langid.push(item.languageid);
    //         langname.push(catname1);
    //     });
    //     let wherecond = {
    //         languageid: langid,
    //         modulename: langname,
    //         status: 1
    //     };
    //     return Modulelang.find(ctx, { query: wherecond })
    //    .then((res)=>{
    //        if (res.data.length === 0) {
    //             return Module.insert(ctx, {
    //                 status: 1
    //             })
    //             .then( (res) => {
    //                 var catname = "";
    //                 ctx.params.language.map((lan_item)=>{
    //                     catname =  lan_item.modulename.toLowerCase();
    //                     // Function to convert first letter to uppercase
    //                     function capitalizeFirstLetter(str) {                
    //                         const capitalized = str.replace(/^./, str[0].toUpperCase());
    //                         return capitalized;
    //                     }
    //                     const catname1 = capitalizeFirstLetter(catname);
    //                     Modulelang.insert(ctx, {
    //                         languageid: lan_item.languageid,
    //                         langshortname: lan_item.langshortname,
    //                         modulename: catname1,
    //                         moduleid: res.data.id
    //                     })    
    //                 })
    //                 return this.requestSuccess("Module Created", ctx.params.language[0].modulename);
    //             })
    //             .catch( (err) => {
    //                 if (err.name === 'Database Error' && Array.isArray(err.data)){
    //                     if (err.data[0].type === 'unique' && err.data[0].field === 'username')
    //                         return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
    //                 }
    //                 else if (err instanceof MoleculerError)
    //                     return Promise.reject(err);
    //                 else
    //                     return this.requestError(err);
    //             });
    //         }
    //         else {
    //             return this.requestError(`Module Name ${ res.data[0].modulename } ${CodeTypes.ALREADY_EXIST}`);
    //         }
    //    })
    },
    // Module list with multiple language
    getall: function(ctx) {
        let findmodule = {};
        findmodule['status'] = ctx.params.status ? ctx.params.status : { [Op.ne]: DELETE };
        return Module.find(ctx, { query: findmodule })
        .then( (res) => {            
            return this.requestSuccess("List of Modules", res.data);
        })
        .catch( (err) => {
            if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else
                return this.requestError(err);
        });

    },

    //status updation for Module in both language
    status: function(ctx) {

        return  Module.findOne(ctx, { query: {id: ctx.params.id}}).then ((res) =>{
            Module.updateBy(ctx, res.data.id, {
                status: ctx.params.status
                }, { query: {
                    id: ctx.params.id
                }
            })

            let update = {};
                update["status"] = ctx.params.status;
            let des = {};
				des["moduleid"] = ctx.params.id;
            Modulelang.updateMany(ctx,des,update)
            return this.requestSuccess("Requested Module Updated");
        })
        .catch( (err) => {
            if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else if (err instanceof MoleculerError)
                return Promise.reject(err);
            else
                return this.requestError(err);

        });

    },
    //Particular module list in multiple language
    get: function(ctx) {
        let findmodule = {};
        findmodule['id'] = ctx.params.id ;
        findmodule['status'] = ctx.params.status ? ctx.params.status : { [Op.ne]: DELETE };
        return Module.find(ctx, { query: findmodule })
        .then( (res) => {
            var arr = res.data;
            async function get_module(ctx, arr) {
                let final = [];
                for(var i = 0;i<arr.length;i++) {
                    let language_val = await Modulelang.find(ctx, { query: {moduleid: arr[i].id,languageid: ctx.options.parentCtx.params.req.headers.language}})
                    .then((lan_res)=>{
                        arr[i]["modulename"] = lan_res.data[0].modulename;
                        return arr[i];
                    })

                    final.push(language_val);
                }
                return final;
            }
            const vali =  get_module(ctx,arr);
            return vali.then((resy)=>{
                return this.requestSuccess("Requested Module", resy);
            })

        })
        .catch( (err) => {
            if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else
                return this.requestError(err);
        });
    },

    //Module update for mutiple language (all fields are mandatory)
    update: function(ctx) {

         /*
            To validate the primary language
            field already exist and to convert the first letter 
            in caps and remaining small
            below map function and capitalized function is used
        */
       var langid = [];
       var langname = [];
       var testname = "";
       ctx.params.language.map((item)=>{
           testname = item.modulename.toLowerCase();
           function capitalizeFirstLetter12(str) {                
               const capitalized = str.replace(/^./, str[0].toUpperCase());
               return capitalized;
           }
           const catname1 = capitalizeFirstLetter12(testname);
           langid.push(item.languageid);
           langname.push(catname1);
          
       });
       let wherecond = {
           languageid: langid,
           modulename: langname,
           status: 1,
           moduleid: {[Op.ne]: ctx.params.id}
       };
       return Modulelang.find(ctx, { query: wherecond })
       .then((res)=>{
           if (res.data.length === 0)
            {
                Module.updateBy(ctx, 1, {
                    status: 1
                }, { query: {
                        id: ctx.params.id
                    }
                })
                .then((res)=>{
                    ctx.params.language.map((lan_item)=>{
                        var conname = "";
                        Modulelang.find(ctx, { query: {moduleid: ctx.params.id,languageid: lan_item.languageid} })
                        .then((result)=>{
                            if(result.data.length === 0)
                            {
                                conname =  lan_item.modulename.toLowerCase();
                                // Function to convert first letter to uppercase
                                function capitalizeFirstLetter(str) {                
                                    const capitalized = str.replace(/^./, str[0].toUpperCase());
                                    return capitalized;
                                }
                                const catname1 = capitalizeFirstLetter(conname);
                                Modulelang.insert(ctx, {
                                    languageid: lan_item.languageid,
                                    langshortname: lan_item.langshortname,
                                    modulename: catname1,
                                    moduleid: ctx.params.id,
                                })
                            }
                            else {
                                conname =  lan_item.modulename.toLowerCase();
                                // Function to convert first letter to uppercase
                                function capitalizeFirstLetter(str) {                
                                    const capitalized = str.replace(/^./, str[0].toUpperCase());
                                    return capitalized;
                                }
                                const catname1 = capitalizeFirstLetter(conname);          
                                Modulelang.updateBy(ctx, 1, {
                                    languageid: lan_item.languageid,
                                    langshortname: lan_item.langshortname,
                                    modulename: catname1,
                                }, { query: {
                                    languageid: lan_item.languageid,
                                    moduleid: ctx.params.id
                                    }
                                    })
                            }
                        })
                    })
                })
                return this.requestSuccess("Module Updated", ctx.params.language[0].modulename);

            }
            else
            {
                return this.requestError(`Module Name ${ res.data[0].modulename } ${CodeTypes.ALREADY_EXIST}`);
            }
       })
       .catch( (err) => {
            console.log("error",err);
            if (err.name === 'Database Error' && Array.isArray(err.data)){
                if (err.data[0].type === 'unique' && err.data[0].field === 'first')
                    return this.requestError(CodeTypes.T1_FIRST_CONSTRAINT);
            }
            else if (err instanceof MoleculerError)
                return Promise.reject(err);
            else if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else
                return this.requestError(err);
        });
    },

    //Module delete is used change the status and not complete delete
    remove: function(ctx) {
        return  Module.findOne(ctx, { query: {
            id: ctx.params.id
        }
        })
        .then ((res) =>{
            Module.updateBy(ctx, res.data.id, {
                status: 2
                }, { query: {
                    id: ctx.params.id
                }
            })

            let update = {};
                update["status"] = 2;
            let des = {};
				des["moduleid"] = ctx.params.id;
            Modulelang.updateMany(ctx,des,update)
            return this.requestSuccess("Module Deleted")
    })

    }
}
