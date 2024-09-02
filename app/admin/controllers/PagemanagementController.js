"use strict";

const { MoleculerError } = require("moleculer").Errors;
const pipe = require("pipe");
const CodeTypes = require("./../../../fixtures/error.codes");
const Constants = require("./../../../plugin/constants");
const Database = require("./../../../adapters/Database");
const fs = require("fs");
const passwordHash = require('password-hash');
const path = require("path");
const { finished } = require("stream");
const Op = require('sequelize').Op;
const Sequ = require("sequelize");

const Config = require("../../../config");
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
//Models

const PageManagementCMS = new Database("Dcms");
const PageManagementCMSLang = new Database("Dcmslang");
const PageManagementFAQ = new Database("Dfaq");
const PageManagementFAQLang = new Database("Dfaqlang");
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

    // CMS creation
    cmscreate: async function(ctx) {
        let cmsen_data = ctx.params.cmsen;
        let cmsar_data = ctx.params.cmsar;
        return PageManagementCMS.insert(ctx, {
            cmsstatus: ctx.params.status,
            relatedpage: ctx.params.relatedpage
        }).then(cms => {
            if (cmsen_data.languageid == 1 && cmsen_data.name !== "") {
                PageManagementCMSLang.insert(ctx, {
                    'languageid': cmsen_data.languageid,
                    "languageshortname": cmsen_data.languageshortname,
                    'cmsid': cms.data.id,
                    'name': cmsen_data.name,
                    'title': cmsen_data.title,
                    'keywords': cmsen_data.keywords,
                    'description': cmsen_data.description,
                    'content': cmsen_data.content,
                    'slug': cmsen_data.slug,
                    'sortorder': cmsen_data.sortorder,
                }).catch(err=> {
                    console.log(err)
                })
            }
            if (cmsar_data.languageid == 2 && cmsar_data.name !== "") {
                PageManagementCMSLang.insert(ctx, {
                    'languageid': 2,
                    "languageshortname": 'ar',
                    cmsid: cms.data.id,
                    'name': cmsar_data.name,
                    'title': cmsar_data.title,
                    'keywords': cmsar_data.keywords,
                    'description': cmsar_data.description,
                    'content': cmsar_data.content,
                    'slug': cmsar_data.slug,
                    'sortorder': cmsar_data.sortorder
                }).catch(err=> {
                    console.log(err)
                })
            }
            // return ctx.call("pagemanagement.cmsgetAll").then(res => {
            //     console.log(res)
            //     return this.requestSuccess("CMS details inserted successfully!", res.data);
            // })
            return this.requestSuccess("CMS details inserted successfully!");
        });

    },

    // CMS update
    cmsupdate: async function(ctx) {
        let cmsen_data = ctx.params.cmsen;
        let cmsar_data = ctx.params.cmsar;
        return PageManagementCMS.updateBy(ctx, ctx.params.id, {
            cmsstatus: ctx.params.status
        }, { query: { id: ctx.params.id } }).then(async res => {
            if (cmsen_data.languageid == 1 && cmsen_data.name !== null && cmsen_data.name !== "") {
                let find = {};
                find['cmsid'] = ctx.params.id;
                find['languageid'] = 1;
                PageManagementCMSLang.find(ctx, { query: find }).then(res => { 
                    if (res.data !== undefined && res.data.length == 0) {
                        PageManagementCMSLang.insert(ctx, {
                            'languageid': cmsen_data.languageid,
                            "languageshortname": cmsen_data.languageshortname,
                            "cmsid": ctx.params.id,
                            'name': cmsen_data.name,
                            'title': cmsen_data.title,
                            'keywords': cmsen_data.keywords,
                            'description': cmsen_data.description,
                            'content': cmsen_data.content,
                            'slug': cmsen_data.slug,
                            'sortorder': cmsen_data.sortorder,
                        })
                    } else {
                        PageManagementCMSLang.updateBy(ctx, ctx.params.id, {
                            'name': cmsen_data.name,
                            'title': cmsen_data.title,
                            'keywords': cmsen_data.keywords,
                            'description': cmsen_data.description,
                            'content': cmsen_data.content,
                            'slug': cmsen_data.slug,
                            'sortorder': cmsen_data.sortorder,
                        }, { query: { cmsid: ctx.params.id, languageid: cmsen_data.languageid } })
                        .catch(err=>{
                            console.log(err);
                        })
                    }
                })
            }
            if (cmsar_data.languageid == 2 && cmsar_data.name !== null && cmsar_data.name !== "") {
                let find = {};
                find['cmsid'] = ctx.params.id;
                find['languageid'] = 2;
                PageManagementCMSLang.find(ctx, { query: find }).then(res => {
                    if (res.data.length == 0) {
                        PageManagementCMSLang.insert(ctx, {
                            'languageid': 2,
                            "languageshortname": 'ar',
                            "cmsid": ctx.params.id,
                            'name': cmsar_data.name,
                            'title': cmsar_data.title,
                            'keywords': cmsar_data.keywords,
                            'description': cmsar_data.description,
                            'content': cmsar_data.content,
                            'slug': cmsar_data.slug,
                            'sortorder': cmsar_data.sortorder
                        })
                    } else {
                        PageManagementCMSLang.updateBy(ctx, ctx.params.id, {
                            'name': cmsar_data.name,
                            'title': cmsar_data.title,
                            'keywords': cmsar_data.keywords,
                            'description': cmsar_data.description,
                            'content': cmsar_data.content,
                            'slug': cmsar_data.slug,
                            'sortorder': cmsar_data.sortorder
                        }, { query: { cmsid: ctx.params.id, languageid: cmsar_data.languageid } })
                    }
                })
            }
            // return ctx.call("pagemanagement.cmsgetAll",ctx).then(res => {
            //     return this.requestSuccess("CMS details updated successfully!", res.data);
            // })
            return await sequelize12.query('exec sp_getCMSAll @Lang=:lang', { replacements: { lang: ctx.params.subLang },type: Sequ.QueryTypes.SELECT })
                .then(res => {
                    return this.requestSuccess("CMS List", res);           
                })
                .catch(err => {
                    console.log(err);
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
                });
        });
    },

    cmsremove: function(ctx) {
        return PageManagementCMS.updateBy(ctx, ctx.params.id, {
                status: 2
            }, {
                query: {
                    id: ctx.params.id
                }
            })
            .then(async res => {
                return await sequelize12.query('exec sp_getCMSAll @Lang=:lang', { replacements: { lang: ctx.params.subLang },type: Sequ.QueryTypes.SELECT })
                .then(res => {
                    return this.requestSuccess("CMS List", res);           
                })
                .catch(err => {
                    console.log(err);
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
                });
            })
            .catch((err) => {
                return err;
            });
    },

    cmsstatus: function(ctx) {
        return PageManagementCMS.updateBy(ctx, ctx.params.id, {
                cmsstatus: ctx.params.status
            }, {
                query: {
                    id: ctx.params.id
                }
            })
            .then(async res => {
                return await sequelize12.query('exec sp_getCMSAll @Lang=:lang', { replacements: { lang: ctx.params.subLang },type: Sequ.QueryTypes.SELECT })
                .then(res => {
                    return this.requestSuccess("CMS List", res);           
                })
                .catch(err => {
                    console.log(err);
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
                });
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
    },

    // CMS getall
    cmsgetAll: async function(ctx) {       
        return await sequelize12.query('exec sp_getCMSAll @Lang=:lang', { replacements: { lang: ctx.params.languageid },type: Sequ.QueryTypes.SELECT })
        .then(res => {
            return this.requestSuccess("CMS List", res);
        })
        .catch(err => {
            console.log(err);
            return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },

    // CMS get by id
    cmsfindById: async function(ctx) {

        return await sequelize12.query('exec sp_getCMSByID @Id=:id', {
                replacements: { id: ctx.params.id },
                type: Sequ.QueryTypes.SELECT
            })
            .then(res => {
                if (res)
                    return this.requestSuccess("CMS Informataion", res);
                else
                    return this.requestError(CodeTypes.NOTHING_FOUND);
            })
            .catch(err => {
                console.log(err);
                return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    },

    cmsfindByRelatedPage: async function(ctx) {

        return await sequelize12.query('exec sp_getCMSByRelatedPage @relatedpage=:relatedpage, @lang=:lang', {
                replacements: { relatedpage: ctx.params.relatedpage, lang: ctx.params.lng, },
                type: Sequ.QueryTypes.SELECT
            })
            .then(res => {
                if (res)
                    return this.requestSuccess("CMS Informataion", res);
                else
                    return this.requestError(CodeTypes.NOTHING_FOUND);
            })
            .catch(err => {
                console.log(err);
                return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    },

    cmsfindByIdLang: async function(ctx) {
        return await sequelize12.query('exec sp_GetCMSManagementListByLang @Id=:id, @Lang=:lng', {
                replacements: { id: ctx.params.id,lng: ctx.params.lng },
                type: Sequ.QueryTypes.SELECT
            })
            .then(res => {
                if (res)
                    return this.requestSuccess("CMS Informataion", res);
                else
                    return this.requestError(CodeTypes.NOTHING_FOUND);
            })
            .catch(err => {
                console.log(err);
                return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    },

    // FAQ creation
    faqcreate: async function(ctx) {
        let faqen_data = ctx.params.faqen;
        let faqar_data = ctx.params.faqar;
        let id = 0;
        return PageManagementFAQ.insert(ctx, {
            faqstatus: ctx.params.status,
            sortorder: ctx.params.sortorder
        }).then(res => {
            id = res.data.id
            if (faqen_data.languageid == 1 && faqen_data.question !== "") {
                let find = {};
                find['question'] = faqen_data.question;
                find['languageid'] = 1;
                PageManagementFAQLang.find(ctx, { query: find }).then(res => {
                    console.log(res);
                    if (res.data.length == 0) {
                        PageManagementFAQLang.insert(ctx, {
                            'languageid': faqen_data.languageid,
                            "langshortname": faqen_data.languageshortname,
                            faqid: id,
                            'question': faqen_data.question,
                            'answer': faqen_data.answer
                        })
                    }
                })
            }
            if (faqar_data.languageid == 2 && faqar_data.question !== "") {
                let find = {};
                find['question'] = faqar_data.question;
                find['languageid'] = 2;
                PageManagementFAQLang.find(ctx, { query: find }).then(res => {
                    if (res.data.length == 0) {
                        PageManagementFAQLang.insert(ctx, {
                            'languageid': 2,
                            "langshortname": 'ar',
                            faqid: id,
                            'question': faqar_data.question,
                            'answer': faqar_data.answer
                        })
                    }
                })
            }
            // return ctx.call("pagemanagement.faqgetAll").then(res => {
            //     return this.requestSuccess("FAQ inserted successfully", res.data);
            // })
          //  return this.requestSuccess("faq details inserted successfully!");
        });
    },

    // FAQ update
    faqupdate: async function(ctx) {
        let faqen_data = ctx.params.faqen;
        let faqar_data = ctx.params.faqar;
        let id = 0;
        return PageManagementFAQ.updateBy(ctx,  faqen_data.id, { faqstatus: faqen_data.status, 'sortorder': ctx.params.sortorder},
        {query: {id: faqen_data.id}}).then(res => {
            id = res.data.id
            if (faqen_data.languageid == 1 && faqen_data.question !== "") {
                let find = {};
                find['id'] = faqen_data.faqid;
                find['languageid'] = 1;
                PageManagementFAQLang.find(ctx, { query: find }).then(res => {
                    console.log(res)
                    if (res.data.length == 0) {
                        PageManagementFAQLang.insert(ctx, {
                            'languageid': faqen_data.languageid,
                            "langshortname": faqen_data.languageshortname,
                            faqid: id,
                            'question': faqen_data.question,
                            'answer': faqen_data.answer

                        })
                    } else {
                        console.log("-----------------------------------------------------------------")
                        PageManagementFAQLang.updateBy(ctx, res.data[0].id, {
                            "langshortname": faqen_data.languageshortname,
                            'question': faqen_data.question,
                            'answer': faqen_data.answer
                        }, {query:{id: res.data[0].id}})
                    }
                })
            }
            if (faqar_data.languageid == 2 && faqar_data.question !== "") {
                let find = {};
                find['id'] = faqar_data.faqid;
                find['languageid'] = 2;
                PageManagementFAQLang.find(ctx, { query: find }).then(res => {
                    if (res.data.length == 0) {
                        PageManagementFAQLang.insert(ctx, {
                            'languageid': 2,
                            "languageshortname": 'ar',
                            faqid: id,
                            'question': faqar_data.question,
                            'answer': faqar_data.answer
                        })
                    } else {
                        PageManagementFAQLang.updateBy(ctx, res.data[0].id, {
                            'languageid': 2,
                            "languageshortname": 'ar',
                            'question': faqar_data.question,
                            'answer': faqar_data.answer
                        }, {query:{id: res.data[0].id}})
                    }
                }).catch(err=> {
                    console.log(err)
                })
            }            
            // return ctx.call("pagemanagement.faqgetAll",{languageid: ctx.params.subLang}).then(res => {
            //     return this.requestSuccess("FAQ Status changed successfully", res.data);
            // })
        })
    },

    faqremove: function(ctx) {
        return PageManagementFAQ.updateBy(ctx, ctx.params.id, {
                status: 2
            }, {
                query: {
                    id: ctx.params.id
                }
            })
            .then(res => {
                return ctx.call("pagemanagement.faqgetAll",{languageid: ctx.params.subLang}).then(res => {
                    console.log(res)
                    return this.requestSuccess("FAQ Deleted successfully", res.data);
                })
            })
            .catch((err) => {
                return err;
            });
    },

    faqstatus: function(ctx) {
        return PageManagementFAQ.updateBy(ctx, ctx.params.id, {
                faqstatus: ctx.params.status
            }, {
                query: {
                    id: ctx.params.id
                }
            })
            .then(res => {
                return ctx.call("pagemanagement.faqgetAll",{languageid: ctx.params.subLang}).then(res => {
                    return this.requestSuccess("FAQ Status changed successfully", res.data);
                })
               // return this.requestSuccess("FAQ Status changed successfully");
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
    },

    // FAQ getall
    faqgetAll: async function(ctx) {
        return await sequelize12.query('exec sp_getFAQAll @Lang=:id', 
            { replacements: { id: ctx.params.languageid }, type: Sequ.QueryTypes.SELECT })
            .then(res => {
                console.log(res)
                if (res.length > 0)
                    return this.requestSuccess("FAQ List", res);
                else
                    return this.requestError(CodeTypes.NOTHING_FOUND);
            })
            .catch(err => {
                return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },

    // faq get by id
    faqfindById: async function(ctx) {

        return await sequelize12.query('exec sp_getFAQByID @Id=:id', {
                replacements: { id: ctx.params.id },
                type: Sequ.QueryTypes.SELECT
            })
            .then(res => {
                if (res)
                    return this.requestSuccess("FAQ Informataion", res);
                else
                    return this.requestError(CodeTypes.NOTHING_FOUND);
            })
            .catch(err => {
                console.log(object);
                return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    },

    faqgetByLang: async function(ctx) {

        return await sequelize12.query('exec sp_getFAQAllByLang @Lang=:lang', {
                replacements: { lang: ctx.params.lang },
                type: Sequ.QueryTypes.SELECT
            })
            .then(res => {
                if (res)
                    return this.requestSuccess("FAQ List", res);
                else
                    return this.requestError(CodeTypes.NOTHING_FOUND);
            })
            .catch(err => {
                console.log(object);
                return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    }
}