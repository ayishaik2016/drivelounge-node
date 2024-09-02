"use strict";

const { MoleculerError } = require("moleculer").Errors;
const webPush = require("web-push");
const CodeTypes = require("../../../fixtures/error.codes");
const Constants = require("../../../plugin/constants");
const Database = require("../../../adapters/Database");
const activity = require("../../../helpers/activitylog");
const fs = require("fs");
const path = require("path");
const { finished } = require("stream");
const Op = require('sequelize').Op;
const mail_template = __dirname;
const handlebars = require('handlebars');

const Config = require("./../../../config");
// Coupon Models
const Coupon = new Database("Dcoupon");
const UserCoupon = new Database("Dusercoupon");
const AgentCoupon = new Database("Dagentcoupon");
const CouponType = new Database("Dcoupontype");
const CouponAppType = new Database("Dcouponapptype");
const User = new Database("Duser");
const Agent = new Database("Dagent");
//DEFAULT STATUS VALUES SEE IN CONSTANTS JS FILE
const Sequ = require("sequelize");
let config = Config.get('/mssqlEnvironment');
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

const {
    DELETE,
    ACTIVE,
    INACTIVE
} = Constants;

module.exports = {

    couponcode_validate: async function(ctx) {
        let coupon = {};
        coupon['couponcode'] = ctx.params.couponcode;
        coupon['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };;
        return Coupon.find(ctx, { query: coupon })
            .then((res) => {
                if (this.IsExceedMaximumRedumptionValue(ctx, ctx.params.maxredeem_amt)) {
                    if (this.isCouponExpired(res.data.expirydate)) {
                        if (res.data.length == 1) {
                            if ((res.data[0].isallagent === 1 || res.data[0].isalluser === 1) && this.isCouponExpired(res.data[0].expirydate)) {
                                ctx.meta.log = "Coupon code value applied";
                                activity.setLog(ctx);
                                return this.requestSuccess(CodeTypes.COUPONCODE_APPLIED);
                            }
                            if (res.data[0].isallagent === 2) {
                                let findagentcoupon = {};
                                findagentcoupon['agentid'] = ctx.params.agentid,
                                    findagentcoupon['couponcode'] = ctx.params.couponcode;
                                findagentcoupon['status'] = ctx.params.status ? ctx.params.status : {
                                    [Op.ne]: DELETE
                                };;
                                return AgentCoupon.find(ctx, { query: findagentcoupon })
                                    .then((response) => {
                                        if (response.data.length == 0) {
                                            ctx.meta.log = "This car model doesn't have any valid coupon";
                                            activity.setLog(ctx);
                                            return this.requestError(CodeTypes.INVALID_AGENT);
                                        } else {
                                            let findusercoupon = {};
                                            findusercoupon['userid'] = ctx.params.userid,
                                                findusercoupon['couponcode'] = ctx.params.couponcode;
                                            findusercoupon['status'] = ctx.params.status ? ctx.params.status : {
                                                [Op.ne]: DELETE
                                            };;
                                            return UserCoupon.find(ctx, { query: findusercoupon })
                                                .then((response) => {
                                                    if (response.data.length == 0) {
                                                        ctx.meta.log = "This car model doesn't have any valid coupon";
                                                        activity.setLog(ctx);
                                                        return this.requestError(CodeTypes.INVALID_USER);
                                                    } else {
                                                        ctx.meta.log = "Coupon code value applied";
                                                        activity.setLog(ctx);
                                                        return this.requestSuccess(CodeTypes.COUPONCODE_APPLIED);
                                                    }
                                                })
                                                // ctx.meta.log = "Coupon code value applied";
                                                // activity.setLog(ctx);
                                                // return this.requestSuccess(CodeTypes.COUPONCODE_APPLIED);
                                        }
                                    })
                            }
                            if (res.data[0].isalluser === 2) {
                                let findusercoupon = {};
                                findusercoupon['userid'] = ctx.params.userid,
                                    findusercoupon['couponcode'] = ctx.params.couponcode;
                                findusercoupon['status'] = ctx.params.status ? ctx.params.status : {
                                    [Op.ne]: DELETE
                                };;
                                return UserCoupon.find(ctx, { query: findusercoupon })
                                    .then((response) => {
                                        if (response.data.length == 0) {
                                            ctx.meta.log = "This car model doesn't have any valid coupon";
                                            activity.setLog(ctx);
                                            return this.requestError(CodeTypes.INVALID_USER);
                                        } else {
                                            ctx.meta.log = "Coupon code value applied";
                                            activity.setLog(ctx);
                                            return this.requestSuccess(CodeTypes.COUPONCODE_APPLIED);
                                        }
                                    })
                            }
                            // else {
                            //     ctx.meta.log = "Try to use used coupon.";
                            //     activity.setLog(ctx);
                            //     return this.requestError(CodeTypes.USED_COUPON);
                            // }
                        } else {
                            ctx.meta.log = "Try to use invalid coupon.";
                            activity.setLog(ctx);
                            return this.requestError(CodeTypes.INVALID_COUPON);
                        }
                    } else {
                        ctx.meta.log = "Coupon Code Expired";
                        activity.setLog(ctx);
                        return this.requestError(CodeTypes.COUPONCODE_EXPIRED);
                    }

                } else {
                    ctx.meta.log = "You are exceeded the maximum redumption value";
                    activity.setLog(ctx);
                    return this.requestError(CodeTypes.EXCEEDED_MAX_REDUMPTION);
                }

            })
    },
    generate_couponcode: async function(ctx) {
        return this.generateUniqueCode();
    },
    coupontype_create: async function(ctx) {
        let coupontype = {};
        coupontype['coupontypename'] = ctx.params.coupontypename;
        coupontype['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CouponType.find(ctx, { query: coupontype })
            .then((res) => {
                if (res.data.length === 0) {
                    return CouponType.insert(ctx, ctx.params)
                        .then((res) => {
                            return this.requestSuccess("Coupon Type Created", ctx.params.coupontypename);
                        })
                        .catch((err) => {
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'coupontypename')
                                    return this.requestError(CodeTypes.COUPONCODE_ALREADY_EXIST);
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
    coupontype_get: function(ctx) {
        let coupontype = {};
        coupontype['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CouponType.find(ctx, { query: coupontype })
            .then((res) => {
                var arr = res.data;
                return this.requestSuccess("List of coupon type.", arr);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },
    couponapptype_create: async function(ctx) {
        let couponapp = {};
        couponapp['couponapptypename'] = ctx.params.couponapptypename;
        couponapp['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CouponAppType.find(ctx, { query: couponapp })
            .then((res) => {
                if (res.data.length === 0) {
                    return CouponAppType.insert(ctx, ctx.params)
                        .then((res) => {
                            return this.requestSuccess("Coupon App Type Created", ctx.params.couponapptypename);
                        })
                        .catch((err) => {
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'couponapptypename')
                                    return this.requestError(CodeTypes.COUPONCODE_ALREADY_EXIST);
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
    couponapptype_get: function(ctx) {
        let couponapptype = {};
        couponapptype['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CouponAppType.find(ctx, { query: couponapptype })
            .then((res) => {
                var arr = res.data;
                return this.requestSuccess("Coupon app type created.", arr);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    },
    create: async function(ctx) {
        let coupon = {};
        coupon['couponcode'] = ctx.params.couponcode;
        coupon['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return Coupon.find(ctx, { query: coupon })
            .then(res => {
                if (res.data.length === 0) {
                    return Coupon.insert(ctx, {
                            couponcode: ctx.params.couponcode,
                            couponvalue: ctx.params.couponvalue,
                            startdate: ctx.params.startdate,
                            expirydate: ctx.params.expirydate,
                            minvalue: ctx.params.minvalue,
                            isallagent: ctx.params.isallagent,
                            isalluser: ctx.params.isalluser,
                        })
                        .then(async resc => {
                            if (!ctx.params.isallagent && ctx.params.agentslist.length > 0) {
                                let agencies = ctx.params.agentslist;
                                await agencies.map(agent => {
                                    AgentCoupon.insert(ctx, {
                                        agentid: parseInt(agent),
                                        couponid: resc.data.id,
                                        couponcode: ctx.params.couponcode
                                    })
                                })
                            }

                            let users = ctx.params.userslist;
                            await users.map(user => {
                                UserCoupon.insert(ctx, {
                                    userid: parseInt(user.id),
                                    couponid: resc.data.id,
                                    couponcode: ctx.params.couponcode,
                                }).then(res=>{
                                    // Sending mail after user update
                                    let readHTMLFile = function(path, callback) {
                                        fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
                                            if (err) {
                                                throw err;
                                            } else {
                                                callback(null, html);
                                            }
                                        });
                                    };

                                    /*
                                    //Reads the html template,body of the mail content
                                    readHTMLFile(mail_template + "/CouponTemplate.html", function(err, html) {
                                        let template = handlebars.compile(html);
                                        let replacements = {
                                            name: user.firstname + ' '+user.lastname,
                                            couponcode: ctx.params.couponcode,
                                            couponvalue: ctx.params.couponvalue,
                                            message12: "Use our coupon code and enjoy your trip with us!."
                                        };
                                        const htmlToSend = template(replacements);
                                        // this method call the mail service to send mail
                                        // ctx.call("mail.send", {
                                        //     to: user.email,
                                        //     subject: "Coupon Code",
                                        //     html: htmlToSend
                                        // }).then((res) => {
                                        //     return "Email sent successfully.";
                                        // })
                                    });
                                    */
                                })
                            })
                            // if (!ctx.params.isalluser && ctx.params.userslist.length > 0) {
                            //     let users = ctx.params.userslist;
                            //     await users.map(user => {
                            //         UserCoupon.insert(ctx, {
                            //             userid: parseInt(user.id),
                            //             couponid: resc.data.id,
                            //             couponcode: ctx.params.couponcode,
                            //         }).then(res=>{
                            //             // Sending mail after user update
                            //             let readHTMLFile = function(path, callback) {
                            //                 fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
                            //                     if (err) {
                            //                         throw err;
                            //                     } else {
                            //                         callback(null, html);
                            //                     }
                            //                 });
                            //             };
                            //             //Reads the html template,body of the mail content
                            //             readHTMLFile(mail_template + "/CouponTemplate.html", function(err, html) {
                            //                 let template = handlebars.compile(html);
                            //                 let replacements = {
                            //                     name: user.firstname + ' '+user.lastname,
                            //                     couponcode: ctx.params.couponcode,
                            //                     couponvalue: ctx.params.couponvalue,
                            //                     message12: "Use our coupon code and enjoy your trip with us!."
                            //                 };
                            //                 const htmlToSend = template(replacements);
                            //                 // this method call the mail service to send mail
                            //                 ctx.call("mail.send", {
                            //                     to: user.email,
                            //                     subject: "Coupon Code",
                            //                     html: htmlToSend
                            //                 }).then((res) => {
                            //                     return "Email sent successfully.";
                            //                 })
                            //             })
                            //         })
                            //     })
                            // }else{
                                
                            // }

                            return Coupon.find(ctx, { query: { status: 1 } }).then(res => {
                                if (res.data !== undefined) {
                                    return this.requestSuccess("Coupon Created", res);
                                }
                            })

                        })
                        .catch(err => {
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'couponcode')
                                    return this.requestError(CodeTypes.COUPONCODE_ALREADY_EXIST);
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
    update: async function(ctx) {
        let coupon = {};
        coupon['id'] = ctx.params.id;
        coupon['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return Coupon.find(ctx, { query: coupon })
        .then(res => {
            if (res.data.length) {
                return Coupon.updateBy(ctx,ctx.params.id, {
                        couponcode: ctx.params.couponcode,
                        couponvalue: ctx.params.couponvalue,
                        startdate: ctx.params.startdate,
                        expirydate: ctx.params.expirydate,
                        minvalue: ctx.params.minvalue,
                        isallagent: ctx.params.isallagent,
                        isalluser: ctx.params.isalluser,
                    },{query: {id: ctx.params.id}})
                    .then(async resc => {
                        
                        AgentCoupon.removeMany(ctx, {
                            couponid: ctx.params.id
                        });

                        UserCoupon.removeMany(ctx, {
                            couponid: ctx.params.id
                        });
                        
                        if (!ctx.params.isallagent && ctx.params.agentslist.length > 0) {
                            let agencies = ctx.params.agentslist;
                            await agencies.map(agent => {
                                AgentCoupon.insert(ctx, {
                                    agentid: parseInt(agent),
                                    couponid: ctx.params.id,
                                    couponcode: ctx.params.couponcode
                                })
                            })
                        }

                        let users = ctx.params.userslist;
                        await users.map(user => {
                            UserCoupon.insert(ctx, {
                                userid: parseInt(user.id),
                                couponid: ctx.params.id,
                                couponcode: ctx.params.couponcode,
                            }).then(res=>{
                                // Sending mail after user update
                                let readHTMLFile = function(path, callback) {
                                    fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            callback(null, html);
                                        }
                                    });
                                };
                            })
                        });

                        /*
                        let useremail = await sequelize12.query('exec sp_GetEmail @couponCode=:couponcode,@userType=3', {
                            replacements: { couponcode: ctx.params.couponcode, usertypeid: ctx.params.usertypeid },
                            type: Sequ.QueryTypes.SELECT
                        }).then(res => {
                            if(res.length > 0){
                                res.map(user => {
                                    // Sending mail after user update
                                    let readHTMLFile = function(path, callback) {
                                        fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
                                            if (err) {
                                                throw err;
                                            } else {
                                                callback(null, html);
                                            }
                                        });
                                    };

                                    
                                    //Reads the html template,body of the mail content
                                    readHTMLFile(mail_template + "/CouponTemplate.html", function(err, html) {
                                        let template = handlebars.compile(html);
                                        let replacements = {
                                            name: user.firstname + ' '+user.lastname,
                                            couponcode: ctx.params.couponcode,
                                            couponvalue: ctx.params.couponvalue,
                                            message12: `Hurray!, your coupon code validity extended until ${ctx.params.expirydate}`
                                        };
                                        const htmlToSend = template(replacements);
                                        // this method call the mail service to send mail
                                        ctx.call("mail.send", {
                                            to: user.email,
                                            subject: "Coupon Code validity extention",
                                            html: htmlToSend
                                        }).then((res) => {
                                            return "Email sent successfully.";
                                        })
                                    })
                                })
                            }
                        })


                        let agentemail = await sequelize12.query('exec sp_GetEmail @couponCode=:couponcode,@userType=2', {
                            replacements: { couponcode: ctx.params.couponcode, usertypeid: ctx.params.usertypeid },
                            type: Sequ.QueryTypes.SELECT
                        }).then(res => {
                           if(res.length > 0){
                            res.map(user => {
                                // Sending mail after user update
                                let readHTMLFile = function(path, callback) {
                                    fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            callback(null, html);
                                        }
                                    });
                                };

                                //Reads the html template,body of the mail content
                                // readHTMLFile(mail_template + "/CouponTemplate.html", function(err, html) {
                                //     let template = handlebars.compile(html);
                                //     let replacements = {
                                //         name: user.firstname + ' '+user.lastname,
                                //         couponcode: ctx.params.couponcode,
                                //         couponvalue: ctx.params.couponvalue,
                                //         message12: `Hurray!, your coupon code validity extended until ${ctx.params.expirydate}`
                                //     };
                                //     const htmlToSend = template(replacements);
                                //     // this method call the mail service to send mail
                                //     ctx.call("mail.send", {
                                //         to: user.email,
                                //         subject: "Coupon Code validity extention",
                                //         html: htmlToSend
                                //     }).then((res) => {
                                //         return "Email sent successfully.";
                                //     })
                                // })
                                
                            })
                        }
                        })
                        */
                       
                        

                        return Coupon.find(ctx, { query: { status: 1 } }).then(res => {
                            if (res.data !== undefined) {
                                return this.requestSuccess("Coupon code updated", res);
                            }
                        })

                    })
                    .catch(err => {
                        console.log(err)
                        if (err.name === 'Database Error' && Array.isArray(err.data)) {
                            if (err.data[0].type === 'unique' && err.data[0].field === 'couponcode')
                                return this.requestError(CodeTypes.COUPONCODE_ALREADY_EXIST);
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
    //Coupon list get
    getAll: function(ctx) {
        let findcoupon = {};
        findcoupon['status'] = {
            [Op.ne]: DELETE
        };
        return Coupon.find(ctx, { query: findcoupon })
            .then(res => {
                if (res.data.length > 0)
                    return this.requestSuccess("Coupon List", res.data);
                else
                    return this.requestSuccess("Data not available");
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(err);
            });

    },

    getcouponvalue: async function(ctx) {
        let findcoupon = {};
        findcoupon['couponcode'] = ctx.params.code;
        findcoupon['status'] = {
            [Op.ne]: DELETE
        };

        return await sequelize12.query('exec sp_GetCouponValue @couponCode=:couponcode, @userid=:userid, @agentid=:agentid', {
            replacements: { couponcode: ctx.params.code ? ctx.params.code : null, userid: ctx.meta.user ? ctx.meta.user.id : null, agentid: ctx.meta.agentid ? ctx.meta.agentid : null },
            type: Sequ.QueryTypes.SELECT
        }).then(res => {
            //return Coupon.find(ctx, { query: findcoupon })
            //.then(res => {
                if(res.length > 0){
                    return this.requestSuccess("Coupon Found", res[0]);
                } else {
                    return this.requestSuccess("Coupon Found", null);
                }
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(err);
            });
    },

    getcoupon: async function(ctx) {
        let findcoupon = {};
        findcoupon['couponid'] = ctx.params.couponid;
        findcoupon['status'] = {
            [Op.ne]: DELETE
        };

        return await sequelize12.query('exec sp_getcoupon @couponid=:couponid', {
            replacements: { couponid: ctx.params.couponid ? ctx.params.couponid : null },
            type: Sequ.QueryTypes.SELECT
        }).then(res => {
            //return Coupon.find(ctx, { query: findcoupon })
            //.then(res => {
                if(res.length > 0){
                    return this.requestSuccess("Coupon Found", res[0]);
                } else {
                    return this.requestSuccess("Coupon Found", null);
                }
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(err);
            });
    },

    getuseragencylist: function(ctx) {
        let find = {};
        let data = {};
        find['usertypeid'] = 3
        find['status'] = {
            [Op.ne]: DELETE
        };
        return User.find(ctx, { query: find })
            .then(res => {
                if (res.data.length > 0) {
                    data.user = res.data;
                } else{
                    data.user = [];
                }
               return Agent.find(ctx, { query: {agentstatus: 1, status: 1} })
                .then(res => {
                    if (res.data.length > 0) {
                        data.agency = res.data;
                    }else{
                        data.agency = [];
                    }
                }).then(res => {
                    return this.requestSuccess("User and Agency Lists", data);
                })
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(err);
            });

    },
    remove: function(ctx) {
        return Coupon.updateBy(ctx, ctx.params.id, {
            status: 2
        },{
            query: {
                id: ctx.params.id
            }
        }).then(res => {
           if(!ctx.params.isagency){
            AgentCoupon.updateBy(ctx, ctx.params.id, {
                status: 2
            },{
                query: {
                    couponid: ctx.params.id
                }
            })
            UserCoupon.updateBy(ctx, ctx.params.id, {
                status: 2
            },{
                query: {
                    couponid: ctx.params.id
                }
            })
           }
           return Coupon.find(ctx, {
                query: {
                    status: 1
                }
            })
            .then(res => {
                return this.requestSuccess("Requested Coupon Deleted", res.data);
            })
        })
    },
}