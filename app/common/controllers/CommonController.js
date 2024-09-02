"use strict";

const { MoleculerError } 	= require("moleculer").Errors;
const webPush = require("web-push");
const CodeTypes = require("../../../fixtures/error.codes");
const Constants = require("../../../plugin/constants");
const Database = require("../../../adapters/Database");
const Config = require("./../../../config");
const { finished } = require("stream");
const Op = require('sequelize').Op;
//database connections for store Procedures (dashboard counts api)
// const Sequ = require("sequelize");
// const sequelize12 = new Sequ('GATEPASS', 'dbzfmsappsadmin', '$C0ntinental4$$', {
//     host: "52.164.191.36",
//     dialect: config.dialect,
//     port: "14330",
    
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     },
//   });

//Models

// const Discounttype = new Database("Mdiscounttype");
// const Paymentmethod = new Database("Mpaymentmethod");
// const Vat = new Database("Mvat");
// const Aboutus = new Database("Maboutus");
// const Aboutuslang = new Database("Maboutuslang");
// const Mnewslettersubscribe = new Database("Mnewslettersubscribe");
// const Aboutusfilt = new Database("Maboutus", [
//     "id",
//     "aboutuskey",
//     "status",
//     "created_by",
//     "created_at",
// ]);
// const Aboutuslangfilt = new Database("Maboutuslang", [
//     "id",
//     "aboutuslangkey",
//     "languageid",
//     "langshortname",
//     "aboutusid",
//     "content",
//     "created_by",
//     "created_at",
// ]);

const SMS = new Database("Dsms");
const Smtp = new Database("Dsmtp");
const Social = new Database("Dsocialmedia");
const Notification = new Database("Dpushnotification");
const CreditCard = new Database("Dcreditcard");
//DEFAULT STATUS VALUES SEE IN CONSTANTS JS FILE

const {
	DELETE,
	ACTIVE,
	INACTIVE
} = Constants;

