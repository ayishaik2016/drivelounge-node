"use strict";

const Constants = require("../../plugin/constants");

const Database = require("../../adapters/Database");
const Op = require('sequelize').Op;
const Sequ = require("sequelize");

//Models
// const Role = new Database("Drole");
// const Permission = new Database("Dpermission");

// const Permissionfilt = new Database("Dpermission",[
//     "id",
//     "permissionkey",
//     "roleid",
//     "moduleid",
//     "access",
//     "status"
// ]);
// var annotations = require('annotations');
//const fs = require('fs');
var Path = require('path');
module.exports = {
    bodyParsers: {
        json: true,
    },
    path: "/admin/",
    onBeforeCall(ctx, route, req, res) {
        // Set request headers to context meta
        ctx.meta.data = req.params;
        ctx.meta.userAgent = req.headers["user-agent"];
        ctx.meta.platform = req.headers["host"];
        ctx.meta.clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    },
    roles: [Constants.ADMIN_ROLE],
    authorization: true,
    whitelist: [
        "auth.login",
        "auth.loginOtp",
        "auth.loginOtpResend",
        "user.*",
        "country.*",
        "currency.*",
        "administration.*",
        "address.*",
        // "category.*",
        "application.*",
        "review.*",
        "coupon.*",
        "booking.*",
        "role.*",        
        "pagemanagement.*",
        "faqmanage*",
        "activitylog.*",
        "sms.*",
        "smtp.*",
        "appconfig.*",
        "upload.create",
        "agent.*",
        "car.*",
        "language.*",
        "dashboard.*",
        "customer.*",
        "enquiry.*",
        "users.*",
        'reports.*'
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

        // Admin Dashboard Counts
        "GET dashboard/getcounts": "dashboard.getcounts",
        "GET dashboard/getbarcounts": "dashboard.getbarcounts",
        "GET dashboard/getpiecounts": "dashboard.getpiecounts",

        // Customers List
        "GET customer/getAll": "customer.getAll",
        "GET customer/getCardList": "customer.getCardList",
        "PUT customer/status": "customer.status",
        "DELETE customer/delete": "customer.remove",

        // User: User creation api's only
        "GET user/getAll": "user.getAll",
        "GET user/get": "user.get",
        "GET user/verifyUsername": "user.verifyUsername",
        "PUT user/update": "user.update",
        "PUT user/status": "user.status",
        "DELETE user/delete": "user.remove",
        "PUT user/vendorupdate": "user.vendorupdate",
        "POST user/orgcreate": "user.orgcreate",
        "PUT user/profile_update": "user.profile_update",
        "POST user/admin_user_create": "users.admin_user_create",
        "PUT user/admin_user_update": "users.admin_user_update",
        
        
        // Agent API's only
        "POST agent/create": "agent.admin_create_agent",
        "GET agent/getAll": "agent.agent_getAll",
        "GET agent/getByAllLang": "agent.getAgencyByLang",        
        "PUT agent/status": "agent.status",
        "DELETE agent/delete": "agent.remove",
        "GET agent/getone": "agent.agent_getbyid",
        "POST agent/update": "agent.update",
        "GET agent/getApprovedAll": "agent.agent_getApproved",

        // Category: Category creation api's only
        "POST category/create": "category.create",
        "GET category/getAll": "category.getAll",
        "GET category/get": "category.get",
        "PUT category/status": "category.status",
        "PUT category/update": "category.update",
        "DELETE category/delete": "category.remove",

        // Country: country creation api's only
        "POST country/create": "country.create",
        "GET country/getAll": "country.getAll",
        "GET country/get": "country.get",
        "PUT country/status": "country.status",
        "PUT country/update": "country.update",
        "DELETE country/delete": "country.remove",

        // currency api's
        "GET currency/getAll": "currency.getAll",
        "POST currency/create": "currency.create",
        "PUT currency/status": "currency.updateStatus",
        "PUT currency/update": "currency.update",
        "GET currency/conversions/getAll": "currency.getAllConversions",
        "POST currency/conversions/create": "currency.createConversion",
        "PUT currency/conversions/update": "currency.updateConversion",

        // CMS: Page Management api's only
        "POST cms/create": "pagemanagement.cmscreate",
        "GET cms/getAll": "pagemanagement.cmsgetAll",
        "GET cms/get": "pagemanagement.cmsfindById",
        "PUT cms/update": "pagemanagement.cmsupdate",
        "PUT cms/cmsstatus": "pagemanagement.cmsstatus",
        "DELETE cms/delete": "pagemanagement.cmsremove",

        //FAQ
        "POST faq/create": "pagemanagement.faqcreate",
        "GET faq/getAll": "pagemanagement.faqgetAll",
        "GET faq/get": "pagemanagement.faqfindById",
        "PUT faq/update": "pagemanagement.faqupdate",
        "PUT faq/faqstatus": "pagemanagement.faqstatus",
        "DELETE faq/delete": "pagemanagement.faqremove",

        // WebSite: app settings 
        "POST appconfig/create": "appconfig.create",
        "PUT appconfig/update": "appconfig.update",
        "GET appconfig/get": "appconfig.get",

        //sms
        "PUT sms/update": "sms.update",
        "GET sms/get": "sms.get",

        //smtp
        "PUT smtp/update": "smtp.update",
        "GET smtp/get": "smtp.get",

        // City: city creation api's only
        "POST addresscity/create": "address.citycreate",
        "GET addresscity/getAll": "address.citygetAll",
        "GET addresscity/get": "address.cityget",
        "PUT addresscity/status": "address.citystatus",
        "PUT addresscity/dashboardstatus": "address.citydashboardstatus",
        "PUT addresscity/update": "address.cityupdate",
        "POST addresscity/delete": "address.cityremove",

        // Area: area creation api's only
        "POST addressarea/create": "address.areacreate",
        "GET addressarea/getAll": "address.areagetAll",
        "GET addressarea/get": "address.areaget",
        "PUT addressarea/status": "address.areastatus",
        "PUT addressarea/update": "address.areaupdate",
        "POST addressarea/delete": "address.arearemove",

        // Address Type: Address Type creation api's only
        "POST addresstype/create": "address.typecreate",
        "GET addresstype/getAll": "address.typegetAll",
        "GET addresstype/get": "address.typeget",
        "POST addresstype/getById": "address.typegetById",
        "PUT addresstype/status": "address.typestatus",
        "PUT addresstype/update": "address.typeupdate",
        "POST addresstype/delete": "address.typeremove",

        // application: Application api's only - DL
        "POST application/create": "application.create",
        "PUT application/update": "application.update",
        "POST application/getAll": "application.getAll",
        "DELETE application/delete": "application.remove",

        // review: review api's only
        // "PUT review/review_approval": "review.review_approval",
        // "GET review/user_review": "review.user_reviews",
        // "GET review/vendor_reviews": "review.vendor_reviews",
        // "GET review/admin": "review.admin_list",
        "GET review/getAll": "review.getAll",
        "POST review/create": "review.create",
        "PUT review/status": "review.statuschange",
        "DELETE review/delete": "review.remove",

        //Coupon: Coupon api's only
        "GET coupon/generate_couponcode": "coupon.generate_couponcode",
        "GET coupon/coupon_code/validate": "coupon.couponcode_validate",
        "POST coupon/create": "coupon.create",
        "PUT coupon/update": "coupon.update",
        "PUT coupon/delete": "coupon.remove",
        "POST coupon/coupon_type/create": "coupon.coupontype_create",
        "GET coupon/coupon_type/get": "coupon.coupontype_get",
        "POST coupon/coupon_apptype/create": "coupon.couponapptype_create",
        "GET coupon/coupon_apptype/get": "coupon.couponapptype_get",
        // "POST voucher/create": "voucher.create",
        "GET coupon/getAll": "coupon.getAll",
        "GET coupon/getcoupon": "coupon.getcoupon",
        

        //Booking: booking api's only
        "POST booking/create": "booking.create", // Reservation of selected car
        "POST booking/update": "booking.update", // Completion of booking after the payment made success
        "POST booking/booking": "booking.get_booking_all", // Get all booking status
        "GET booking/getAll_User": "booking.getAll_user",
        "GET booking/getAll_vendor": "booking.getAll_vendor",
        "GET booking/get": "booking.get",
        "PUT booking/update": "booking.update",
        "DELETE booking/delete": "booking.remove",
        "GET booking/activitylog": "booking.activity_log",
        "PUT booking/booking_status": "booking.booking_status",

        "PUT booking/tripstart": "booking.tripstart",
        "PUT booking/tripend": "booking.tripend",
        "POST booking/pickupimages": "booking.pickupimages",
        "POST booking/dropoffimages": "booking.dropoffimages", 

        //Role: role api's only
        "POST role/create": "role.create",
        "GET role/getall": "role.getall",
        "GET role/status": "role.status",
        "GET role/get": "role.get",
        "PUT role/update": "role.update",
        "DELETE role/delete": "role.remove",

        "GET role/getpermission" : "role.getpermissionlist",
        "GET role/getrolerights" : "role.getrolerights",
        //User role assign
        "POST roleuser/create": "roleuser.create",
        "PUT roleuser/update": "roleuser.update",

        // Module: module creation api's only
        "GET module/get": "role.getaccessmodule",

        "DELETE module/delete": "module.remove",
        "GET booking/activitylog": "booking.activity_log",

        //Activity log
        "POST activitylog/getall": "activitylog.getAll",
        "DELETE activitylog/delete": "activitylog.remove",

        // Car Creation Information - Brand
        "POST car/brand/create": "car.carbrand_create",
        "GET car/brand/get": "car.carbrand_get",
        "DELETE car/brand/remove": "car.carbrand_remove",
        "PUT car/brand/update": "car.carbrand_update",

        // Car Creation Information - Type
        "POST car/type/create": "car.cartype_create",
        "GET car/type/get": "car.cartype_get",
        "DELETE car/type/remove": "car.cartype_remove",
        "PUT car/type/update": "car.cartype_update",

        // Car Creation Information - Model
        "POST car/model/create": "car.carmodel_create",
        "GET car/model/get": "car.carmodel_get",
        "DELETE car/model/remove": "car.carmodel_remove",

        // Car Creation Information - Year
        "POST car/year/create": "car.caryear_create",
        "GET car/year/get": "car.caryear_get",
        "DELETE car/year/remove": "car.caryear_remove",

        // Car Creation Information - Action
        "POST car/action/create": "car.caraction_create",
        "GET car/action/get": "car.caraction_get",
        "DELETE car/action/remove": "car.caraction_remove",

        // Car Features - Insurance
        "POST car/insurance/create": "car.carinsurance_create",
        "GET car/insurance/get": "car.carinsurance_get",
        "DELETE car/insurance/remove": "car.carinsurance_remove",

        // Car Features - Milege
        "POST car/milege/create": "car.carmilege_create",
        "GET car/milege/get": "car.carmilege_get",
        "DELETE car/milege/remove": "car.carmilege_remove",

        // Car Features - Cylinders
        "POST car/cylinder/create": "car.carcylinder_create",
        "GET car/cylinder/get": "car.carcylinder_get",
        "DELETE car/cylinder/remove": "car.carcylinder_remove",

        // Car Features - Driver
        "POST car/driver/create": "car.cardriver_create",
        "GET car/driver/get": "car.cardriver_get",
        "DELETE car/driver/remove": "car.cardriver_remove",

        // Car Features - Transmission
        "POST car/transmission/create": "car.cartransmission_create",
        "GET car/transmission/get": "car.cartransmission_get",
        "DELETE car/transmission/remove": "car.cartransmission_remove",

        // Car Features - Seat
        "POST car/seat/create": "car.carseat_create",
        "GET car/seat/get": "car.carseat_get",
        "DELETE car/seat/remove": "car.carseat_remove",

        // Car Features - Speed
        "POST car/speed/create": "car.carspeed_create",
        "GET car/speed/get": "car.carspeed_get",
        "DELETE car/speed/remove": "car.carspeed_remove",

        // New Car Creation
        "POST car/create": "car.car_create",
        "GET car/get": "car.car_get",
        "DELETE car/remove": "car.car_remove",
        "POST car/update": "car.car_update",
        "POST car/get_carbyid": "car.get_carbycarid",
        "POST car/carmanagement": "car.get_carmanagement",
        "POST car/remove_carmanagement": "car.remove_carmanagement",
        "POST car/carmanagement_filter": "car.get_carmanagement_filter",
        "PUT car/setcarstatus": "car.set_CarStatus",

        //Language API's
        "POST language/create": "language.create",
        "GET language/status": "language.status",
        "GET language/getone": "language.getone",
        "PUT language/update": "language.update",
        "DELETE language/delete": "language.remove",

        //Enquiry/Contactus API's        
        "GET enquiry/getAll": "enquiry.getAll",
        "DELETE enquiry/delete": "enquiry.remove",

        // Reports API's
        "GET reports/user": "reports.user",
        "GET reports/agency": "reports.agency",
        "GET reports/admin": "reports.admin",

        "GET reports/report1": "reports.report1",
        "GET reports/report2": "reports.report2",
        "GET reports/report3": "reports.report3",
        "GET reports/report4": "reports.report4",
        "GET reports/report5": "reports.report5",
        "GET reports/report6": "reports.report6",
    }

}