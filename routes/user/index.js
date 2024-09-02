"use strict";

const Constants = require("../../plugin/constants");

const Database = require("../../adapters/Database");
const Op = require('sequelize').Op;
const Sequ = require("sequelize");

//Models
const Role = new Database("Drole");
const Permission = new Database("Dpermission");

const Permissionfilt = new Database("Dpermission", [
    "id",
    "permissionkey",
    "roleid",
    "moduleid",
    "access",
    "status"
]);
var annotations = require('annotations');
//const fs = require('fs');
var Path = require('path');
module.exports = {
    bodyParsers: {
        json: true,
    },
    path: "/user/",
    onBeforeCall(ctx, route, req, res) {
        // Set request headers to context meta
        ctx.meta.userAgent = req.headers["user-agent"];
        ctx.meta.platform = req.headers["host"];
        ctx.meta.clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    },
    /*onAfterCall(ctx, route, req, res) {
         console.log('------------------------------------');
         console.log( 'ctxxxxxxxxx22222222',ctx.params.req.originalUrl);
         console.log('------------------------------------');
     },*/
    roles: [Constants.ADMIN_ROLE],
    authorization: true,
    whitelist: [
        "user.*",
        "coupon.*",
        "booking.*",
        "users.*",
        "favorites.*"
    ],
    aliases: {
        // File upload from HTML form and overwrite busboy config
        "POST upload": {
            type: "multipart",
            // Action level busboy config
            busboyConfig: {
                limits: {
                    files: 1
                },
                onPartsLimit(busboy, alias, svc) {
                    this.logger.info("Busboy parts limit!", busboy);
                },
                onFilesLimit(busboy, alias, svc) {
                    this.logger.info("Busboy file limit!", busboy);
                },
                onFieldsLimit(busboy, alias, svc) {
                    this.logger.info("Busboy fields limit!", busboy);
                }
            },
            action: "upload.create"
        },

        // User: User creation api's only
        "POST user/create": "user.create",
        "GET user/getAll": "user.getAll",
        "GET user/get": "user.get",

        "GET user/getuserbyid": "users.getuserbyid",
        "PUT user/changeinfo": "users.changeInfo",
        "POST user/changeemail": "users.changeEmail",
        "PUT user/changepassword": "users.changepassword",
        "GET user/getuserreview": "users.getuserreview",

        "GET user/verifyUsername": "user.verifyUsername",

        "PUT user/status": "user.status",
        "DELETE user/delete": "user.remove",
        "PUT user/vendorupdate": "user.vendorupdate",
        "POST user/orgcreate": "user.orgcreate",
        "PUT user/profile_update": "user.profile_update",


        //Activity log
        "GET activitylog/getall": "activitylog.getAll",
        "DELETE activitylog/delete": "activitylog.remove",

        // coupon api's
        "GET coupon/getcouponvalue": "coupon.getcouponvalue",
        "GET coupon/getcoupon": "coupon.getcoupon",

        // Booking api's
        "POST booking/reservation": "booking.create",
        "PUT booking/confirmation": "booking.update",
        "PUT booking/changes": "booking.update_info",     
        "PUT booking/payment": "booking.admin_pay",   
        "GET booking/getreservation": "booking.getbyid",
        
        "GET booking/getuserinfo": "booking.getuserinfo",
        "GET booking/getbookinginfo": "booking.getbookinginfo",
        "GET booking/getmybookinginfo": "booking.getmybookinginfo",
        "PUT booking/booking_cancel": "booking.booking_cancel",
        "PUT booking/change_request": "booking.change_request",

        // Favorites api's
        "POST favorite/create": "favorites.create",
        "PUT favorite/remove": "favorites.update",      
        "GET favorite/get": "favorites.get",
    }

}