"use strict";
const ConstantsMailTemplate = require("../../../plugin/constants-mail-template");
const dlMailer = require("../../../helpers/DLMailer");
const CodeTypes = require("./../../../fixtures/error.codes");
const Config = require("./../../../config");
const Constants = require("./../../../plugin/constants");
const Database = require("./../../../adapters/Database");
const { MoleculerError } = require("moleculer").Errors;
const activity = require("./../../../helpers/activitylog");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const Op = require("sequelize").Op;
const mail_template = __dirname;
const { map } = require("bluebird");
const path = require("path");
const fs = require("fs");
var glob = require("glob");
var annotations = require("annotations");
const otpGenerator = require("otp-generator");
const { Dagentlang } = require("./../../../fixtures/db_connection/models");
const Appconfig = new Database("Dappconfig");
const Sequ = require("sequelize");
const { QueryTypes } = require("sequelize");

let config = Config.get('/mssqlEnvironment');
const sequelize12 = new Sequ(config.database, config.username, config.password, {
  host: config.host,
    dialect: config.dialect,
  port: config.port,
  options: {
    encrypt: false,
  },
  dialectOptions: {
    options: {
      encrypt: false,
    },
  },
  instancename: "MSQLEXPRESS",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Filters applied when searching for entities
// Elements correspond to the columns of the table
const Filters_Users = {
  full: ["id", "username", "password", "usertypeid"],
  role: ["id", "usertypeid"],
  restricted: ["username"],
  unrestricted: ["username"],
};
const Filters_Tokens = {
  empty: ["id"],
};

const { DELETE, ACTIVE, INACTIVE, ADMIN_ROLE, USER_ROLE } = Constants;
const Roles = [ADMIN_ROLE, USER_ROLE];

//Models

const User = new Database("Duser");
const Agent = new Database("Dagent");
const Tokens = new Database("Dtoken");
const AgentLang = new Database("Dagentlang");
const Role = new Database("Drole");
const Language = new Database("Dlanguage");

let roles = {
  rolename: "Admin",
  role_json:
    "[{'id': 'admin/update','state': 1},    {'id': 'admin/remove','state': 1},    {'id': 'admin/getall','state': 1},    {status','state': 1},    {create','state': 1},    {'id': 'permission/create','state': 1},    {'id': 'permission/update','state': 1},    {'id': 'permission/remove','state': 1},    {'id': 'permission/getall','state': 1},    {'id': 'permission/status','state': 1},    {'id': 'role/create','state': 1},    {'id': 'role/update','state': 1},    {'id': 'role/remove','state': 1},    {'id': 'role/getall','state': 1},    {'id': 'role/get','state': 1},    {'id': 'role/status','state': 1},    {'id': 'auth/logout','state': 1},    {'id': 'auth/countSessions','state': 1},    {'id': 'auth/admin_profile','state': 1},    {'id': 'auth/vendor_list','state': 1},    {'id': 'auth/vendor_pending_list','state': 1},    {'id': 'auth/vendor_request','state': 1},    {'id': 'auth/closeAllSessions','state': 1},    {'id': 'auth/changepassword','state': 1},    {'id': 'login/get','state': 1},    {'id': 'login/changePassword','state': 1},    {'id': 'login/user_changePassword','state': 1},    {'id': 'login/agent_changePassword','state': 1},    {'id': 'newsletter/create','state': 1},    {'id': 'newsletter/update','state': 1},    {'id': 'newsletter/remove','state': 1},    {'id': 'newsletter/getall','state': 1},    {'id': 'newsletter/status','state': 1},    {'id': 'newsletter/get','state': 1},    {'id': 'common/create','state': 1},    {'id': 'common/getall','state': 1},    {'id': 'common/get','state': 1},    {'id': 'common/remove','state': 1},    {'id': 'common/getAll_discount','state': 1},    {'id': 'common/getAll_paymentmethod','state': 1},    {'id': 'common/get_discounttype','state': 1},    {'id': 'common/get_paymentmethod','state': 1},    {'id': 'common/dashboard_counts','state': 1},{'id': 'common/dashboard','state': 1},    {'id': 'common/getAll_aboutus','state': 1},    {'id': 'common/add_newsletter','state': 1},    {'id': 'common/smtp_create','state': 1},    {'id': 'common/smtp_getAll','state': 1},    {'id': 'common/smtp_get','state': 1},    {'id': 'common/smtp_update','state': 1},    {'id': 'common/smtp_remove','state': 1},    {'id': 'common/sms_create','state': 1},    {'id': 'common/sms_getAll','state': 1},    {'id': 'common/sms_get','state': 1},    {'id': 'common/sms_update','state': 1},    {'id': 'common/sms_remove','state': 1},    {'id': 'common/social_create','state': 1},    {'id': 'common/social_getAll','state': 1},    {'id': 'common/social_get','state': 1},    {'id': 'common/social_update','state': 1},    {'id': 'common/social_remove','state': 1},    {'id': 'common/our_offers','state': 1},    {'id': 'activitylog/remove','state': 1}    {'id': 'activitylog/getall','state': 1}, {'id': 'report/booking/getallcount', 'state' : 1}, {'id': 'area/create','state': 1},    {'id': 'area/update','state': 1},    {'id': 'area/remove','state': 1},    {'id': 'area/getall','state': 1},    {'id': 'area/status','state': 1},    {'id': 'area/get','state': 1},    {'id': 'booking/create','state': 1},    {'id': 'booking/update','state': 1},    {'id': 'booking/remove','state': 1},    {'id': 'booking/getall','state': 1},    {'id': 'booking/status','state': 1},    {'id': 'booking/getAll_user','state': 1},    {'id': 'booking/getAll_agent','state': 1},    {'id': 'booking/activity_log','state': 1},    {'id': 'booking/booking_status','state': 1},    {'id': 'booking/earnings','state': 1},    {'id': 'booking/get','state': 1},    {'id': 'bookingreport/getall','state': 1},    {'id': 'bookingreport/remove','state': 1},    {'id': 'bookingreport/getCounts','state': 1},    {'id': 'bookingreport/getAdminTurnOver','state': 1},{'id': 'bookingreport/gettotal','state': 1}, {'id': 'bookingreport/getVendorTurnOver','state': 1},    {'id': 'category/create','state': 1},    {'id': 'category/update','state': 1},    {'id': 'category/remove','state': 1},    {'id': 'category/getall','state': 1},    {'id': 'category/status','state': 1},    {'id': 'category/get','state': 1},    {'id': 'city/create','state': 1},    {'id': 'city/update','state': 1},    {'id': 'city/remove','state': 1},    {'id': 'city/getall','state': 1},    {'id': 'city/status','state': 1},    {'id': 'city/get','state': 1},    {'id': 'city/getAll_Web','state': 1},    {'id': 'contactus/create','state': 1},    {'id': 'contactus/update','state': 1},    {'id': 'contactus/remove','state': 1},    {'id': 'contactus/getall','state': 1},    {'id': 'contactus/status','state': 1},    {'id': 'contactus/get','state': 1},    {'id': 'country/create','state': 1},    {'id': 'country/update','state': 1},    {'id': 'country/remove','state': 1},    {'id': 'country/getall','state': 1},    {'id': 'country/status','state': 1},    {'id': 'country/get','state': 1},    {'id': 'agent/create','state': 1},    {'id': 'agent/update','state': 1},    {'id': 'agent/remove','state': 1},    {'id': 'agent/getall','state': 1},    {'id': 'agent/status','state': 1},    {'id': 'agent/get','state': 1},    {'id': 'agent/getAll_Web','state': 1},    {'id': 'agent/agentlist_category','state': 1},    {'id': 'agent/favagentcreate','state': 1},    {'id': 'agent/favagentuser','state': 1},    {'id': 'agent/otp_verify','state': 1},    {'id': 'agent/admin_update','state': 1},    {'id': 'agent/booking_count','state': 1},    {'id': 'agent/booking_report','state': 1},    {'id': 'agent/agent_voucher','state': 1},    {'id': 'agent/agent_timeupdate','state': 1},    {'id': 'agent/agent_timestatus','state': 1},    {'id': 'agent/agent_timeget','state': 1},    {'id': 'agent/agent_images','state': 1},    {'id': 'agent/agent_imgremove','state': 1},    {'id': 'agentstatus/create','state': 1},    {'id': 'agentstatus/update','state': 1},    {'id': 'agentstatus/remove','state': 1},    {'id': 'agentstatus/getall','state': 1},    {'id': 'agentstatus/status','state': 1},    {'id': 'agentstatus/get','state': 1},    {'id': 'package/create','state': 1},    {'id': 'package/update','state': 1},    {'id': 'package/remove','state': 1},    {'id': 'package/getall','state': 1},    {'id': 'package/status','state': 1},    {'id': 'package/get','state': 1},    {'id': 'package/admin_getAll','state': 1},    {'id': 'package/ourservice','state': 1},    {'id': 'package/ourservicecreate','state': 1},    {'id': 'pagemanagement/create','state': 1},    {'id': 'pagemanagement/update','state': 1},    {'id': 'pagemanagement/remove','state': 1},    {'id': 'pagemanagement/getall','state': 1},    {'id': 'pagemanagement/status','state': 1},    {'id': 'pagemanagement/get','state': 1},    {'id': 'pagemanagement/cmsstatus','state': 1},    {'id': 'pagemanagement/faqcreate','state': 1},    {'id': 'pagemanagement/faqgetAll','state': 1},    {'id': 'pagemanagement/faqstatus','state': 1},    {'id': 'pagemanagement/faqget','state': 1},    {'id': 'pagemanagement/faqupdate','state': 1},    {'id': 'pagemanagement/faqremove','state': 1},    {'id': 'review/create','state': 1},    {'id': 'review/update','state': 1},    {'id': 'review/remove','state': 1},    {'id': 'review/getall','state': 1},    {'id': 'review/status','state': 1},    {'id': 'review/get','state': 1},    {'id': 'review/admin_list','state': 1},    {'id': 'review/user_reviews','state': 1},    {'id': 'review/review_count','state': 1},    {'id': 'review/agent_reviews','state': 1},    {'id': 'review/review_approval','state': 1}, {'id': 'report/getall','state': 1}, {'id': 'turnover/gettotal','state': 1}, {'id': 'vendor/turnover','state': 1},   {'id': 'roleuser/create','state': 1},    {'id': 'roleuser/update','state': 1},    {'id': 'roleuser/remove','state': 1},    {'id': 'roleuser/getall','state': 1},    {'id': 'roleuser/get','state': 1},    {'id': 'roleuser/status','state': 1},    {'id': 'service/create','state': 1},    {'id': 'service/update','state': 1},    {'id': 'service/remove','state': 1},    {'id': 'service/getall','state': 1},    {'id': 'service/get','state': 1},    {'id': 'service/status','state': 1},    {'id': 'service/admin_getAll','state': 1},    {'id': 'service/ourservice','state': 1},    {'id': 'service/ourservicecreate','state': 1},    {'id': 'upload/create','state': 1},    {'id': 'user/create','state': 1},    {'id': 'user/update','state': 1},    {'id': 'user/remove','state': 1},    {'id': 'user/getall','state': 1},    {'id': 'user/status','state': 1},    {'id': 'user/get','state': 1}, {'id': 'user/otp_verify','state': 1},   {'id': 'user/admin_usrcreate',{'id': 'user/admin_user_create','state': 1},    {'id': 'user/otp_verify','state': 1},    {'id': 'voucher/create','state': 1},    {'id': 'voucher/update','state': 1},    {'id': 'voucher/remove','state': 1},    {'id': 'voucher/getall','state': 1},    {'id': 'voucher/status','state': 1},    {'id': 'voucher/get','state': 1},    {'id': 'voucher/coupon_get','state': 1},    {'id': 'voucher/voucher_code','state': 1},    {'id': 'voucher/getall_apptype','state': 1},    {'id': 'voucher/get_apptype','state': 1},    {'id': 'voucher/getall_vouchertype','state': 1},    {'id': 'voucher/get_vouchertype','state': 1},    {'id': 'module/create','state': 1},    {'id': 'module/update','state': 1},    {'id': 'module/remove','state': 1},    {'id': 'module/getall','state': 1},    {'id': 'module/status','state': 1},    {'id': 'module/get','state': 1}]",
};

let admins = {
  username: "admin@drivelounge.sa",
  password: "admin@drivelounge",
};
/**
 *
 * @annotation Login
 * @permission get,changePassword,user_changePassword,agent_changePassword,remove
 * @whitelist get
 */
module.exports = {
  create: function (ctx) {
    return User.findOne(ctx, {
      query: {
        [Op.or]: [
          { email: ctx.params.email },
          { contactnumber: ctx.params.contactnumber },
        ],
        usertypeid: 1,
        status: 1,
      },
    }).then((res) => {

      if (res.data.length == 0) {
        return this.generateHash(ctx.params.password)
          .then((res) =>
            User.insert(ctx, {
              username: ctx.params.username,
              password: res.data,
            })
          )
          .then(() =>
            this.requestSuccess("User Account Created", ctx.params.username)
          )
          .catch((err) => {
            if (err.name === "Database Error" && Array.isArray(err.data)) {
              if (
                err.data[0].type === "unique" &&
                err.data[0].field === "username"
              )
                return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
            }

            return this.requestError(CodeTypes.UNKOWN_ERROR);
          });
      } else {
        return this.requestError(CodeTypes.ALREADY_EXIST, res.data);
      }
    });
  },

  user_create: async function (ctx) {
    var otp = otpGenerator.generate(4, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });
    return await sequelize12
      .query("EXEC sp_checkUserAlreadyExist @email=:email,@contact=:contact", {
        replacements: {
          email: ctx.params.email,
          contact: ctx.params.contactnumber,
        },
        type: Sequ.QueryTypes.SELECT,
      })
      .then((res) => {
        if (res.length == 0) {
          return this.generateHash(ctx.params.password)
            .then((res) => {
              return User.findOne(ctx, {
                query: {
                  [Op.or]: [
                    { email: ctx.params.email },
                    { contactnumber: ctx.params.contactnumber },
                  ],
                },
              }).then((find) => {
                if (find.data !== undefined) {
                  return User.removeById(ctx, find.data.id).then((del) => {
                    return User.insert(ctx, {
                      firstname: ctx.params.firstname,
                      lastname: ctx.params.lastname,
                      username: ctx.params.username,
                      password: res.data,
                      email: ctx.params.email,
                      contactnumber: ctx.params.contactnumber,
                      countryid: ctx.params.countryid,
                      cityid: ctx.params.areaid,
                      otp: otp,
                      drivinglicense: ctx.params.drivinglicense,
                      usertypeid: ctx.params.usertypeid,
                      roleid: ctx.params.roleid,
                      panel: ctx.params.panel,
                    });
                  });
                } else {
                  return User.insert(ctx, {
                    firstname: ctx.params.firstname,
                    lastname: ctx.params.lastname,
                    username: ctx.params.username,
                    password: res.data,
                    email: ctx.params.email,
                    contactnumber: ctx.params.contactnumber,
                    countryid: ctx.params.countryid,
                    cityid: ctx.params.areaid,
                    otp: otp,
                    drivinglicense: ctx.params.drivinglicense,
                    usertypeid: ctx.params.usertypeid,
                    roleid: ctx.params.roleid,
                    panel: ctx.params.panel,
                  });
                }
              });
            })
            .then((response) => {


              let replacements = {
                name: `${ctx.params.firstname} ${ctx.params.lastname}`,
                otp: otp,
                subject: ConstantsMailTemplate.UserUserOTPSubject,
              };
              dlMailer.sendMail(ctx, ConstantsMailTemplate.UserUserOTP, ctx.params.email, replacements);

              /*
              let readHTMLFile = function (path, callback) {
                fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
                  if (err) {
                    throw err;
                  } else {
                    callback(null, html);
                  }
                });
              };
              //Reads the html template,body of the mail content
              readHTMLFile(
                mail_template + "/UsertemplateOTP.html",
                function (err, html) {
                  let template = handlebars.compile(html);
                  let replacements = {
                    name: ctx.params.username,
                    username: ctx.params.email,
                    otp: otp,
                    message12: "User Created Successfully ",
                  };
                  const htmlToSend = template(replacements);
                  // this method call the mail service to send mail
                  ctx
                    .call("mail.send", {
                      to: ctx.params.email,
                      subject: "OTP for verification",
                      html: htmlToSend,
                    })
                    .then((res) => {
                      return "Email sent successfully.";
                    });
                }
              );
              */

              return this.requestSuccess(
                "User Created successfully",
                ctx.params.email
              );
            })
            .catch((err) => {
              console.log(err);
              if (err.name === "Database Error" && Array.isArray(err.data)) {
                if (
                  err.data[0].type === "unique" &&
                  err.data[0].field === "username"
                )
                  return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
              }

              return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
        } else {
          return this.requestError(CodeTypes.ALREADY_EXIST);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.name === "Database Error" && Array.isArray(err.data)) {
          if (err.data[0].type === "unique" && err.data[0].field === "username")
            return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
        } else if (err instanceof MoleculerError) return Promise.reject(err);
        else if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else return this.requestError(CodeTypes.UNKOWN_ERROR);
      });
  },

  admin_create: async function (ctx) {
    var otp = otpGenerator.generate(4, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });
    return await sequelize12
      .query("EXEC sp_checkUserAlreadyExist @email=:email,@contact=:contact", {
        replacements: {
          email: ctx.params.email,
          contact: ctx.params.contactnumber,
        },
        type: Sequ.QueryTypes.SELECT,
      })
      .then((res) => {
        if (res.length == 0) {
          return this.generateHash(ctx.params.password)
            .then((res) => {
              return User.insert(ctx, {
                firstname: ctx.params.firstname,
                lastname: ctx.params.lastname,
                username: ctx.params.username,
                password: res.data,
                email: ctx.params.email,
                contactnumber: ctx.params.contactnumber,
                otp: otp,
                drivinglicense: ctx.params.drivinglicense,
                usertypeid: 1,
                roleid: ctx.params.roleid,
                panel: "Admin",
              });
            })
            .then((response) => {


              let replacements = {
                name: `${ctx.params.firstname} ${ctx.params.lastname}`,
                otp: otp,
                subject: ConstantsMailTemplate.UserUserOTPSubject,
              };
              dlMailer.sendMail(ctx, ConstantsMailTemplate.UserUserOTP, ctx.params.email, replacements);


              /*
              let readHTMLFile = function (path, callback) {
                fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
                  if (err) {
                    throw err;
                  } else {
                    callback(null, html);
                  }
                });
              };
              //Reads the html template,body of the mail content
              readHTMLFile(
                mail_template + "/Usertemplate.html",
                function (err, html) {
                  let template = handlebars.compile(html);
                  let replacements = {
                    name: ctx.params.username,
                    username: ctx.params.email,
                    password: ctx.params.password,
                    message12: "User Created Successfully ",
                  };
                  const htmlToSend = template(replacements);
                  // this method call the mail service to send mail
                  ctx
                    .call("mail.send", {
                      to: ctx.params.email,
                      subject: "User Login Details",
                      html: htmlToSend,
                    })
                    .then((res) => {
                      return "Email sent successfully.";
                    });
                }
              );
              */

              return User.find(ctx, {
                query: { usertypeid: 1, status: 1 },
              }).then((res) => {
                return this.requestSuccess("User Created", res.data);
              });
            })
            .catch((err) => {
              console.log(err);
              if (err.name === "Database Error" && Array.isArray(err.data)) {
                if (
                  err.data[0].type === "unique" &&
                  err.data[0].field === "username"
                )
                  return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
              }

              return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
        } else {
          return this.requestError(CodeTypes.ALREADY_EXIST);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.name === "Database Error" && Array.isArray(err.data)) {
          if (err.data[0].type === "unique" && err.data[0].field === "username")
            return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
        } else if (err instanceof MoleculerError) return Promise.reject(err);
        else if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else return this.requestError(CodeTypes.UNKOWN_ERROR);
      });
  },

  admin_update: function (ctx) {
    return this.generateHash(ctx.params.password).then((res) => {
      return User.updateBy(
        ctx,
        ctx.params.id,
        {
          firstname: ctx.params.firstname,
          lastname: ctx.params.lastname,
          username: ctx.params.username,
          password: res.data,
          email: ctx.params.email,
          contactnumber: ctx.params.contactnumber,
          roleid: ctx.params.roleid,
          status: ctx.params.status,
        },
        {
          query: {
            id: ctx.params.id,
          },
        }
      )
        .then((_) => {
          return User.find(ctx, { query: { usertypeid: 1, status: 1 } }).then(
            (res) => {
              return this.requestSuccess("Admin updated", res.data);
            }
          );
        })
        .catch((err) => {
          if (err.name === "Database Error" && Array.isArray(err.data)) {
            if (
              err.data[0].type === "unique" &&
              err.data[0].field === "username"
            )
              return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
          }

          return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    });
  },

  admin_remove: function (ctx) {
    return User.updateBy(
      ctx,
      ctx.params.id,
      {
        status: 2,
      },
      {
        query: {
          id: ctx.params.id,
        },
      }
    )
      .then((_) => {
        return User.find(ctx, { query: { usertypeid: 1, status: 1 } }).then(
          (res) => {
            return this.requestSuccess("Admin updated", res.data);
          }
        );
      })
      .catch((err) => {
        console.log(err);
        if (err.name === "Database Error" && Array.isArray(err.data)) {
          if (err.data[0].type === "unique" && err.data[0].field === "username")
            return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
        }

        return this.requestError(CodeTypes.UNKOWN_ERROR);
      });
  },

  admin_user_create: async function (ctx) {
    var otp = otpGenerator.generate(4, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });

    return await sequelize12
      .query("EXEC sp_checkUserAlreadyExist @email=:email,@contact=:contact", {
        replacements: {
          email: ctx.params.email,
          contact: ctx.params.contactnumber,
        },
        type: Sequ.QueryTypes.SELECT,
      })
      .then((res) => {
        if (res.length == 0) {
          return this.generateHash(ctx.params.password).then((res) => {
            return User.insert(ctx, {
              firstname: ctx.params.firstname,
              lastname: ctx.params.lastname,
              username: ctx.params.email,
              password: res.data,
              email: ctx.params.email,
              contactnumber: ctx.params.contactnumber,
              countryid: ctx.params.countryid,
              cityid: ctx.params.areaid,
              usertypeid: ctx.params.usertypeid,
              otp: otp,
              isverified: true,
              drivinglicense: ctx.params.drivinglicense,
              usertypeid: ctx.params.usertypeid,
              panel: ctx.params.panel,
              userstatus: ctx.params.status,
            })
              .then(async (response) => {

              let replacements = {
                name: `${ctx.params.firstname} ${ctx.params.lastname}`,
                otp: otp,
                subject: ConstantsMailTemplate.UserUserOTPSubject,
              };
              dlMailer.sendMail(ctx, ConstantsMailTemplate.UserUserOTP, ctx.params.email, replacements);

              /*
                let readHTMLFile = function (path, callback) {
                  fs.readFile(
                    path,
                    { encoding: "utf-8" },
                    function (err, html) {
                      if (err) {
                        throw err;
                      } else {
                        callback(null, html);
                      }
                    }
                  );
                };
                //Reads the html template,body of the mail content
                readHTMLFile(
                  mail_template + "/Usertemplate.html",
                  function (err, html) {
                    let template = handlebars.compile(html);
                    let replacements = {
                      name: ctx.params.username,
                      username: ctx.params.email,
                      password: ctx.params.password,
                      message12: "User Created Successfully ",
                    };
                    const htmlToSend = template(replacements);
                    // this method call the mail service to send mail
                    ctx
                      .call("mail.send", {
                        to: ctx.params.email,
                        subject: "User Login Details",
                        html: htmlToSend,
                      })
                      .then(async (res) => {
                        // return "Email sent successfully.";
                      })
                      .catch((err) => {
                        console.log(err);
                        if (err.name === "Nothing Found")
                          return this.requestError(CodeTypes.NOTHING_FOUND);
                        else return this.requestError(err);
                      });
                  }
                );
                */


                return await sequelize12
                  .query("EXEC sp_getCustomerDetails @status=:status", {
                    replacements: { status: 1 },
                    type: Sequ.QueryTypes.SELECT,
                  })
                  .then((resdata) => {
                    return this.requestSuccess(
                      "Email sent successfully",
                      resdata
                    );
                  });
              })
              .catch((err) => {
                console.log(err);
                if (err.name === "Database Error" && Array.isArray(err.data)) {
                  if (
                    err.data[0].type === "unique" &&
                    err.data[0].field === "username"
                  )
                    return this.requestError(
                      CodeTypes.USERS_USERNAME_CONSTRAINT
                    );
                }
                return this.requestError(CodeTypes.UNKOWN_ERROR);
              });
          });
        } else {
          return this.requestError(CodeTypes.ALREADY_EXIST);
        }
      })
      .catch((err) => {
        if (err.name === "Database Error" && Array.isArray(err.data)) {
          if (err.data[0].type === "unique" && err.data[0].field === "username")
            return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
        }
        return this.requestError(CodeTypes.ALREADY_EXIST);
      });
  },

  admin_user_update: async function (ctx) {
    var otp = otpGenerator.generate(4, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });

    return User.updateBy(
      ctx,
      ctx.params.id,
      {
        firstname: ctx.params.firstname,
        lastname: ctx.params.lastname,
        username: ctx.params.username,
        email: ctx.params.email,
        contactnumber: ctx.params.contactnumber,
        userstatus: ctx.params.status,
      },
      { query: { id: ctx.params.id } }
    )
      .then(async (response) => {
        return await sequelize12
          .query("EXEC sp_getCustomerDetails @status=:status", {
            replacements: { status: 1 },
            type: Sequ.QueryTypes.SELECT,
          })
          .then((res) => {
            return this.requestSuccess("Email sent successfully", res);
          })
          .catch((err) => {
            console.log(err);
            if (err.name === "Nothing Found")
              return this.requestError(CodeTypes.NOTHING_FOUND);
            else return this.requestError(err);
          });
      })
      .catch((err) => {
        console.log(err);
        if (err.name === "Database Error" && Array.isArray(err.data)) {
          if (err.data[0].type === "unique" && err.data[0].field === "username")
            return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
        }
        return this.requestError(CodeTypes.UNKOWN_ERROR);
      });
  },

  otp_verify: function (ctx) {
    return User.findOne(ctx, {
      query: { email: ctx.params.email, usertypeid: 3 },
    })
      .then((res) => {
        if (ctx.params.otp.localeCompare(res.data.otp) == 0) {
          console.log("password");
          return sequelize12
            .query(`update duser set isverified=1 where id = ${res.data.id}`)
            .then((resp) => {

              let replacements = {
                name: `${res.data.firstname} ${res.data.lastname}`,
                username: ctx.params.email,
                subject: ConstantsMailTemplate.UserUserRegistrationSubject,
              };
              dlMailer.sendMail(ctx, ConstantsMailTemplate.UserUserRegistration, ctx.params.email, replacements);

              replacements = {
                username: ctx.params.email,
                email: ctx.params.email,
                name: `${res.data.firstname} ${res.data.lastname}`,
                subject: ConstantsMailTemplate.AdminUserRegistrationSubject,
              };
              dlMailer.sendMail(ctx, ConstantsMailTemplate.AdminUserRegistration, Constants.AdminMailId, replacements);

              /*
              let readHTMLFile = function (path, callback) {
                fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
                  if (err) {
                    throw err;
                  } else {
                    callback(null, html);
                  }
                });
              };
              //Reads the html template,body of the mail content
              readHTMLFile(
                mail_template + "/Userlogincredentialstemplate.html",
                function (err, html) {
                  let template = handlebars.compile(html);
                  let replacements = {
                    name: resp.firstname + " " + resp.lastname,
                    username: ctx.params.email,
                    password: ctx.params.password,
                    message12: "Find your login credentials.",
                  };
                  const htmlToSend = template(replacements);
                  // this method call the mail service to send mail
                  ctx
                    .call("mail.send", {
                      to: ctx.params.email,
                      subject: "Login Credentials",
                      html: htmlToSend,
                    })
                    .then((res) => {
                      return "Email sent successfully.";
                    });
                }
              );
              */

              /*
              //Reads the html template,body of the mail content - send it to Admin when user confirms their mail id
              readHTMLFile(
                mail_template + "/NewUserTemplate.html",
                function (err, html) {
                  let template = handlebars.compile(html);
                  let replacements = {
                    name: resp.firstname + " " + resp.lastname,
                    username: ctx.params.email,
                    message12: "Find your login credentials.",
                  };
                  const htmlToSend = template(replacements);
                  // this method call the mail service to send mail
                  ctx
                    .call("mail.send", {
                      to: ctx.params.email,
                      subject: "Login Credentials",
                      html: htmlToSend,
                    })
                    .then((res) => {
                      return "Email sent successfully.";
                    });
                }
              );
              */

              /*
              //Reads the html template,body of the mail content - send it to Admin when user confirms their mail id
              readHTMLFile(
                mail_template + "/AdminNewUser.html",
                function (err, html) {
                  let template = handlebars.compile(html);
                  let replacements = {
                    name: resp.firstname + " " + resp.lastname,
                    username: ctx.params.username,
                    email: ctx.params.email,
                    message12: "Find your login credentials.",
                  };
                  const htmlToSend = template(replacements);
                  // this method call the mail service to send mail
                  ctx
                    .call("mail.send", {
                      to: ctx.params.email,
                      subject: "Login Credentials",
                      html: htmlToSend,
                    })
                    .then((res) => {
                      return "Email sent successfully.";
                    });
                }
              );
              */

              return this.requestSuccess(
                "User logged successfully",
                ctx.params.email
              );
            });
        } else {
          return this.requestError(CodeTypes.NOTHING_FOUND);
        }
      })
      .catch((err) => {
        if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else if (err instanceof MoleculerError) return Promise.reject(err);
        else return this.requestError(err);
      });
  },

  getAll: function (ctx) {
    return User.find(ctx, { query: { usertypeid: 1, status: 1 } })
      .then((res) => {
        return this.requestSuccess("Search Complete", res.data);
      })
      .catch((err) => {
        if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else return this.requestError(CodeTypes.UNKOWN_ERROR);
      });
  },

  //To get the list list of functions in all controller files for role access(permission for administrators)
  //mohancv (28-12-2023)
  get: function (ctx) {
    var Output = [];
    var out = [];
    var FinalOut = [];
    var dirLink = __dirname;
    var final = [];
    var dirLink2 = path.join(__dirname, "/../../admin/controllers/");
    return dirDetails(dirLink)
      .then((res) => {
        return dirDetails(dirLink2).then((out2) => {
          out.push(res);
          out.push(out2);
          return this.requestSuccess("List of Role", out);
        });
      })
      .then((r) => {
        let total_array = r.data;
        const get_AnnnotationDetails = async (x, link) => {
          return path.extname(link + "/" + x) == ".js"
            ? annotations.get(link + "/" + x).then((res) => {
                if (!isEmpty(res) && res != null && !isEmpty(res.module)) {
                  var json = {
                    id: res.module.annotation,
                    list: res.module.permission,
                  };
                  Output.push(json);
                }
                return Output;
              })
            : "";
        };
        async function get_AnnnotationLists(annList, link) {
          for (var i = 0; i < annList.length; i++) {
            let language_val_filter = await get_AnnnotationDetails(
              annList[i],
              link
            ).then((annoDetail) => {
              return annoDetail;
            });
          }
        }

        const vali = get_AnnnotationLists(total_array[0], dirLink);
        return vali.then((resy) => {
          return get_AnnnotationLists(total_array[1], dirLink2).then(
            (resy1) => {
              return Output;
            }
          );
        });
      })
      .then((r1) => {
        return this.requestSuccess("List of Roles", Output);
      })
      .catch((Err) => {
        return Err;
      });
  },

  count: function (ctx) {
    return Login.count(ctx, {})
      .then((res) => this.requestSuccess("Count Complete", res.data))
      .catch((err) => this.requestError(CodeTypes.UNKOWN_ERROR));
  },

  changeEmail: function (ctx) {
    var otp = otpGenerator.generate(4, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });

    return User.find(ctx, { query: { id: ctx.params.id, status: 1 } })
      .then((res) => {
        if (res.data) {
          return User.find(ctx, {
            query: {
              [Op.or]: [
                { email: ctx.params.email },
                { contactnumber: ctx.params.contactnumber },
              ],
              id: {
                [Op.ne]: ctx.params.id,
              },
              status: 1,
            },
          }).then((resUser) => {
            if (resUser.data.length == 0) {
              return User.updateBy(
                ctx,
                ctx.params.id,
                {
                  otp: otp
                },
                {
                  query: { id: ctx.params.id },
                }
              ).then((response) => {

                let replacements = {
                  name: `${res.data[0].firstname} ${res.data[0].lastname}`,
                  otp: otp,
                  subject: ConstantsMailTemplate.UserUserOTPSubject,
                };
                dlMailer.sendMail(ctx, ConstantsMailTemplate.UserUserOTP, ctx.params.email, replacements);
                
                return this.requestSuccess(CodeTypes.CHECK_MAIL_FOR_OTP);
              });
            } else {
              return this.requestError(CodeTypes.ALREADY_EXIST_EMAIL_OR_MOBILE_NUMBER, res.data);
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.name === "Database Error" && Array.isArray(err.data)) {
          if (err.data[0].type === "unique" && err.data[0].field === "username")
            return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
        } else if (err instanceof MoleculerError) return Promise.reject(err);
        else if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else return this.requestError(CodeTypes.UNKOWN_ERROR);
      });
  },

  changeInfo: function (ctx) {
    return User.find(ctx, { query: { id: ctx.params.id, status: 1 } })
      .then((res) => {
        if (res.data) {
          return User.find(ctx, {
            query: {
              [Op.or]: [
                { email: ctx.params.email },
                { contactnumber: ctx.params.contactnumber },
              ],
              id: {
                [Op.ne]: ctx.params.id,
              },
              status: 1,
            },
          }).then((resUser) => {
            if (resUser.data.length == 0) {
              if(res.data.email != ctx.params.email && res.data.id == ctx.params.id) {
                return User.find(ctx, {
                  query: {
                    id: ctx.params.id, 
                    otp: ctx.params.otp,
                    status: 1,
                  },
                }).then((resUserOtp) => {
                  if (resUserOtp.data != null && resUserOtp.data.length > 0) {

                    return User.updateById(ctx, ctx.params.id, {
                      firstname: ctx.params.firstname,
                      lastname: ctx.params.lastname,
                      email: ctx.params.email,
                      username: ctx.params.email,
                      contactnumber: ctx.params.contactnumber,
                      address: ctx.params.address || "",
                    }).then((updatedUserDetails) => {
                      
                      ctx.meta.log = "Updated Successfully";
                      activity.setLog(ctx);
                      return this.requestSuccess(CodeTypes.UPDATED_SUCCESSFULLY, updatedUserDetails.data[0]);
                    });
                  } else {
                    return this.requestError(CodeTypes.INVALID_OTP);
                  }
                });
              } else {
                return User.updateById(ctx, ctx.params.id, {
                  firstname: ctx.params.firstname,
                  lastname: ctx.params.lastname,
                  email: ctx.params.email,
                  username: ctx.params.email,
                  contactnumber: ctx.params.contactnumber,
                  address: ctx.params.address || "",
                }).then((updatedUserDetails) => {
                  
                  ctx.meta.log = "Updated Successfully";
                  activity.setLog(ctx);
                  return this.requestSuccess(CodeTypes.UPDATED_SUCCESSFULLY, updatedUserDetails.data[0]);
                });
              }
            } else {
              return this.requestError(CodeTypes.ALREADY_EXIST_EMAIL_OR_MOBILE_NUMBER, res.data[0]);
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.name === "Database Error" && Array.isArray(err.data)) {
          if (err.data[0].type === "unique" && err.data[0].field === "username")
            return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
        } else if (err instanceof MoleculerError) return Promise.reject(err);
        else if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else return this.requestError(CodeTypes.UNKOWN_ERROR);
      });
    // return this.verifyIfLogged(ctx)
    //     .then(() => Login.updateById(ctx, ctx.meta.login.id, {
    //         age: ctx.params.age
    //     }))
    //     .then((res) => this.requestSuccess("Changes Saved", true))
    //     .catch((err) => this.requestError(CodeTypes.UNKOWN_ERROR));
  },

  changePassword: function (ctx) {
    activity.getUser(ctx, ctx.params.usertypeid).then((res) => {
      ctx.meta.username = res.data.username;
    });
    return (
      this.verifyIfLogged(ctx)
        .then(() =>
          // ctx.call("auth.verify_change_Password", { id: ctx.params.id, password: ctx.params.oldpassword, newpassword: ctx.params.newpassword }))
          // .then(() =>
          this.generateHash(ctx.params.newpassword)
        )
        .then((res) => {
          if (
            ctx.params.newpassword.localeCompare(ctx.params.confirmpassword) ==
            0
          ) {
            User.updateById(ctx, ctx.params.id, {
              password: res.data,
            });
            ctx.meta.log = "Password changed";
            activity.setLog(ctx);
          } else {
            ctx.meta.log = "Invalid old password";
            activity.setLog(ctx);
            return this.requestError(CodeTypes.USERS_PASSWORD_MATCH);
          }
        })
        // .then( () => ctx.call("auth.closeAllSessions"))
        .then(() => this.requestSuccess("Changes Saved", true))
        .catch((err) => {
          if (err instanceof MoleculerError) {
            ctx.meta.log = "Invalid change password data";
            activity.setLog(ctx);
            return Promise.reject(err);
          } else {
            ctx.meta.log = "Database error";
            activity.setLog(ctx);
            return this.requestError(CodeTypes.UNKOWN_ERROR);
          }
        })
    );
  },

  user_changePassword: function (ctx) {
    // activity.getAgentUser(ctx,ctx.params.id).then((res) =>{
    // 	ctx.meta.username = res.data.email;
    // 	// console.log(activityData);
    // });
    return (
      this.verifyIfLogged(ctx)
        .then(() =>
          ctx.call("auth.verifyuser_change_Password", {
            id: ctx.params.id,
            password: ctx.params.oldpassword,
            newpassword: ctx.params.newpassword,
          })
        )
        .then(() => this.generateHash(ctx.params.newpassword))
        .then((res) => {
          if (
            ctx.params.newpassword.localeCompare(ctx.params.confirmpassword) ==
            0
          ) {
            User.updateById(ctx, ctx.meta.user.id, {
              password: res.data,
            });
            ctx.meta.log = "Password changed";
            activity.setLog(ctx);
          } else {
            ctx.meta.log = "Invalid old password";
            activity.setLog(ctx);
            return this.requestError(CodeTypes.USERS_PASSWORD_MATCH);
          }
        })
        //.then( () => ctx.call("auth.closeAllSessions"))
        .then(() => this.requestSuccess("Changes Saved", true))
        .catch((err) => {
          ctx.meta.log = "Attepmt to change password failed";
          activity.setLog(ctx);
          if (err instanceof MoleculerError) return Promise.reject(err);
          else return this.requestError(CodeTypes.UNKOWN_ERROR);
        })
    );
  },

  getuserbyid: function (ctx) {
    return User.find(ctx, {
      query: { id: ctx.params.id, usertypeid: ctx.params.usertypeid },
    })
      .then((res) => {
        return this.requestSuccess("User profile", res.data);
      })
      .catch((err) => {
        ctx.meta.log = "Attepmt to get user profile";
        activity.setLog(ctx);
        if (err instanceof MoleculerError) return Promise.reject(err);
        else return this.requestError(CodeTypes.UNKOWN_ERROR);
      });
  },

  agent_create: function (ctx) {
    var otp = otpGenerator.generate(4, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });
    return Agent.find(ctx, {
      query: {
        [Op.or]: [
          { email: ctx.params.email },
          { contactnumber: ctx.params.contactnumber },
        ],
        status: 1,
      },
    }).then((res) => {
      if (res.data.length == 0) {
        return this.generateHash(ctx.params.password)
          .then((res_) => {
            return Agent.insert(ctx, {
              firstname: ctx.params.firstname,
              lastname: ctx.params.lastname,
              username: ctx.params.username,
              agencyname: ctx.params.agencyname,
              email: ctx.params.email,
              password: res_.data,
              countryid: 1,
              cityid: 1,
              contactnumber: ctx.params.contactnumber,
              agentstatus: 3,
              usertypeid: 2,
              socialtypeid: 3,
              isfeatured: 0,
              otp: otp,
              photopath: ctx.params.photopath,
              vatnumber: ctx.params.vatnumber,
              vat: ctx.params.vat,
              vatdocs: ctx.params.vatdocument,
              crnumber: ctx.params.crnumber,
              crdocs: ctx.params.crdocument,
              vatstatus:
                ctx.params.vatstatus !== undefined ? ctx.params.vatstatus : 1,
              servicelocation: ctx.params.servicelocation,
              address: ctx.params.address,
              latitude: ctx.params.lat,
              longitude: ctx.params.lng,
              isverified: 0,
            })
              .then((response) => {
                AgentLang.insert(ctx, {
                  languageid: ctx.params.subLang,
                  langshortname: ctx.params.subLang == 1 ? "en" : "ar",
                  agentid: response.data.id,
                  agentname: ctx.params.agencyname,
                })
                  .then(async (res) => {
                    const config = await Appconfig.find(ctx, {
                      query: { status: 1 },
                    }).then((res) => {
                      return res.data;
                    });

                    let replacements = {
                      agency_name: ctx.params.agencyname || ctx.params.email,
                      subject: ConstantsMailTemplate.AgencyAgencyRegistrationSubject, 
                    };

                    dlMailer.sendMail(ctx, ConstantsMailTemplate.AgencyAgencyRegistration, ctx.params.email, replacements);

                    replacements = {
                      agency_name: ctx.params.agencyname || ctx.params.email,
                      subject: ConstantsMailTemplate.AdminAgencyRegistrationSubject, 
                    };

                    dlMailer.sendMail(ctx, ConstantsMailTemplate.AdminAgencyRegistration, Constants.AdminMailId, replacements);

                    /*
                    let readHTMLFile = function (path, callback) {
                      fs.readFile(
                        path,
                        { encoding: "utf-8" },
                        function (err, html) {
                          if (err) {
                            throw err;
                          } else {
                            callback(null, html);
                          }
                        }
                      );
                    };

                    readHTMLFile(
                      mail_template + "/Requesttemplate_aregister.html",
                      function (err, html) {
                        let template = handlebars.compile(html);
                        let replacements = {
                          username: ctx.params.agencyname || ctx.params.email,
                          password: ctx.params.password,
                        };
                        const htmlToSend = template(replacements);

                        ctx
                          .call("mail.send", {
                            to: ctx.params.email,
                            subject: "Registration of Agency",
                            html: htmlToSend,
                          })
                          .then((res) => {
                            // return "Email sent successfully.";
                          });
                      }
                    );

                    readHTMLFile(
                      mail_template + "/AdminNotification.html",
                      function (err, html) {
                        let template = handlebars.compile(html);
                        let replacements = {
                          heading: "New Application",
                          agencyname: ctx.params.agencyname,
                        };
                        const htmlToSendAdmin = template(replacements);

                        ctx
                          .call("mail.send", {
                            to: config[0].email,
                            subject: "Registration of New Agency",
                            html: htmlToSendAdmin,
                          })
                          .then((res) => {
                            //return "Email sent successfully.";
                          });
                      }
                    );

                    */

                  })
                  .catch((err) => {
                    console.log(err);
                  });

                return this.requestSuccess("Agent Created", res_);
              })
              .catch((err) => {
                console.log(err);
              });
          })

          .catch((err) => {
            console.log(err);
            if (err.name === "Database Error" && Array.isArray(err.data)) {
              if (
                err.data[0].type === "unique" &&
                err.data[0].field === "username"
              )
                return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
            }

            return this.requestError(CodeTypes.UNKOWN_ERROR);
          });
      } else {
        return this.requestError(CodeTypes.ALREADY_EXIST_EMAIL_OR_MOBILE_NUMBER);
      }
    });
  },

  agent_create_admin: function (ctx) {
    var otp = otpGenerator.generate(4, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });
    return Agent.find(ctx, {
      query: {
        [Op.or]: [
          { email: ctx.params.email },
          { contactnumber: ctx.params.contactnumber },
        ],
        status: 1,
      },
    }).then((res) => {
      if (res.data.length == 0) {
        return this.generateHash(ctx.params.password)
          .then((res_) => {
            return Agent.insert(ctx, {
              isfeatured: 1,
              firstname: ctx.params.firstname,
              lastname: ctx.params.lastname,
              username: ctx.params.username,
              email: ctx.params.email,
              password: res_.data,
              latitude: ctx.params.latitude,
              longitude: ctx.params.longitude,
              countryid: 1,
              cityid: 1,
              areaid: 1,
              commissiontype: ctx.params.commissiontype,
              commissionvalue: ctx.params.commissionvalue,
              contactnumber: ctx.params.contactnumber,
              crnumber: ctx.params.crnumber,
              sortorder: ctx.params.sortorder,
              vat: ctx.params.vat,
              vatnumber: ctx.params.vatnumber,
              vatdocs: ctx.params.vatdocument,
              agentstatus: 1, // when admin created the agency on behalf agent it should be approved by default
              servicelocation: ctx.params.servicelocation,
              address: ctx.params.address,
              paymentoption: ctx.params.paymentoption,
              usertypeid: 2,
              socialtypeid: 3,
              devicetoken: ctx.params.devicetoken,
              photopath: ctx.params.photopath,
              crdocs: ctx.params.crdocument,
              otp: otp,
              isverified: 1,
              status: ctx.params.status,
              agencyname: ctx.params.agentname,
              vatstatus:
                ctx.params.vatstatus !== undefined ? ctx.params.vatstatus : 1,
            })
              .then((response) => {
                // let lang = {};
                // lang['id'] = ctx.params.languageid;
                // lang['status'] = 1;
                // Language.find(ctx, { query: lang }).then(lang => {

                // }).catch(err => {
                //     console.log(err)
                // })

                AgentLang.insert(ctx, {
                  languageid: ctx.params.languageid,
                  langshortname: ctx.params.languageid == 1 ? "en" : "ar",
                  agentid: response.data.id,
                  agentname: ctx.params.agentname,
                  agentdescription: ctx.params.agentdescription,
                  agentaddress: ctx.params.agentaddress,
                }).catch((err) => {
                  console.log(err);
                });

                let replacements = {
                  agency_name: ctx.params.username,
                  subject: ConstantsMailTemplate.AgencyAgencyRegistrationSubject, 
                };

                dlMailer.sendMail(ctx, ConstantsMailTemplate.AgencyAgencyRegistration, ctx.params.email, replacements);

                /*
                let readHTMLFile = function (path, callback) {
                  fs.readFile(
                    path,
                    { encoding: "utf-8" },
                    function (err, html) {
                      if (err) {
                        throw err;
                      } else {
                        callback(null, html);
                      }
                    }
                  );
                };

                readHTMLFile(
                  mail_template + "/Requesttemplate_aregister.html",
                  function (err, html) {
                    let template = handlebars.compile(html);
                    let replacements = {
                      username: ctx.params.username,
                      password: ctx.params.password,
                    };
                    const htmlToSend = template(replacements);

                    ctx
                      .call("mail.send", {
                        to: ctx.params.email,
                        subject: "Agency login credentials",
                        html: htmlToSend,
                      })
                      .then((res) => {
                        return "Email sent successfully.";
                      });
                  }
                );
                */

                return this.requestSuccess("Agency created successfully");
                // return Agent.find(ctx, {query: {agentstatus : 1}})
                // .then(res => {
                //     return this.requestSuccess("List of Agencies", res.data);
                // })
              })
              .catch((err) => {
                console.log(err);
              });
          })

          .catch((err) => {
            if (err.name === "Database Error" && Array.isArray(err.data)) {
              if (
                err.data[0].type === "unique" &&
                err.data[0].field === "username"
              )
                return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
            }

            return this.requestError(CodeTypes.UNKOWN_ERROR);
          });
      } else {
        return this.requestError(CodeTypes.ALREADY_EXIST);
      }
    });
  },

  update: function (ctx) {
    return Agent.find(ctx, {
      query: {
        id: ctx.params.id,
      },
    }).then((agent) => {
      if (agent) {
        return Agent.updateBy(
          ctx,
          ctx.params.id,
          {
            firstname: ctx.params.firstname,
            lastname: ctx.params.lastname,
            username: ctx.params.username,
            email: ctx.params.email,
            // password: res.data,
            latitude: ctx.params.latitude,
            longitude: ctx.params.longitude,
            commissiontype: ctx.params.commissiontype,
            commissionvalue: ctx.params.commissionvalue,
            contactnumber: ctx.params.contactnumber,
            sortorder: ctx.params.sortorder,
            vat: ctx.params.vat,
            vatnumber: ctx.params.vatnumber,
            vatdocs: ctx.params.vatdocument,
            crnumber: ctx.params.crnumber,
            crdocs: ctx.params.crdocument,
            servicelocation: ctx.params.servicelocation,
            address: ctx.params.agentaddress || ctx.params.address,
            paymentoption: ctx.params.paymentoption,
            photopath: ctx.params.photopath,
            status: ctx.params.status,
            vatstatus:
              ctx.params.vatstatus !== undefined ? ctx.params.vatstatus : 1,
          },
          {
            query: { id: ctx.params.id },
          }
        )
          .then((response) => {
            AgentLang.updateBy(
              ctx,
              ctx.params.id,
              {
                languageid: ctx.params.languageid,
                langshortname: ctx.params.languageid == 1 ? "en" : "ar",
                agentname: ctx.params.agentname,
                agentdescription: ctx.params.agentdescription,
                agentaddress: ctx.params.agentaddress,
              },
              {
                query: { agentid: ctx.params.id },
              }
            ).catch((err) => {
              console.log(err);
            });
            return Agent.find(ctx, { query: { status: 1 } }).then((res) => {
              return this.requestSuccess("List of Agencies", res.data);
            });
          })
          .catch((err) => {
            console.log(err);
            if (err.name === "Database Error" && Array.isArray(err.data)) {
              if (
                err.data[0].type === "unique" &&
                err.data[0].field === "username"
              )
                return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
            }

            return this.requestError(CodeTypes.UNKOWN_ERROR);
          });
      } else {
        return this.requestError(CodeTypes.ALREADY_EXIST);
      }
    });
  },

  agent_changePassword: function (ctx) {
    console.log(ctx.params);
    // activity.getAgent(ctx,ctx.params.id).then((res) =>{
    // 	ctx.meta.username = res.data.email;
    // 	// console.log(activityData);
    // });
    return (
      this.verifyIfLogged(ctx)
        .then(() =>
          ctx.call("auth.verifyagent_change_Password", {
            id: ctx.params.id,
            password: ctx.params.oldpassword,
            newpassword: ctx.params.newpassword,
          })
        )
        .then((res) => {
          if (
            ctx.params.newpassword.localeCompare(ctx.params.confirmpassword) ==
            0
          ) {
            this.generateHash(ctx.params.newpassword).then((res) => {
              console.log(res);
              Agent.updateById(ctx, ctx.meta.user.id, {
                password: res.data,
              });
              ctx.meta.log = "Password changed";
              activity.setLog(ctx);
            });
          } else {
            ctx.meta.log = "Invalid old password";
            activity.setLog(ctx);
            return this.requestError(CodeTypes.USERS_PASSWORD_MATCH);
          }
        })
        //.then( () => ctx.call("auth.closeAllSessions"))
        .then(() => this.requestSuccess("Changes Saved", true))
        .catch((err) => {
          console.log(err);
          ctx.meta.log = "Attepmt to change password failed";
          activity.setLog(ctx);
          if (err instanceof MoleculerError) return Promise.reject(err);
          else return this.requestError(CodeTypes.UNKOWN_ERROR);
        })
    );
  },

  agent_getAll: function (ctx) {
    let filter = {};
    filter["status"] = { [Op.ne]: 2 };
    // if (ctx.params.status !== undefined && ctx.params.status > 0) filter['status'] = ctx.params.status;
    return Agent.find(ctx, { query: filter })
      .then((res) => {
        return this.requestSuccess("List of Agencies", res.data);
      })
      .catch((err) => {
        if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else return this.requestError(CodeTypes.UNKOWN_ERROR);
      });
  },

  agent_getApproved: function (ctx) {
    return Agent.find(ctx, { query: { status: { [Op.ne]: 2 }, isverified: 1 } })
      .then((res) => {
        return this.requestSuccess("List of Agencies", res.data);
      })
      .catch((err) => {
        if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else return this.requestError(CodeTypes.UNKOWN_ERROR);
      });
  },

  agent_status: function (ctx) {
    const str = Math.floor(100000 + Math.random() * 900000);
    const stmr = str.toString();
    const rande = stmr.split(".");
    return Agent.findOne(ctx, {
      query: {
        id: ctx.params.id,
      },
    })
      .then((res) => {
        //return this.generateHash(rande[0]).then((res_pass) => {
          if(ctx.params.agentstatus || ctx.params.agentstatus == 0){
            return Agent.updateBy(
              ctx,
              res.data.id,
              {
                agentstatus: ctx.params.agentstatus,
                isverified: 1,
              },
              {
                query: {
                  id: ctx.params.id,
                },
              }
            ).then((response) => {
              ctx.meta.username = ctx.params.email;
              ctx.meta.log =
                ctx.params.agentstatus == 1
                  ? "Agency approval"
                  : "Agency rejected";
              activity.setLog(ctx);


              var mailTemplateName = ConstantsMailTemplate.AgencyAgencyRegistrationApproval;
              let replacements = {
                agency_name: response.data[0].agencyname,
                subject: ConstantsMailTemplate.AgencyAgencyRegistrationApprovalSubject, 
              };

              if(ctx.params.agentstatus == 1) {
              } else {
                Tokens.removeMany(ctx, {
                  userId: ctx.params.id,
                  login_type: 'agency'
                });

                replacements = {
                  agency_name: response.data[0].agencyname,
                  subject: ConstantsMailTemplate.AgencyAgencyRegistrationRejectionSubject, 
                };

                mailTemplateName = ConstantsMailTemplate.AgencyAgencyRegistrationRejection;
              }

              dlMailer.sendMail(ctx, mailTemplateName, response.data[0].email, replacements);


              /*
              let readHTMLFile = function (path, callback) {
                fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
                  if (err) {
                    throw err;
                  } else {
                    callback(null, html);
                  }
                });
              };

              readHTMLFile(
                mail_template + "/Requesttemplate_astatus.html",
                function (err, html) {
                  let template = handlebars.compile(html);
                  let replacements = {
                    username: response.data[0].agencyname,
                    content: ctx.params.agentstatus == 1 ? "Your registration with Drive Lounge was reviewed and successfully approved, and can now sign in to your Agency Account and access Drive Lounge services." : "Your registration with Drive Lounge was reviewed and was assessed to be unsatisfactorily, we will call you shortly to rectify this matter.",
                  };
                  const htmlToSend = template(replacements);

                  ctx
                    .call("mail.send", {
                      to: response.data[0].email,
                      subject:
                        ctx.params.agentstatus == 1
                          ? "Agency approval"
                          : "Agency rejected",
                      html: htmlToSend,
                    })
                    .then((res) => {
                      return "Email sent successfully.";
                    });
                }
              );
              */

              return Agent.find(ctx, { query: { status: 1 } }).then((res) => {
                return this.requestSuccess("Agency list", res.data);
              });
            });
          }else if(ctx.params.status || ctx.params.status == 0){
            return Agent.updateBy(
              ctx,
              res.data.id,
              {
                status: ctx.params.status,
              },
              {
                query: {
                  id: ctx.params.id,
                },
              }
            ).then((response) => {
              ctx.meta.username = ctx.params.email;
              ctx.meta.log =
                ctx.params.status == 1
                  ? "Agency active"
                  : "Agency inactive";
              activity.setLog(ctx);

              return Agent.find(ctx, { query: { id: ctx.params.id } }).then((res) => {
                return this.requestSuccess("Agency list", res.data);
              });
            });
          }
        //});
      })

      .catch((err) => {
        console.log(err);
        if (err.name === "Database Error" && Array.isArray(err.data)) {
          if (err.data[0].type === "unique" && err.data[0].field === "username")
            return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
        }
        return this.requestError(CodeTypes.UNKOWN_ERROR);
      });
  },

  agent_remove: function (ctx) {
    return Agent.findOne(ctx, { query: { id: ctx.params.id } })
      .then((res) => {
        if (res.data) {
          return Agent.updateBy(
            ctx,
            res.data.id,
            {
              status: 2,
            },
            {
              query: {
                id: ctx.params.id,
              },
            }
          ).then((res) => {
            return Agent.find(ctx, { query: { status: 1 } }).then((res) => {
              return this.requestSuccess("List of Agencies", res.data);
            });
          });
        }
      })

      .catch((err) => {
        console.log(err);
        if (err.name === "Database Error" && Array.isArray(err.data)) {
          if (err.data[0].type === "unique" && err.data[0].field === "username")
            return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
        }
        return this.requestError(CodeTypes.UNKOWN_ERROR);
      });
  },

  agent_getbyid: async function (ctx) {
    return await sequelize12
      .query("exec sp_getagentbyid @id=:id", {
        replacements: { id: ctx.params.id },
        type: Sequ.QueryTypes.SELECT,
      })
      .then((res) => {
        if (res) return this.requestSuccess("Agency Information", res);
        else return this.requestError(CodeTypes.NOTHING_FOUND);
      })
      .catch((err) => {
        console.log(err);
        return this.requestError(CodeTypes.UNKOWN_ERROR);
      });
  },

  getuserreview: async function (ctx) {
    return await sequelize12
      .query("exec sp_getreivewbyid @Id=:id,@UserType=:usertypeid", {
        replacements: { id: ctx.params.id, usertypeid: ctx.params.usertypeid },
        type: Sequ.QueryTypes.SELECT,
      })
      .then((res) => {
        if (res) return this.requestSuccess("Review Information", res);
        else return this.requestError(CodeTypes.NOTHING_FOUND);
      })
      .catch((err) => {
        console.log(err);
        return this.requestError(CodeTypes.UNKOWN_ERROR);
      });
  },

  getAgencyByLang: async function (ctx) {
    return await sequelize12
      .query("exec sp_getAgencyByLang @Lang=:id", {
        replacements: { id: ctx.params.lang },
        type: Sequ.QueryTypes.SELECT,
      })
      .then((res) => {
        if (res) return this.requestSuccess("Agency Information", res);
        else return this.requestError(CodeTypes.NOTHING_FOUND);
      })
      .catch((err) => {
        console.log(err);
        return this.requestError(CodeTypes.UNKOWN_ERROR);
      });
  },

  changeRole: function (ctx) {
    // return this.verifyIfAdmin(ctx)
    //     .then( () => this.verifyRole(ctx.params.role) )
    //     .then( () => {
    //         if ((ctx.meta.login.username === ctx.params.username) && (ctx.params.is_admin !== ADMIN_ROLE))
    //             return this.isLastAdmin(ctx)
    //                 .then( (res) => {
    //                     if (res.data === false)
    //                         return Promise.resolve(true);
    //                     else
    //                         return this.requestError(CodeTypes.USERS_FORBIDDEN_REMOVE);
    //                 });
    //         else
    //             return Promise.resolve(true);
    //     })
    //     .then( () => Login.findOne(ctx, {
    //         query: {
    //             username: ctx.params.username
    //         },
    //         filter: Filters_Users.role
    //     }))
    //     .then( (res) => Tokens.removeMany(ctx, {
    //         userId: res.data.id
    //     }))
    //     .then( () => Login.updateMany(ctx, {
    //         username: ctx.params.username
    //     }, {
    //         is_admin: ctx.params.is_admin
    //     }))
    //     .then( () => this.requestSuccess("Changes Saved", true) )
    //     .catch( (err) => {
    //         if (err instanceof MoleculerError)
    //             return Promise.reject(err);
    //         else
    //             return this.requestError(CodeTypes.UNKOWN_ERROR);
    //     });
  },

  remove: function (ctx) {
    // return this.verifyIfLogged(ctx)
    //     .then( () => this.isLastAdmin(ctx) )
    //     .then( (res) => {
    //         if (res.data === false)
    //             return Promise.resolve(true);
    //         else
    //             return this.requestError(CodeTypes.USERS_FORBIDDEN_REMOVE);
    //     })
    //     .then( () => ctx.call("auth.verifyPassword", { username: ctx.meta.login.username, password: ctx.params.password}))
    //     .then( () => ctx.call("auth.closeAllSessions") )
    //     .then( () => Login.removeById(ctx, ctx.meta.login.id))
    //     .then( () => this.requestSuccess("Delete Complete", true) )
    //     .catch( (err) => {
    //         if (err instanceof MoleculerError)
    //             return Promise.reject(err);
    //         else
    //             return this.requestError(CodeTypes.UNKOWN_ERROR);
    //     });
  },

  banish: function (ctx) {
    // return this.verifyIfAdmin(ctx)
    //     .then( () => Login.findOne(ctx, {
    //         query: {
    //             username: ctx.params.username
    //         },
    //         filter: Filters_Users.role
    //     }))
    //     .then( (res) => {
    //         if (res.data.role !== ADMIN_ROLE)
    //             return Tokens.removeMany(ctx, {
    //                     userId: res.data.id
    //                 })
    //                 .then( () => Login.removeMany(ctx, {
    //                     username: ctx.params.username
    //                 }));
    //         else
    //             return this.requestError(CodeTypes.USERS_FORBIDDEN_REMOVE);
    //     })
    //     .then( () => this.requestSuccess("Delete Complete", true) )
    //     .catch( (err) => {
    //         if (err instanceof MoleculerError)
    //             return Promise.reject(err);
    //         else if (err.name === 'Nothing Found')
    //             return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
    //         else
    //             return this.requestError(CodeTypes.UNKOWN_ERROR);
    //     });
  },

  removeAll: function (ctx) {
    // return this.verifyIfAdmin(ctx)
    //     .then( () => ctx.call("auth.verifyPassword", { username: ctx.meta.login.username, password: ctx.params.password}))
    //     .then( () => Tokens.removeAll(ctx) )
    //     .then( () => Login.removeAll(ctx) )
    //     .then( () => ctx.call("login.createAdminIfNotExists"))
    //     .then( () => this.requestSuccess("Delete Complete", true) )
    //     .catch( (err) => {
    //         if (err instanceof MoleculerError)
    //             return Promise.reject(err);
    //         else
    //             return this.requestError(CodeTypes.UNKOWN_ERROR);
    //     });
  },

  createAdminIfNotExists: function (ctx) {
    return Role.count(ctx, {
      rolename: roles.rolename,
    })
      .then((res) => {
        if (res.data === 0) {
          return Role.insert(ctx, {
            rolename: roles.rolename,
            //role_json: roles.role_json,
            status: 1,
          })
            .then((resy) => {
              return this.generateHash(admins.password).then(
                (res) =>
                  User.insert(ctx, {
                    username: admins.username,
                    password: res.data,
                    email: admins.username,
                    roleid: resy.data.id,
                    usertypeid: 1,
                  }).then
              );
            })
            .then(res)
            .catch((e) => console.log(e));
        }
      })
      .then(() => this.requestSuccess("Admin Exists", true))
      .catch((err) => {
        return this.requestError(CodeTypes.UNKOWN_ERROR);
      });
  },
};

function isEmpty(obj) {
  var i = 0;
  for (var key in obj) {
    //  console.log( ++i ,'---' ,    obj , key)
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

async function dirDetails(testFolder) {
  // console.log("Sssssssssssss",testFolder)
  var arr = [];
  let jam = fs.readdirSync(testFolder);
  jam.sort(function (a, b) {
    //return a;
  });
  //console.log("RRRRRRRRRRRRRRRRRRR",jam)

  //    let yut = fs.readdir(testFolder, (err, files) => {
  //         var i = 0;
  //          let country_name = files.forEach(file => {
  //              console.log("EEEFFFFFFFFFFFFF",file)
  //             arr.push(file);

  //         })
  //     });
  //     console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXx",jam)
  return jam;
}
