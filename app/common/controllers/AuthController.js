"use strict";

const ConstantsMailTemplate = require("../../../plugin/constants-mail-template");
const dlMailer = require("../../../helpers/DLMailer");

const jwt = require("jsonwebtoken");
const passwordHash = require('password-hash');
const { pick } = require("lodash");
const Promise = require("bluebird");
const { MoleculerError } = require("moleculer").Errors;
const fs = require('fs');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const Op = require('sequelize').Op;
const CodeTypes = require("../../../fixtures/error.codes");
const Config = require("../../../config");
const Constants = require("../../../plugin/constants");
const Database = require("../../../adapters/Database");
const activity = require("../../../helpers/activitylog");
const dlSMS = require("../../../helpers/DLSMS");
const otpGenerator = require("otp-generator");

const mail_template = __dirname;
var googleAuth = require('./googleAuth.js');
var facebookAuth = require('./facebookAuth.js');
const { Console } = require("console");

const Sequ = require("sequelize");
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
// Filters applied when searching for entities
// Elements correspond to the columns of the table
const Filters_Logins = {
    security: ["id", "password", "usertypeid", "email", "isverified"],
    user_security: ["id", "password", "usertypeid", "isverified"],
    user_filterBy: ["id", "username", "password", "usertypeid", "isverified"],
    user_security1: ["id", "password", "usertypeid"],
    encode: ["id", "usertypeid", "isverified"],
    //encode: ["id", "usertypeid","isverified"]
};
const Filters_Tokens = {
    empty: ["id", "login_type"]
};

const JWT_SECRET = "TOP SECRET!!!";

const {
    DELETE,
    ACTIVE,
    INACTIVE,
    ADMIN_ROLE,
    USER_ROLE
} = Constants;
const Roles = [ADMIN_ROLE, USER_ROLE];

//Models
// Create Promisify encode & verify methods
const encode = Promise.promisify(jwt.sign);
const verify = Promise.promisify(jwt.verify);

const User = new Database("Duser");
const Userfilt = new Database("Duser", [
    "id",
    "userkey",
    "firstname",
    "lastname",
    "username",
    "email",
    "contactnumber",
    "cityid",
    "countryid",
    "usertypeid",
    "socialtypeid",
    "socialkey",
    "devicetype",
    "devicetoken",
    "status",
    "otp",
    "otpreference"
]);
const agent = new Database("Dagent");
const agentfilt = new Database("Dagent");
const agentlang = new Database("Dagentlang");
const agentimagefilt = new Database("Dagentimage", [
    'id',
    "agentimagekey",
    "agentid",
    "agentimagepath",
    "status"
]);
const Tokens = new Database("Dtoken", Filters_Tokens.empty);
const Admin = new Database("Dadmin");
const Adminfilt = new Database("Dadmin", [
    "id",
    "adminkey",
    "firstname",
    "lastname",
    "username",
    "email",
    "usertypeid",
    "devicetype",
    "devicetoken",
    "status",
    "created_by",
    "created_at",
    "updated_at",
    "updated_by"
]);
const Language = new Database("Dlanguage");
const Agentlang = new Database("Dagentlang");
const Role = new Database("Drole");
const Agentimage = new Database("Dagentimage", ["agentimagepath"]);