module.exports = {


    create: async function(ctx) {
        let findvat = {};
        findvat['vat'] = ctx.params.vat;
        findvat['status'] = ctx.params.status ? ctx.params.status : { [Op.ne]: DELETE };
        return Vat.find(ctx, { query: findvat })
        .then((res) => {
            if (res.data.length === 0) {
                return Vat.insert(ctx, {
                    vat: ctx.params.vat
                })
                .then( (res) => {
                    return this.requestSuccess("Vat Created", ctx.params.vat);
                })
                .catch( (err) => {
                    console.log("Sssssss",err)
                    if (err.name === 'Database Error' && Array.isArray(err.data)){
                        if (err.data[0].type === 'unique' && err.data[0].field === 'username')
                            return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
                    }
                    else if (err instanceof MoleculerError)
                        return Promise.reject(err);
                    else
                        return this.requestError(CodeTypes.UNKOWN_ERROR);
                });
            }
            else {
                return this.requestError(CodeTypes.ALREADY_EXIST);
            }
        })

	},
    // Vat list
    getAll: function(ctx) {
        let findvat = {};
        findvat['status'] = ctx.params.status ? ctx.params.status : { [Op.ne]: DELETE };
        return Vat.find(ctx, { query: findvat })
        .then( (res) => {
            var arr = res.data;
            return this.requestSuccess("List of Vat", arr);
        })
        .catch( (err) => {
            if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else
                return this.requestError(CodeTypes.UNKOWN_ERROR);
        });

    },

    // Discount list
    getAll_discount: function(ctx) {
        let finddiscount = {};
        finddiscount['status'] = ctx.params.status ? ctx.params.status : { [Op.ne]: DELETE };
        return Discounttype.find(ctx, { query: finddiscount })
        .then( (res) => {
            var arr = res.data;
            return this.requestSuccess("List of Discounts", arr);
        })
        .catch( (err) => {
            if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else
                return this.requestError(CodeTypes.UNKOWN_ERROR);
        });

    },

    // Payment list
    getAll_paymentmethod: function(ctx) {
        let findpaymentmethod = {};
        findpaymentmethod['status'] = ctx.params.status ? ctx.params.status : { [Op.ne]: DELETE };
        return Paymentmethod.find(ctx, { query: findpaymentmethod })
        .then( (res) => {
            var arr = res.data;
            return this.requestSuccess("List of Payment Methods", arr);
        })
        .catch( (err) => {
            if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else
                return this.requestError(CodeTypes.UNKOWN_ERROR);
        });

    },

    card_create: async function(ctx){
        return await sequelize12.query('exec sp_CreditCardInformation @Id=:id,@name=:name,@cardnumber=:cardnumber,@expiry=:expiry,@cvv=:cvv', {
            replacements: { id: ctx.params.id, name: ctx.params.cardholdername, cardnumber: ctx.params.cardnumber,
            expiry: ctx.params.expirydate, cvv: ctx.params.cvv },
            type: Sequ.QueryTypes.SELECT
        })
        .then(res => {
            if (res)
                return this.requestSuccess("Card information updated", res);
            else
                return this.requestError(CodeTypes.NOTHING_FOUND);
        })
        .catch(err => {
            console.log(err)
            return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },

    card_get: function(ctx){
        return CreditCard.findOne(ctx, {query: {userid: ctx.params.id}})
        .then(res => {
            console.log(res)
            if (res)
                return this.requestSuccess("Card information updated", res.data);
            else
                return this.requestError(CodeTypes.NOTHING_FOUND);
        })
        .catch(err => {
            console.log(err)
            return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },

    //Particular Vat list
    get: function(ctx) {
        let findvat = {};
        findvat['id'] = ctx.params.id ;
        findvat['status'] = ctx.params.status ? ctx.params.status : { [Op.ne]: DELETE };
        return Vat.find(ctx, { query: findvat })
        .then( (res) => {
            var arr = res.data;
            return this.requestSuccess("Requested Vat", arr);
        })
        .catch( (err) => {
            if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else
                return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },

    //Particular Discounttype list
    get_discounttype: function(ctx) {
        let finddiscountype = {};
        finddiscountype['id'] = ctx.params.id ;
        finddiscountype['status'] = ctx.params.status ? ctx.params.status : { [Op.ne]: DELETE };
        return Discounttype.find(ctx, { query: finddiscountype })
        .then( (res) => {
            var arr = res.data;
            return this.requestSuccess("Requested Discount Type", arr);
        })
        .catch( (err) => {
            if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else
                return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },

    //Particular Payment method list
    get_paymentmethod: function(ctx) {
        let findpaymentmethod = {};
        findpaymentmethod['id'] = ctx.params.id ;
        findpaymentmethod['status'] = ctx.params.status ? ctx.params.status : { [Op.ne]: DELETE };
        return Paymentmethod.find(ctx, { query: findpaymentmethod })
        .then( (res) => {
            var arr = res.data;
            return this.requestSuccess("Requested Payment Method", arr);
        })
        .catch( (err) => {
            if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else
                return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },

     //Particular Payment method list
    dashboard_counts: async function(ctx) {
        let dashboard = {};
        let playersList = await sequelize12.query('EXEC Dashboard_Counts',{type: Sequ.QueryTypes.SELECT});
        dashboard["bookingDetails"] = playersList;
        let playersList1 = await sequelize12.query('EXEC SP_BookingCountByPeriod',{type: Sequ.QueryTypes.SELECT});
        dashboard["overAllReport"] = playersList1.slice(0,4);
        dashboard["overAllReport"][0][playersList1[4]['bookingstatus']] = playersList1[4]['StatusCount'];
        dashboard["overAllReport"][0][playersList1[5]['bookingstatus']] = playersList1[5]['StatusCount'];
        dashboard["overAllReport"][0][playersList1[6]['bookingstatus']] = playersList1[6]['StatusCount'];
        dashboard["overAllReport"][0][playersList1[7]['bookingstatus']] = playersList1[7]['StatusCount'];
        dashboard["overAllReport"][0][playersList1[8]['bookingstatus']] = playersList1[8]['StatusCount']; 
        dashboard["overAllReport"][1][playersList1[9]['bookingstatus']] = playersList1[9]['StatusCount'];
        dashboard["overAllReport"][1][playersList1[10]['bookingstatus']] = playersList1[10]['StatusCount'];
        dashboard["overAllReport"][1][playersList1[11]['bookingstatus']] = playersList1[11]['StatusCount'];
        dashboard["overAllReport"][1][playersList1[12]['bookingstatus']] = playersList1[12]['StatusCount'];
        dashboard["overAllReport"][1][playersList1[13]['bookingstatus']] = playersList1[13]['StatusCount'];
        dashboard["overAllReport"][2][playersList1[14]['bookingstatus']] = playersList1[14]['StatusCount'];
        dashboard["overAllReport"][2][playersList1[15]['bookingstatus']] = playersList1[15]['StatusCount'];
        dashboard["overAllReport"][2][playersList1[16]['bookingstatus']] = playersList1[16]['StatusCount'];
        dashboard["overAllReport"][2][playersList1[17]['bookingstatus']] = playersList1[17]['StatusCount'];
        dashboard["overAllReport"][2][playersList1[18]['bookingstatus']] = playersList1[18]['StatusCount'];
        dashboard["overAllReport"][3][playersList1[19]['bookingstatus']] = playersList1[19]['StatusCount'];
        dashboard["overAllReport"][3][playersList1[20]['bookingstatus']] = playersList1[20]['StatusCount'];
        dashboard["overAllReport"][3][playersList1[21]['bookingstatus']] = playersList1[21]['StatusCount'];
        dashboard["overAllReport"][3][playersList1[22]['bookingstatus']] = playersList1[22]['StatusCount'];
        dashboard["overAllReport"][3][playersList1[23]['bookingstatus']] = playersList1[23]['StatusCount']         
        return dashboard;
    },

    //Vat delete is used change the status and not complete delete
    remove: function(ctx) {
        return  Vat.findOne(ctx, { query: {
            id: ctx.params.id
        }
        })
        .then ((res) =>{
            Vat.updateBy(ctx, res.data.id, {
                status: 2
                }, { query: {
                    id: ctx.params.id
                }
            })
            return this.requestSuccess("Requested Vat Removed", ctx.params.id);

        })

	},

	// About us with multiple language
	getAll_aboutus: function(ctx) {
		let findabout = {};
		findabout['status'] = ctx.params.status ? ctx.params.status : { [Op.ne]: DELETE };
		return Aboutusfilt.find(ctx, { query: findabout })
		.then( (res) => {
			var arr = res.data;
			async function get_aboutus(ctx, arr) {
				let final = [];
				for(var i = 0;i<arr.length;i++) {

					let subject_lang = await Aboutuslangfilt.find(ctx, { query: {aboutusid: arr[i].id,langshortname: ctx.options.parentCtx.params.req.headers.language}})
					.then((lan_res)=>{
						arr[i]["content"] = lan_res.data[0].content;
						return arr[i];
					})


					final.push(subject_lang);
				}
				return final;
			}
			const vali =  get_aboutus(ctx,arr);
			return vali.then((resy)=>{
				return resy;
			})
		})
		.catch( (err) => {
			if (err.name === 'Nothing Found')
				return this.requestError(CodeTypes.NOTHING_FOUND);
			else
				return this.requestError(CodeTypes.UNKOWN_ERROR);
		});

	},
	add_newsletter: async function(ctx) {
        let findemail = {};
        findemail['email'] = ctx.params.email;
        findemail['status'] = ctx.params.status ? ctx.params.status : { [Op.ne]: DELETE };
        return Mnewslettersubscribe.find(ctx, { query: findemail })
        .then((res) => {
            if (res.data.length === 0) {
                return Mnewslettersubscribe.insert(ctx, {
					email: ctx.params.email
                })
                .then( (res) => {
                    return this.requestSuccess("You have Subscribed", ctx.params.email);
                })
                .catch( (err) => {                 
                    if (err.name === 'Database Error' && Array.isArray(err.data)){
                        if (err.data[0].type === 'unique' && err.data[0].field === 'username')
                            return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
                    }
                    else if (err instanceof MoleculerError)
                        return Promise.reject(err);
                    else
                        return this.requestError(CodeTypes.UNKOWN_ERROR);
                });
            }
            else {
                return this.requestError(CodeTypes.ALREADY_EXIST);
            }
        })

    },

    ///////////////////////////////STMP SETTINGS CREATE////////////////////
    sms_create: async function(ctx) {
        return this.generateHash(ctx.params.smsgatewaypassword)
        .then((res) => {
            if (res.data.length > 0) {
                
                return SMS.insert(ctx, {
                    smsgatewayusername: Config.get('/sms/username'),
                    smsgatewaypassword:  Config.get('/sms/password'),
                    smsgatewaysenderid:  Config.get('/sms/from'),
                    smsgatewayisenabled: true//ctx.params.smsgatewayisenabled,
                })
                .then( (res) => {
                    return this.requestSuccess("SMS Gateway Created", ctx.params.smsgatewayusername);
                })
                .catch( (err) => {       
                    console.log(err);
                    if (err.name === 'Database Error' && Array.isArray(err.data)){
                        if (err.data[0].type === 'unique' && err.data[0].field === 'username')
                            return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
                    }
                    else if (err instanceof MoleculerError)
                        return Promise.reject(err);
                    else
                        return this.requestError(CodeTypes.UNKOWN_ERROR);
                });
            }
            else {
                return this.requestError(CodeTypes.ALREADY_EXIST);
            }
        })

    },
    sms_get: function(ctx) {
        let sms = {};
        sms['id'] = 1 ;
        sms['status'] = ctx.params.status ? ctx.params.status : { [Op.ne]: DELETE };
        return SMS.find(ctx, { query: sms })
        .then( (res) => {
            var arr = res.data;
            return this.requestSuccess("Requested Social Media Links", arr);
        })
        .catch( (err) => {
            if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else
                return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },

    sms_update: function(ctx) {
        return SMS.updateBy(ctx, 1, {
            smsgatewayusername: ctx.params.smsgatewayusername,
            smsgatewaypassword: ctx.params.smsgatewaypassword,
            smsgatewaysenderid: ctx.params.smsgatewaysenderid,
            smsgatewayisenabled: ctx.params.smsgatewayisenabled,
         }, { query: {
                 id: 1
             } 
         })
         .then((res)=>{
             return this.requestSuccess("SMS Gateway Updated",res.data);     
         }) 
         .catch( (err) => {                
             if (err.name === 'Database Error' && Array.isArray(err.data)){
                 if (err.data[0].type === 'unique' && err.data[0].field === 'facebook')
                     return this.requestError(CodeTypes.T1_FIRST_CONSTRAINT);
             }
             else if (err instanceof MoleculerError)
                 return Promise.reject(err);
             else if (err.name === 'Nothing Found')
                 return this.requestError(CodeTypes.NOTHING_FOUND);
             else
                 return this.requestError(CodeTypes.UNKOWN_ERROR);
         })         
    },
    sms_remove: function(ctx) {
        return  SMS.findOne(ctx, { query: {
            id: ctx.params.id
        }
        })
        .then ((res) =>{
            SMS.updateBy(ctx, res.data.id, {
                status: 2
                }, { query: {
                    id: ctx.params.id
                }
            })
            return this.requestSuccess("Requested SMS Gateway Deleted", ctx.params.id);
        })
    },

    ///////////////////////////////STMP SETTINGS CREATE////////////////////
    smtp_create: async function(ctx) {
        
        return this.generateHash(ctx.params.smtppassword)
        .then((res) => {
            if (res.data.length > 0) {
                return Smtp.insert(ctx, {
                    // smtphost: ctx.params.smtphost,
                    // smtpencryption: ctx.params.smtphost,
                    // smtpport: ctx.params.smtpport,
                    // smtpusername: ctx.params.smtpusername,
                    // smtppassword: res.data,
                    // smtpisenabled: ctx.params.smtpisenabled,
                    smtphost: Config.get('/smtp/host'),
                    smtpencryption: Config.get('/smtp/encryption'),
                    smtpport: Config.get('/smtp/port'),
                    smtpusername: Config.get('/smtp/username'),
                    smtppassword: Config.get('/smtp/password'),
                    smtpisenabled: true,
                })
                .then( (res) => {
                    return this.requestSuccess("SMTP Created", ctx.params.smtpusername);
                })
                .catch( (err) => {       
                    if (err.name === 'Database Error' && Array.isArray(err.data)){
                        if (err.data[0].type === 'unique' && err.data[0].field === 'smtpusername')
                            return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
                    }
                    else if (err instanceof MoleculerError)
                        return Promise.reject(err);
                    else
                        return this.requestError(CodeTypes.UNKOWN_ERROR);
                });
            }
            else {
                return this.requestError(CodeTypes.ALREADY_EXIST);
            }
        })

    },
    
    // SMTP list
    smtp_getAll: function(ctx) {
        let findsmtp = {};
        findsmtp['status'] = ctx.params.status ? ctx.params.status : { [Op.ne]: DELETE };
        return Smtpfilt.find(ctx, { query: findsmtp })
        .then( (res) => {
            var arr = res.data;
            return this.requestSuccess("List of SMTPS", arr);
        })
        .catch( (err) => {
            if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else
                return this.requestError(CodeTypes.UNKOWN_ERROR);
        });

    },

    smtp_get: function(ctx) {
        let smtp = {};
        smtp['id'] = 1 ;
        smtp['status'] = ctx.params.status ? ctx.params.status : { [Op.ne]: DELETE };
        return Smtp.find(ctx, { query: smtp })
        .then( (res) => {
            var arr = res.data;
            return this.requestSuccess("Requested Social Media Links", arr);
        })
        .catch( (err) => {
            if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else
                return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },

    smtp_update: function(ctx) {
        return Smtp.updateBy(ctx, 1, {
            smtphost: ctx.params.smtphost,
            smtpencryption: ctx.params.smtpencryption,
            smtpport: ctx.params.smtpport,
            smtpusername: ctx.params.smtpusername,
            smtppassword: ctx.params.smtppassword,
            smtpisenabled: ctx.params.smtpisenabled,
         }, { query: {
                 id: 1
             } 
         })
         .then((res)=>{
             return this.requestSuccess("SMTP Updated",res.data);     
         }) 
         .catch( (err) => {                
             if (err.name === 'Database Error' && Array.isArray(err.data)){
                 if (err.data[0].type === 'unique' && err.data[0].field === 'first')
                     return this.requestError(CodeTypes.T1_FIRST_CONSTRAINT);
             }
             else if (err instanceof MoleculerError)
                 return Promise.reject(err);
             else if (err.name === 'Nothing Found')
                 return this.requestError(CodeTypes.NOTHING_FOUND);
             else
                 return this.requestError(CodeTypes.UNKOWN_ERROR);
         })         
    },

    smtp_remove: function(ctx) {
        return  Smtp.findOne(ctx, { query: {
            id: ctx.params.id
        }
        })
        .then ((res) =>{
            Smtp.updateBy(ctx, res.data.id, {
                status: 2
                }, { query: {
                    id: ctx.params.id
                }
            })
            return this.requestSuccess("Requested SMTP Deleted", ctx.params.id);

        })
    },
    ///////////////////////////////SMTP SETTINGS END////////////////////

    ///////////////////////////////SOCIALMEDIA SETTINGS////////////////////
    social_create: async function(ctx) {
        
        return Social.insert(ctx, ctx.params)
        .then( (res) => {
            return this.requestSuccess("Social Medias Added");
        })
        .catch( (err) => {       
            if (err.name === 'Database Error' && Array.isArray(err.data)){
                if (err.data[0].type === 'unique' && err.data[0].field === 'username')
                    return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
            }
            else if (err instanceof MoleculerError)
                return Promise.reject(err);
            else
                return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },
    
    // Social Media list
    social_getAll: function(ctx) {
        let findsocial = {};
        findsocial['status'] = ctx.params.status ? ctx.params.status : { [Op.ne]: DELETE };
        return Social.find(ctx, { query: findsocial })
        .then( (res) => {
            var arr = res.data;
            return this.requestSuccess("List of Social Media Links", arr);
        })
        .catch( (err) => {
            if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else
                return this.requestError(CodeTypes.UNKOWN_ERROR);
        });

    },

    social_get: function(ctx) {
        let findsocial = {};
        findsocial['id'] = 1 ;
        findsocial['status'] = ctx.params.status ? ctx.params.status : { [Op.ne]: DELETE };
        return Social.find(ctx, { query: findsocial })
        .then( (res) => {
            var arr = res.data;
            return this.requestSuccess("Requested Social Media Links", arr);
        })
        .catch( (err) => {
            if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else
                return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },

    //Social Media update (all fields are mandatory)
    social_update: function(ctx) {
        return Social.find(ctx, {status: 1}).then(res =>{
           if(res.data.length > 0){
                return Social.updateBy(ctx, 1, {
                    facebook: ctx.params.facebook,
                    twitter: ctx.params.twitter,
                    instagram: ctx.params.instagram,
                    snapchat: ctx.params.snapchat
                }, { query: {id: 1}})
                .then((res)=>{
                    return this.requestSuccess("Social Media Links Updated",res.data);     
                }) 
                .catch( (err) => {      
                    console.log(err)          
                    if (err.name === 'Database Error' && Array.isArray(err.data)){
                        if (err.data[0].type === 'unique' && err.data[0].field === 'first')
                            return this.requestError(CodeTypes.T1_FIRST_CONSTRAINT);
                    }
                    else if (err instanceof MoleculerError)
                        return Promise.reject(err);
                    else if (err.name === 'Nothing Found')
                        return this.requestError(CodeTypes.NOTHING_FOUND);
                    else
                        return this.requestError(CodeTypes.UNKOWN_ERROR);
                })              
           }else{
                return Social.insert(ctx, {
                    facebook: ctx.params.facebook,
                    twitter: ctx.params.twitter,
                    instagram: ctx.params.instagram,
                    snapchat: ctx.params.snapchat
                })
           }
        })
               
                
    },

    social_remove: function(ctx) {
        return  Social.findOne(ctx, { query: {
            id: ctx.params.id
        }
        })
        .then ((res) =>{
            Social.updateBy(ctx, res.data.id, {
                status: 2
                }, { query: {
                    id: ctx.params.id
                }
            })
            return this.requestSuccess("Requested Social Media Links Deleted");

        })
    },
    ///////////////////////////////SOCIALMEDIA SETTINGS END////////////////////

    //////////////////////////////// PUSH NOTIFICATION START /////////////////////////////
    pushnotify_send: async function(ctx) {
        
        return Notification.insert(ctx, ctx.params)
        .then( (res) => {
            return this.requestSuccess("Push notification message has sent.");
        })
        .catch( (err) => {       
            if (err.name === 'Database Error' && Array.isArray(err.data)){
                if (err.data[0].type === 'unique' && err.data[0].field === 'username')
                    return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
            }
            else if (err instanceof MoleculerError)
                return Promise.reject(err);
            else
                return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },
    //////////////////////////////// PUSH NOTIFICATION END //////////////////////////////
}
