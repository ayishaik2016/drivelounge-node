"use strict";

const Constants = require("../../plugin/constants");

const Database = require("../../adapters/Database");
const Op = require('sequelize').Op;
const Sequ = require("sequelize");

//Models
const Role = new Database("Drole");
const Permission = new Database("Dpermission");

const Permissionfilt = new Database("Dpermission",[
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
path: "/agent/",
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
        // "hotelstatus.*",
        "category.*",
        "service.*",
        "review.*",
        "agent.*",
        "voucher.*",
        "booking.*",
        "role*",
        "roleuser*",
        "module*",
        "upload.create",
        "agentvoucher.*"
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
        // agent api's
        "GET agent/get": "agent.get",
        "PUT agent/update": "agent.update",
        "GET agent/images": "agent.images",
        "DELETE agent/images": "agent.images",
        "PUT agent/changepassword": "agent.changepassword",
        "GET agent/timeget": "agent.timeget",
        "PUT agent/timeupdate": "agent.timeupdate",
        "PUT agent/timestatus": "agent.timestatus",

        //agent voucher creation's
        "POST agentvoucher/create": "agentvoucher.create",
        "GET agentvoucher/getall": "agentvoucher.getall",
        "GET agentvoucher/adminvoucher": "agentvoucher.adminvoucher",
        "GET agentvoucher/get": "agentvoucher.get",
        "PUT agentvoucher/update": "agentvoucher.update",
        "DELETE agentvoucher/remove": "agentvoucher.remove",
        "GET agentvoucher/coupon_get": "agentvoucher.coupon_get",
        "GET agentvoucher/voucher_code": "agentvoucher.voucher_code",
        "GET agentvoucher/getall_apptype": "agentvoucher.getall_apptype",
        "GET agentvoucher/get_apptype": "agentvoucher.get_apptype",
        "GET agentvoucher/getall_vouchertype": "agentvoucher.getall_vouchertype",
        "GET agentvoucher/get_vouchertype": "agentvoucher.get_vouchertype",
      
        // Category: Category creation api's only
        "POST category/create": "category.create",
        "GET category/getAll": "category.getAll",
        "GET category/get": "category.get",
        "PUT category/status": "category.status",
        "PUT category/update": "category.update",
        "DELETE category/delete": "category.remove",

        //voucher: voucher api's only
        "POST voucher/create": "voucher.create",
        "GET voucher/getAll": "voucher.getAll",
        "GET voucher/voucher_code": "voucher.voucher_code",
        "GET voucher/get": "voucher.get",
        "GET voucher/coupon_get": "voucher.coupon_get",
        "PUT voucher/update": "voucher.update",
        "DELETE voucher/delete": "voucher.remove",
        "GET getall_apptype": "voucher.getall_apptype",
        "GET get_apptype": "voucher.get_apptype",
        "GET getall_vouchertype": "voucher.getall_vouchertype",
        "GET get_vouchertype": "voucher.get_vouchertype",

         //Booking: booking api's only
         "POST booking/create": "booking.create",
         "GET booking/getAll": "booking.getAll",
         "GET booking/getAll_User": "booking.getAll_user",
         "GET booking/getAll_agent": "booking.getAll_agent",
         "GET booking/get": "booking.get",
         "PUT booking/update": "booking.update",
         "DELETE booking/delete": "booking.remove",
         "GET booking/activitylog": "booking.activity_log",
         "GET booking/booking_status": "booking.booking_status",  
         "PUT booking/tripstart": "booking.tripstart",
         "PUT booking/tripend": "booking.tripend",  
                 

        //Activity log
         "GET activitylog/getall": "activitylog.getAll",
         "DELETE activitylog/delete": "activitylog.remove"

    }

}