module.exports = {

    // verify the token before enter into other actions.

    verifyToken: function(ctx) {
        return Tokens.findOne(ctx, {
                query: {
                    token: ctx.params.token
                }
            })
            .then((res) => {

                if(res.data != undefined) {
                    return verify(ctx.params.token, JWT_SECRET)
                } else {
                    return this.requestError(CodeTypes.AUTH_INVALID_CREDENTIALS);
                }
            })
            .catch(() => undefined);
    },

    // verify password for all users if exists
    verifyPassword: function(ctx) {
        let findUser = {};
        if(ctx.params.username.includes("@")){
            findUser['email'] = ctx.params.username;
        }else{
            findUser['contactnumber'] = ctx.params.username;
        }
        findUser['userstatus'] = 1;
        findUser['usertypeid'] = 1;
        findUser['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return User.findOne(ctx, {query: findUser })
            .then((res) => {
                if (passwordHash.verify(ctx.params.password, res.data.password)) {
                    var otp = otpGenerator.generate(4, {
                        upperCase: false,
                        specialChars: false,
                        alphabets: false,
                    });

                    otp = 1234;
                    const otpRef = Math.random().toString(36).substring(2, 24);
                    
                    dlSMS.sendSMS(ctx, res.data.contactnumber.replace(/\D/g, ""), "Your OTP number is: " + otp);

					return User.updateBy(ctx, 1, { otp: otp, otpreference: otpRef}, {
						query: {
							id: res.data.id
						}
                    }).then(result => {
                    	return this.requestSuccess("Valid Password", pick(res.data, Filters_Logins.encode));
					}).catch((err) => {
                        return this.requestError(CodeTypes.AUTH_INVALID_CREDENTIALS);
            		});
                } else {
                    return this.requestError(CodeTypes.AUTH_INVALID_CREDENTIALS);
                }
            })
            .catch((err) => {
                if (err instanceof MoleculerError)
                    return Promise.reject(err);
                else if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else if (err.name === 'TypeError') {
                    return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
                } else {
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
                }
            });
    },

    resendOtp: function(ctx) {
        let findUser = {};
        findUser['otpreference'] = ctx.params.otpreference;
        findUser['userstatus'] = 1;
        findUser['usertypeid'] = 1;
        findUser['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        
        console.log("00000000000000");
        console.log(findUser);

        return User.findOne(ctx, {query: findUser })
            .then((res) => {

                var otp = otpGenerator.generate(4, {
                    upperCase: false,
                    specialChars: false,
                    alphabets: false,
                });

                otp = 1234;
                
                const otpRef = Math.random().toString(36).substring(2, 24);

                
                dlSMS.sendSMS(ctx, res.data.contactnumber.replace(/\D/g, ""), "Your OTP number is: " + otp);

                return User.updateBy(ctx, 1, { otp: otp, otpreference: otpRef}, {
                    query: {
                        id: res.data.id
                    }
                }).then(result => {
                    return this.requestSuccess("Valid Request", pick(res.data, Filters_Logins.encode));
                }).catch((err) => {
                    console.log("222222222222");
                    console.log(err);
                    return this.requestError(CodeTypes.AUTH_INVALID_CREDENTIALS);
                });
            })
            .catch((err) => {
                if (err instanceof MoleculerError)
                    return Promise.reject(err);
                else if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else if (err.name === 'TypeError') {
                    return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
                } else {
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
                }
            });
    },

    // verify password for all users if exists
    verifyOtp: function(ctx) {
        let findUser = {};
        if(ctx.params.username.includes("@")){
			findUser['email'] = ctx.params.username;
		} else {
			findUser['contactnumber'] = ctx.params.username;
        }
        findUser['otpreference'] = ctx.params.otpreference;
        findUser['otp'] = ctx.params.otp;
        findUser['userstatus'] = 1;
        findUser['usertypeid'] = 1;
        findUser['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return User.findOne(ctx, {query: findUser })
            .then((res) => {
                return this.requestSuccess("Valid Otp", pick(res.data, Filters_Logins.encode));
            })
            .catch((err) => {
                if (err instanceof MoleculerError)
                    return Promise.reject(err);
                else if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else if (err.name === 'TypeError') {
                    return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
                } else {
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
                }
            });
    },

    // check the login for all user ex: admin/user/client(any)
    login: function(ctx) {
        ctx.meta.username = ctx.params.username;
        return ctx.call("auth.verifyPassword", { username: ctx.params.username, password: ctx.params.password })
            .then((res) => {
                return this.generateToken(res.data)
                    .then((res2) => {
                        return Tokens.insert(ctx, {
                                userId: res.data.id,
                                login_type: "admin",
                                token: res2
                            })
                            .then((resy) => {
                                let final_output = [];
                                return Userfilt.findOne(ctx, {
                                        query: {
                                            id: res.data.id
                                        }
                                    })
                                    .then(async res => {
                                        return await sequelize12.query('exec sp_getUserPermission @Id=:id', {
                                            replacements: { id: res.data.id },
                                            type: Sequ.QueryTypes.SELECT
                                        })
                                        .then(resPer => {
                                            if (resPer.length > 0)
                                                {
                                                    var otpDetails = {
														otpreference: res.data.otpreference
													};
                                                    final_output.push(otpDetails);
                                                    
                                                    ctx.meta.log = 'Authenticated. Please enter the OTP now.';
                                                    activity.setLog(ctx);
                                                    return this.requestSuccess("Please enter the OTP.", res2, otpDetails);
                                                }
                                            else
                                                return this.requestError(CodeTypes.INVALID_ROLE_PERMISSION);
                                        }).catch(err=>{
                                            console.log(err)
                                        })
                                    })

                            })
                    })
            })
            .catch((err) => {
                if (err instanceof MoleculerError) {
                    ctx.meta.log = 'Invalid Credentials';
                    activity.setLog(ctx);
                    return Promise.reject(err);
                } else {
                    ctx.meta.log = CodeTypes.USERS_NOTHING_FOUND;
                    activity.setLog(ctx);
                    return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
                }
            });
    },

    // check the login for all user ex: admin/user/client(any)
	loginOtp: function(ctx) {
		ctx.meta.username = ctx.params.username;
		return ctx.call("auth.verifyOtp", { username: ctx.params.username, otpreference: ctx.params.otpreference, otp: ctx.params.otp })
			.then((res) => {
				return this.generateToken(res.data)
					.then((res2) => {
						return Tokens.insert(ctx, {
								userId: res.data.id,
								login_type: "admin",
								token: res2
							})
							.then((resy) => {
								let final_output = [];
								return Userfilt.findOne(ctx, {
										query: {
											id: res.data.id
										}
									})
									.then(async res => {
										final_output.push(res.data);
										return await sequelize12.query('exec sp_getUserPermission @Id=:id', {
											replacements: { id: res.data.id },
											type: Sequ.QueryTypes.SELECT
										})
										.then(res => {

                                            if (res.length > 0)
												{
													final_output.push(res);
													ctx.meta.log = 'Logged in successfully';
													activity.setLog(ctx);
													return this.requestSuccess("Login Success", res2, final_output);
												}
											else
												return this.requestError(CodeTypes.INVALID_ROLE_PERMISSION);
										}).catch(err=>{
											console.log(err)
										})
									})

							})
					})
			})
			.catch((err) => {
				if (err instanceof MoleculerError) {
					ctx.meta.log = 'Invalid OTP. Please try again.';
					activity.setLog(ctx);
					return Promise.reject(err);
				} else {
					ctx.meta.log = CodeTypes.USERS_NOTHING_FOUND;
					activity.setLog(ctx);
					return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
				}
			});
	},

    // check the login for all user ex: admin/user/client(any)
	loginOtpResend: function(ctx) {
		ctx.meta.username = ctx.params.username;
        return ctx.call("auth.resendOtp", { username: ctx.params.username, otpreference: ctx.params.otpreference })
            .then((res) => {
                return this.generateToken(res.data)
                    .then((res2) => {
                        let final_output = [];
                        return Userfilt.findOne(ctx, {
                                query: {
                                    id: res.data.id
                                }
                            })
                            .then(async res => {
                                var otpDetails = {
                                    otpreference: res.data.otpreference
                                };
                                final_output.push(otpDetails);
                                
                                ctx.meta.log = 'Authenticated. Please enter the OTP now.';
                                activity.setLog(ctx);
                                return this.requestSuccess("Please enter the OTP.", res2, otpDetails);
                            })
                    })
            })
            .catch((err) => {
                if (err instanceof MoleculerError) {
                    ctx.meta.log = 'Invalid Credentials';
                    activity.setLog(ctx);
                    return Promise.reject(err);
                } else {
                    ctx.meta.log = CodeTypes.USERS_NOTHING_FOUND;
                    activity.setLog(ctx);
                    return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
                }
            });
	},

    // Reset Password for Admin with mail forward
    resetPassword: function(ctx) {
        //Random password generation
        const str = Math.floor(100000 + Math.random() * 900000)
        const stmr = str.toString();
        const rande = stmr.split(".");
        return User.find(ctx, {
                query: {
                    email: ctx.params.email,
                    status: {
                        [Op.ne]: DELETE
                    }
                }
            })
            .then((response) => {
                // console.log('pass ',rande[0]);
                if (response.data)
                //generateHash gives encrypted password
                    return this.generateHash(rande[0])
                    .then((res) => {
                        return User.updateBy(ctx, 1, { password: res.data }, {
                                query: {
                                    id: response.data[0].id
                                }
                            })
                            .then((result) => {
                                let readHTMLFile = function(path, callback) {
                                    fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            callback(null, html);
                                        }
                                    });
                                };

                                const verificationLink = `https://drivelounge.com/reset/${response.data[0].userkey}`
                                let replacements = {
                                    name: `${response.data[0].firstname} ${response.data[0].lastname}`,
                                    username: response.data[0].username,
                                    subject: ConstantsMailTemplate.AdminPasswordResetSubject,
                                    link: verificationLink,
                                };
                                dlMailer.sendMail(ctx, ConstantsMailTemplate.AdminPasswordReset, Constants.AdminMailId, replacements);

                                var htmlToSend = '';

                                /*
                                readHTMLFile(mail_template + "/Requesttemplate.html", function(err, html) {

                                    let template = handlebars.compile(html);
                                    let replacements = {
                                        username: response.data[0].username,
                                        password: rande[0]
                                    };
                                    htmlToSend = template(replacements);

                                    ctx.call("mail.send", {
                                        to: ctx.params.email,
                                        subject: "Forget Password Details",
                                        html: htmlToSend
                                    }).then((res) => {
                                        return "Email sent successfully.";
                                    })

                                    // this.sendEmail({
                                    //     from: 'yaaditec@gmail.com', // sender address
                                    //     to: ctx.params.email, // list of receivers
                                    //     subject: "Forget Password Details", // Subject line
                                    //     text: "Hello world?", // plain text body
                                    //     html: htmlToSend // html body
                                    //   }).then(res => {
                                    //     return "Password Resetted Please Check Email"
                                    //   })
                                });
                                */

                            })
                    })
                else
                    return this.requestError(CodeTypes.ALREADY_EXIST);
            }).catch((err) => {
                if (err instanceof MoleculerError)
                    return Promise.reject(err);
                else
                    return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
            });
    },

    user_login: async function(ctx) {
        if (ctx.params.socialtypeid == 1 && ctx.params.socialkey != "") {

            return googleAuth.getUser(ctx.params.socialkey)
                .then(response => {

                    var userDetails = {
                        username: response.id,
                        password: response.id,
                        firstname: response.name,
                        confirmpassword: response.id,
                        socialtypeid: ctx.params.socialtypeid,
                        email: response.email,
                    };

                    return ctx.call("user.verifyUsername", { username: response.id, userDetails: userDetails })
                        .then((userId) => {
                            var user = {
                                id: userId,
                                username: response.id,
                                usertypeid: 2,
                                iat: 1596987716
                            };

                            this.logger.info(")))))))))))))))))))) 444444444");
                            this.logger.info(user);
                            this.logger.info(")))))))))))))))))))) 444444444");

                            return this.generateToken(user)
                                .then((res2) => {



                                    this.logger.info("))))))))))))))))))))");
                                    this.logger.info(userId);
                                    this.logger.info("))))))))))))))))))))");


                                    return Tokens.insert(ctx, {
                                            userId: userId,
                                            token: res2
                                        })
                                        .then(() => {
                                            ctx.meta.username = userDetails.email;
                                            ctx.meta.log = 'Successfully logged in with google';
                                            activity.setLog(ctx);
                                            var details = {
                                                name: "User Login Success",
                                                data: res2,
                                                code: 200
                                            };
                                            return details;
                                        });
                                }).then(user => { return user; });
                        });
                }).catch((err) => {
                    ctx.meta.username = ctx.params.socialkey;
                    ctx.meta.log = 'Log in failed with google';
                    activity.setLog(ctx);
                    if (err instanceof MoleculerError)
                        return Promise.reject(err);
                    else {
                        this.logger.info(err);
                        return this.requestError(CodeTypes.UNKOWN_ERROR);
                    }
                });
        } else if (ctx.params.socialtypeid == 2 && ctx.params.socialkey != "") {
            return facebookAuth.getUser(ctx.params.socialkey)
                .then(response => {

                    var user = {
                        id: 6,
                        username: response.id,
                        usertypeid: 2,
                        iat: 1596987716
                    };
                    return this.generateToken(user)
                        .then((res2) => {

                            return Tokens.insert(ctx, {
                                    userId: 100,
                                    token: res2
                                })
                                .then(() => {
                                    ctx.meta.username = user.username;
                                    ctx.meta.log = 'Successfully logged in with facebook';
                                    activity.setLog(ctx);
                                    var details = {
                                        name: "User Login Success",
                                        data: res2,
                                        code: 200
                                    };
                                    return details;
                                });
                        }).then(user => { return user; });
                }).catch((err) => {
                    ctx.meta.username = ctx.params.socialkey;
                    ctx.meta.log = 'Log in failed with facebook';
                    activity.setLog(ctx);
                    if (err instanceof MoleculerError)
                        return Promise.reject(err);
                    else {
                        this.logger.info(err);
                        return this.requestError(CodeTypes.UNKOWN_ERROR);
                    }
                });
        } else {
            return ctx.call("auth.user_verifyPassword", { email: ctx.params.email, password: ctx.params.password })
                .then(res => {
                    return this.generateToken(res.data)
                        .then((res2) => {
                            return Tokens.insert(ctx, {
                                    userId: res.data.id,
                                    login_type: "users",
                                    token: res2
                                })
                                .then(response_ => {
                                    let final_output = [];
                                    return Userfilt.findOne(ctx, { query: { id: res.data.id } })
                                        .then((res) => {
                                            ctx.meta.username = ctx.params.email;
                                            ctx.meta.log = 'Successfully logged in';
                                            activity.setLog(ctx);
                                            final_output.push(res.data);
                                            return this.requestSuccess("Login Success", res2, final_output)
                                        })
                                });
                        })
                })
                .catch((err) => {
                    ctx.meta.username = ctx.params.email;
                    ctx.meta.log = 'Attempt to login failed';
                    activity.setLog(ctx);
                    if (err instanceof MoleculerError) {
                        return Promise.reject(err);
                    } else {
                        ctx.meta.log = CodeTypes.USERS_NOTHING_FOUND;
                        activity.setLog(ctx);
                        return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
                    }
                });
        }
    },

    // Reset Password for User with mail forward
    user_resetPassword: function(ctx) {
        //Random password generation
        const str = Math.floor(100000 + Math.random() * 900000)
        const stmr = str.toString();
        const rande = stmr.split(".");
        return User.find(ctx, {
                query: {
                    email: ctx.params.email,
                    usertypeid: 3
                }
            })
            .then((response) => {
                if (response.data) {
                    console.log((response.data[0]))
                    return this.generateHash(rande[0])
                        .then((res) => {
                            ctx.meta.username = ctx.params.email;
                                ctx.meta.log = 'Password has been reseted';
                                activity.setLog(ctx);
                                let readHTMLFile = function(path, callback) {
                                    fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            callback(null, html);
                                        }
                                    });
                                };

                                const verificationLink = `https://drivelounge.com/reset/${response.data[0].userkey}`
                                let replacements = {
                                    name: response.data[0].roleid == 1 ? 'Admin' : `${response.data[0].firstname} ${response.data[0].lastname}`,
                                    link: verificationLink,
                                    subject: ConstantsMailTemplate.UserUserPasswordResetSubject,
                                };
                                dlMailer.sendMail(ctx, ConstantsMailTemplate.UserUserPasswordReset, response.data[0].email, replacements);



                                /*
                                readHTMLFile(mail_template + "/Usertemplate_reset.html", function(err, html) {

                                    let template = handlebars.compile(html);
                                    let replacements = {
                                        username: response.data[0].email,
                                        key: verificationLink,
                                    };
                                    const htmlToSend = template(replacements);

                                    ctx.call("mail.send", {
                                        to: ctx.params.email,
                                        subject: "Forget Password Details",
                                        html: htmlToSend
                                    }).then((res) => {
                                        return "Email sent successfully.";
                                    })
                                });
                                */

                                return "Please check your email"
                        });
                } else {
                    ctx.meta.username = ctx.params.email;
                    ctx.meta.log = 'Password reset failed with Invalid email';
                    activity.setLog(ctx);
                    return this.requestError(CodeTypes.ALREADY_EXIST);
                }
            }).catch((err) => {
                ctx.meta.username = ctx.params.email;
                ctx.meta.log = 'Password reset failed with Invalid data';
                activity.setLog(ctx);
                if (err instanceof MoleculerError)
                    return Promise.reject(err);
                else
                    return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
            });
    },

    user_reset: function(ctx) {
        console.log(ctx.params)
        return User.find(ctx, {
                query: {
                    userkey: ctx.params.key
                }
            })
            .then((response) => {
                if (response.data) {
                    return this.generateHash(ctx.params.password)
                        .then((res) => {
                            return User.updateBy(ctx, 1, { password: res.data}, {
                                query: {
                                    id: response.data[0].id
                                }
                            }).then(result => {
                                ctx.meta.username = response.data[0].email;
                                ctx.meta.log = 'User change password request successfully';
                                activity.setLog(ctx);


                                let replacements = {
                                    name: response.data[0].roleid == 1 ? 'Admin' : `${response.data[0].firstname} ${response.data[0].lastname}`,
                                    subject: ConstantsMailTemplate.UserUserPasswordResetConfirmationSubject,
                                };
                                dlMailer.sendMail(ctx, ConstantsMailTemplate.UserUserPasswordResetConfirmation, response.data[0].email, replacements);


                                /*
                                let readHTMLFile = function(path, callback) {
                                    fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            callback(null, html);
                                        }
                                    });
                                };
                                readHTMLFile(mail_template + "/Userlogincredentialstemplate.html", function(err, html) {




                                    let template = handlebars.compile(html);
                                    let replacements = {
                                        username: response.data[0].email,
                                        password: ctx.params.password
                                    };
                                    const htmlToSend = template(replacements);

                                    ctx.call("mail.send", {
                                        to: response.data[0].email,
                                        subject: "Change Password",
                                        html: htmlToSend
                                    }).then((res) => {
                                        return "Email sent successfully.";
                                    })
                                });
                                */

                                return "Password reset success";
                            })
                        })
                } else
                    return this.requestError(CodeTypes.ALREADY_EXIST);
            }).catch((err) => {
                ctx.meta.username = ctx.params.email;
                ctx.meta.log = 'User Password reset attempt failed';
                activity.setLog(ctx);
                if (err instanceof MoleculerError)
                    return Promise.reject(err);
                else
                    return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
            });
    },


    verify_change_Password: function(ctx) {
        return User.findOne(ctx, {
                query: {
                    id: ctx.params.id
                },
                // filter: Filters_Loguser
            })
            .then((res) => {
                console.log(pick(res.data, Filters_Logins.encode))
                if (passwordHash.verify(ctx.params.password, res.data.password))
                    return this.requestSuccess("Valid Password", pick(res.data, Filters_Logins.encode));
                else
                    return this.requestError(CodeTypes.AUTH_INVALID_CREDENTIALS);
            })
            .catch((err) => {
                if (err instanceof MoleculerError)
                    return Promise.reject(err);
                else if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else {
                    this.logger.info(err);
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
                }
            });
    },

    user_verifyPassword: function(ctx) {
        let findUser = {};
        if(ctx.params.email.includes("@")){
            findUser['email'] = ctx.params.email;
        }else{
            findUser['contactnumber'] = ctx.params.email;
        }
        findUser['userstatus'] = 1;
        findUser['usertypeid'] = 3;
        findUser['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return User.findOne(ctx, {
                query: findUser,
                filter: Filters_Logins.security
            })
            .then(res => {
                if (res.data) {
                    let findUser1 = {};
                    findUser1['email'] = res.data.email;
                    findUser1['status'] = ctx.params.status ? ctx.params.status : {
                        [Op.ne]: DELETE
                    };
                    return User.findOne(ctx, {
                            query: findUser1,
                            filter: Filters_Logins.security
                        })
                        .then((res) => {
                            if (passwordHash.verify(ctx.params.password, res.data.password)) {
                                if (res.data.isverified == 1) {
                                    return this.requestSuccess("Valid Password", pick(res.data, Filters_Logins.encode));
                                } else {
                                    return this.requestError(CodeTypes.AUTH_UNAPPROVED);
                                }
                            } else {
                                return this.requestError(CodeTypes.AUTH_INVALID_CREDENTIALS);
                            }
                        })
                        .catch((err) => {
                            if (err instanceof MoleculerError)
                                return Promise.reject(err);
                            else if (err.name === 'Nothing Found')
                                return this.requestError(CodeTypes.NOTHING_FOUND);
                            else if (err.name === 'TypeError') {
                                return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
                            } else {
                                return this.requestError(CodeTypes.UNKOWN_ERROR);
                            }
                        })
                } else {
                    if (passwordHash.verify(ctx.params.password, res.data.password)) {
                        if ((res.data.isverified == 1)) {
                            return this.requestSuccess("Valid Password", pick(res.data, Filters_Logins.encode));
                        } else {
                            return this.requestError(CodeTypes.AUTH_UNAPPROVED);
                        }
                    } else {
                        return this.requestError(CodeTypes.AUTH_INVALID_CREDENTIALS);
                    }
                }
            })
            .catch((err) => {
                console.log(err)
                if (err instanceof MoleculerError)
                    return Promise.reject(err);
                else if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else if (err.name === 'TypeError') {
                    return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
                } else {
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
                }
            });

    },

    verifyuser_change_Password: function(ctx) {
        return User.findOne(ctx, {
                query: {
                    id: ctx.params.id
                },
                filter: Filters_Loguser
            })
            .then((res) => {
                if (passwordHash.verify(ctx.params.password, res.data.password))
                    return this.requestSuccess("Valid Password", pick(res.data, Filters_Logins.encode));
                else
                    return this.requestError(CodeTypes.AUTH_INVALID_CREDENTIALS);
            })
            .catch((err) => {
                if (err instanceof MoleculerError)
                    return Promise.reject(err);
                else if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else {
                    this.logger.info(err);
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
                }
            });
    },

    //********************************** agent related api's start*******************************
    agent_login: async function(ctx) {

        if (ctx.params.socialtypeid == 1 && ctx.params.socialkey != "") {

            return googleAuth.getUser(ctx.params.socialkey)
                .then(response => {

                    var userDetails = {
                        username: response.id,
                        password: response.id,
                        firstname: response.name,
                        confirmpassword: response.id,
                        socialtypeid: ctx.params.socialtypeid,
                        email: response.email,
                    };

                    return ctx.call("agent.verifyUsername", { username: response.id, userDetails: userDetails })
                        .then((userId) => {
                            var user = {
                                id: userId,
                                username: response.id,
                                usertypeid: 2,
                                iat: 1596987716
                            };

                            return this.generateToken(user)
                                .then((res2) => {
                                    return Tokens.insert(ctx, {
                                            userId: userId,
                                            token: res2
                                        })
                                        .then(() => {
                                            ctx.meta.username = userDetails.email;
                                            ctx.meta.log = 'Successfully logged in with google';
                                            activity.setLog(ctx);
                                            var details = {
                                                name: "agent Login Success",
                                                data: res2,
                                                code: 200
                                            };
                                            return details;
                                        });
                                }).then(user => { return user; });
                        });
                }).catch((err) => {
                    ctx.meta.username = ctx.params.socialkey;
                    ctx.meta.log = 'Logged in with google failed';
                    activity.setLog(ctx);
                    if (err instanceof MoleculerError)
                        return Promise.reject(err);
                    else {
                        this.logger.info(err);
                        return this.requestError(CodeTypes.UNKOWN_ERROR);
                    }
                });
        } else if (ctx.params.socialtypeid == 2 && ctx.params.socialkey != "") {
            return facebookAuth.getUser(ctx.params.socialkey)
                .then(response => {

                    var user = {
                        id: 6,
                        username: response.id,
                        usertypeid: 2,
                        iat: 1596987716
                    };
                    return this.generateToken(user)
                        .then((res2) => {
                            return Tokens.insert(ctx, {
                                    userId: 100,
                                    token: res2
                                })
                                .then(() => {
                                    ctx.meta.username = user.username;
                                    ctx.meta.log = 'Successfully logged in with facebook';
                                    activity.setLog(ctx);
                                    var details = {
                                        name: "agent Login Success",
                                        data: res2,
                                        code: 200
                                    };
                                    return details;
                                });
                        }).then(user => { return user; });
                }).catch((err) => {
                    ctx.meta.username = ctx.params.socialkey;
                    ctx.meta.log = 'Logged in failed with facebook';
                    activity.setLog(ctx);
                    if (err instanceof MoleculerError)
                        return Promise.reject(err);
                    else {
                        this.logger.info(err);
                        return this.requestError(CodeTypes.UNKOWN_ERROR);
                    }
                });
        } else {

            return ctx.call("auth.agent_verifyPassword", { email: ctx.params.email, password: ctx.params.password })
                .then((res) => {
                    return this.generateToken(res.data)
                        .then((res2) => {
                            return Tokens.insert(ctx, {
                                    userId: res.data.id,
                                    login_type: "agency",
                                    token: res2
                                })
                                .then(_ => {
                                    let final_output = [];
                                    return agentfilt.findOne(ctx, {
                                            query: {
                                                id: res.data.id
                                            }
                                        })
                                        .then((res) => {
                                            ctx.meta.username = ctx.params.email;
                                            ctx.meta.log = 'Successfully logged in';
                                            activity.setLog(ctx);
                                            return agentlang.find(ctx, {
                                                query: {
                                                    agentid: res.data.id
                                                }
                                            }).then((resy) => {
                                                res.data['language'] = resy.data;
                                                final_output.push(res.data);
                                                return this.requestSuccess("Login Success", res2, final_output)
                                            });
                                        })
                                }).catch(err => {
                                    console.log(err);
                                });
                        })
                })
                .catch((err) => {
                    ctx.meta.username = ctx.params.email;
                    ctx.meta.log = 'Attempt logged in failed';
                    activity.setLog(ctx);
                    if (err instanceof MoleculerError) {
                        ctx.meta.log = 'Invalid Credentials';
                        activity.setLog(ctx);
                        return Promise.reject(err);
                    } else {
                        ctx.meta.log = CodeTypes.USERS_NOTHING_FOUND;
                        activity.setLog(ctx);
                        return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
                    }
                });
        }
    },
    agent_verifyPassword: function(ctx) {
        // let findUser = {};
        // findUser['email'] = ctx.params.email;
        // findUser['agentstatus'] = 1;
        // findUser['status'] = ctx.params.status ? ctx.params.status : {[Op.ne]: DELETE };
        return agent.findOne(ctx, {
            query: {
                [Op.or]: [
                    { email: ctx.params.email, },
                    { username: ctx.params.email },
                    { contactnumber: ctx.params.email}
                ],
                agentstatus: 1,
                status: 1,
                //status:  ctx.params.status ? ctx.params.status : {[Op.ne]: DELETE }
            }
            })
            .then((res) => {
                if(res.data.agentstatus !== 1){
                    return this.requestError(CodeTypes.AUTH_UNAPPROVED_TOKEN);
                }
                if (passwordHash.verify(ctx.params.password, res.data.password)) {
                    if (res.data.isverified) {
                        return this.requestSuccess("Valid Password", pick(res.data, Filters_Logins.encode));
                    } else if (res.data.isverified == 0) {
                        return this.requestError(CodeTypes.AUTH_UNAPPROVED_TOKEN);
                    } else if (res.data.isverified == 2) {
                        return this.requestError(CodeTypes.AUTH_REJECT_TOKEN);
                    }
                } else {
                    return this.requestError(CodeTypes.AUTH_INVALID_CREDENTIALS);
                }
            })
            .catch((err) => {
                if (err instanceof MoleculerError)
                    return Promise.reject(err);
                else if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else if (err.name === 'TypeError') {
                    return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
                } else {
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
                }
            })
            // return agent.findOne(ctx, {
            //         query: findUser
            //     })
            //     .then((res) => {
            //         if (res.data == undefined) {
            //             let findUser1 = {};
            //             findUser1['email'] = ctx.params.email;
            //             findUser1['status'] = ctx.params.status ? ctx.params.status : {
            //                 [Op.ne]: DELETE
            //             };
            //             return agent.findOne(ctx, {
            //                     query: findUser1,
            //                     filter: Filters_Logins.security
            //                 })
            //                 .then((res) => {
            //                     if (passwordHash.verify(ctx.params.password, res.data.password)) {
            //                         if (res.data.isverified == 1) {
            //                             return this.requestSuccess("Valid Password", pick(res.data, Filters_Logins.encode));
            //                         } else if (res.data.isverified == 0) {
            //                             return this.requestError(CodeTypes.AUTH_UNAPPROVED_TOKEN);
            //                         } else if (res.data.isverified == 2) {
            //                             return this.requestError(CodeTypes.AUTH_REJECT_TOKEN);
            //                         }
            //                     } else {
            //                         return this.requestError(CodeTypes.AUTH_INVALID_CREDENTIALS);
            //                     }
            //                 })
            //                 .catch((err) => {
            //                     if (err instanceof MoleculerError)
            //                         return Promise.reject(err);
            //                     else if (err.name === 'Nothing Found')
            //                         return this.requestError(CodeTypes.NOTHING_FOUND);
            //                     else if (err.name === 'TypeError') {
            //                         return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
            //                     } else {
            //                         return this.requestError(CodeTypes.UNKOWN_ERROR);
            //                     }
            //                 })
            //         } else {
            //             if (passwordHash.verify(ctx.params.password, res.data.password)) {
            //                 if (res.data.isverified == 1) {
            //                     return this.requestSuccess("Valid Password", pick(res.data, Filters_Logins.encode));
            //                 } else if (res.data.isverified == 0) {
            //                     return this.requestError(CodeTypes.AUTH_UNAPPROVED_TOKEN);
            //                 } else if (res.data.isverified == 2) {
            //                     return this.requestError(CodeTypes.AUTH_REJECT_TOKEN);
            //                 }
            //             } else {
            //                 return this.requestError(CodeTypes.AUTH_INVALID_CREDENTIALS);
            //             }
            //         }
            //     })
            //     .catch((err) => {
            //         if (err instanceof MoleculerError) {
            //             return Promise.reject(err);
            //         } else if (err.name === 'Nothing Found') {
            //             return this.requestError(CodeTypes.NOTHING_FOUND);
            //         } else if (err.name === 'TypeError') {
            //             return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
            //         } else {
            //             return this.requestError(CodeTypes.UNKOWN_ERROR);
            //         }
            //     });

    },

    // Reset Password for User with mail forward
    agent_resetPassword: function(ctx) {

        //Random password generation
        const str = Math.floor(100000 + Math.random() * 900000)
        const stmr = str.toString();
        const rande = stmr.split(".");
        return agent.find(ctx, {
                query: {
                    email: ctx.params.email
                }
            })
            .then((response) => {
                if (response.data) {
                    return this.generateHash(rande[0])
                        .then((res) => {
                            ctx.meta.username = ctx.params.email;
                                ctx.meta.log = 'Agency forgot password requested';
                                activity.setLog(ctx);
                                let readHTMLFile = function(path, callback) {
                                    fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            callback(null, html);
                                        }
                                    });
                                };
                                const verificationLink = `https://drivelounge.com/vendor/reset/${response.data[0].agentkey}`
                                readHTMLFile(mail_template + "/Requesttemplate_areset.html", function(err, html) {

                                    let template = handlebars.compile(html);
                                    let replacements = {
                                        username: `${response.data[0].firstname} ${response.data[0].lastname}`,
                                        link: verificationLink
                                    };
                                    const htmlToSend = template(replacements);

                                    ctx.call("mail.send", {
                                        to: ctx.params.email,
                                        subject: "Password Reset",
                                        html: htmlToSend
                                    }).then((res) => {
                                        return "Email sent successfully.";
                                    })
                                })
                                return "Password Resetted Please Check Email";
                        })
                } else
                    return this.requestError(CodeTypes.ALREADY_EXIST);
            }).catch((err) => {
                ctx.meta.username = ctx.params.email;
                ctx.meta.log = 'agent Password reset attempt failed';
                activity.setLog(ctx);
                if (err instanceof MoleculerError)
                    return Promise.reject(err);
                else
                    return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
            });
    },

    agent_reset: function(ctx) {
        return agent.find(ctx, {
                query: {
                    agentkey: ctx.params.key
                }
            })
            .then((response) => {
                if (response.data) {
                    return this.generateHash(ctx.params.password)
                        .then((res) => {
                            return agent.updateBy(ctx, 1, { password: res.data}, {
                                query: {
                                    id: response.data[0].id
                                }
                            }).then(result => {
                                ctx.meta.username = ctx.params.email;
                                ctx.meta.log = 'Agency new password request successfully';
                                activity.setLog(ctx);
                                let readHTMLFile = function(path, callback) {
                                    fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            callback(null, html);
                                        }
                                    });
                                };

                                readHTMLFile(mail_template + "/Requesttemplate_areset.html", function(err, html) {

                                    let template = handlebars.compile(html);
                                    let replacements = {
                                        username: response.data[0].email,
                                        password: ctx.params.password
                                    };
                                    const htmlToSend = template(replacements);

                                    ctx.call("mail.send", {
                                        to: response.data[0].email,
                                        subject: "Change Password",
                                        html: htmlToSend
                                    }).then((res) => {
                                        return "Email sent successfully.";
                                    })
                                })
                                return "Password Resetted Please Check Email";
                            })
                        })
                } else
                    return this.requestError(CodeTypes.ALREADY_EXIST);
            }).catch((err) => {
                ctx.meta.username = ctx.params.email;
                ctx.meta.log = 'agent Password reset attempt failed';
                activity.setLog(ctx);
                if (err instanceof MoleculerError)
                    return Promise.reject(err);
                else
                    return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
            });
    },

    verifyagent_change_Password: function(ctx) {
        return agent.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                if (passwordHash.verify(ctx.params.password, res.data.password))
                    return this.requestSuccess("Valid Password", pick(res.data, Filters_Logins.encode));
                else
                    return this.requestError(CodeTypes.AUTH_INVALID_CREDENTIALS);
            })
            .catch((err) => {
                if (err instanceof MoleculerError)
                    return Promise.reject(err);
                else if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else {
                    this.logger.info(err);
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
                }
            });
    },


    //********************************** agent related api's end*********************************

    // verifyToken: function(ctx) {
    //     return Tokens.findOne(ctx, {
    //         query: {
    //             token: ctx.params.token
    //         }
    //     })
    //     .then( (res) => {
    //         if(res.data.login_type === "administration") {
    //             return verify(ctx.params.token, JWT_SECRET).then((r) =>
    //         {
    //             return Admin.find(ctx, { query: {'id' : r.usertypeid} }).then((res) => {
    //                 return res.data[0].usertypeid;
    //             }).then((Role_id) =>{
    //                     return Role.find(ctx, { query: {'id': Role_id}})
    //                         .then((rolelist)=>{
    //                             let evalData = eval(JSON.stringify(rolelist.data[0].role_json));
    //                             evalData = evalData.replace('[','');
    //                             evalData = evalData.replace(']','');
    //                             res = evalData.replace("\'","'");

    //                             var result =0, found = [],rxp = /{([^}]+)}/g,curMatch;
    //                             var nameArr = ctx.params.url.split('/');
    //                             var method = nameArr[nameArr.length - 1];
    //                             var controller = nameArr[nameArr.length - 2];
    //                             var makeURL = controller+'/'+method;
    //                                 while( curMatch = rxp.exec( res ) ) {
    //                                     found.push( curMatch[1] );
    //                                     let obj = eval('({' + curMatch[1] + '})');
    //                                     if(makeURL == obj.id && obj.state == 1){
    //                                         result = 1;
    //                                         console.log('Authorized User and Role Allowed ' , makeURL);
    //                                     }
    //                                 }
    //                                 r.access = result;
    //                                 return r;

    //                         })
    //                             .catch( (err) => {
    //                                 console.log('err' , err);
    //                             if (err instanceof MoleculerError)
    //                                 return Promise.reject(err);
    //                             else
    //                                 return this.requestError(CodeTypes.UNKOWN_ERROR);
    //                         });
    //             })
    //             .catch( (err) => {
    //                 console.log('err' , err);
    //                 if (err instanceof MoleculerError)
    //                     return Promise.reject(err);
    //                 else
    //                     return this.requestError(CodeTypes.UNKOWN_ERROR);
    //             });
    //         })
    //         }
    //         else if((res.data.login_type === 'user') || (res.data.login_type === "agent")){
    //             return verify(ctx.params.token, JWT_SECRET)
    //         }


    //     })
    //     .catch( () => undefined );
    // },

    countSessions: function(ctx) {

        return this.verifyIfLogged(ctx)
            .then(() => Tokens.count(ctx, {
                userId: ctx.meta.user.id
            }))
            .then((res) => this.requestSuccess("Count Complete", res.data))
            .catch((err) => {
                if (err instanceof MoleculerError)
                    return Promise.reject(err);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },

    closeAllSessions: function(ctx) {

        return this.verifyIfLogged(ctx)
            .then(() => Tokens.removeMany(ctx, {
                userId: ctx.meta.user.id
            }))
            .then(() => this.requestSuccess("All existing sessions closed", true))
            .catch((err) => {
                if (err instanceof MoleculerError)
                    return Promise.reject(err);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },

    logout: function(ctx) {

        return this.verifyIfLogged(ctx)
            .then(() => Tokens.removeMany(ctx, {
                token: ctx.meta.user.token
            }))
            .then(() => this.requestSuccess("Logout Success", true))
            .catch((err) => {
                if (err instanceof MoleculerError)
                    return Promise.reject(err);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },

    get_language: function(ctx) {
        let findlang = {};
        findlang['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return Language.find(ctx, { query: findlang })
            .then((res) => {
                var arr = res.data;
                return this.requestSuccess("Languages", arr)
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },

    admin_profile: function(ctx) {

        return Adminfilt.updateBy(ctx, 1, {
                firstname: ctx.params.firstname,
                lastname: ctx.params.lastname,
                //usertypeid: ctx.params.usertypeid,
                email: ctx.params.email,
                //username: ctx.params.email
            }, {
                query: {
                    id: 2
                }
            })
            .then((res) => {
                return this.requestSuccess("Admin Updated", res.data);
            })
            .catch((err) => {
                return err;
            });
    }
}