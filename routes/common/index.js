"use strict";

const Constants = require("../../plugin/constants");
module.exports = {
    bodyParsers: {
            json: true,
    },
	path: "/common/",
	onBeforeCall(ctx, route, req, res) {
		// Set request headers to context meta
		ctx.meta.userAgent = req.headers["user-agent"];
		ctx.meta.platform = req.headers["host"];
		ctx.meta.clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
	},
    roles: [Constants.ADMIN_ROLE],
    authorization: true,
    whitelist: [
        "auth.countSessions",
        "auth.logout",
        "auth.admin_profile",
        "auth.vendor_list",
        "auth.vendor_pending_list",
        "auth.vendor_request",
        "auth.closeAllSessions",
        "users.getAll",
        "users.get",
        "users.changeInfo",
        "login.changePassword",
        "login.user_changePassword",
        "users.remove",
		"upload.create",
        "common.*",
		"auth.*",
        "coupon.getuseragencylist",
        "package.*",
        "newsletter.*",
        "socialmedia.*",
        "sms.*",
        "smtp.*",
        "booking.getbookinginfobyid",
    ],
    aliases: {
        //Admin profile update
        "PUT admin_profile": "auth.admin_profile",

        // Auth: Session Controls only
        "GET sessions": "auth.countSessions",
        "DELETE logout": "auth.logout",
        "DELETE sessions": "auth.closeAllSessions",

        // APP configurations api only
        // "POST appconfig_create": "auth.app_configcreate",
        // "PUT appconfig_update": "auth.app_configupdate",
        // "GET appconfig_get": "auth.app_configget",


        // Users: Actions on Users that does not need priviledges
        "GET users": "users.getAll",
        "GET user/:username": "users.get",
        "PUT user/change/infos": "users.changeInfo",
        "PUT admin/change/password": "login.changePassword",
        "PUT user/change/password": "login.user_changePassword",
        // "PUT hotel/change/password": "login.hotel_changePassword",
        "DELETE user": "users.remove",
        "GET vendor_list": "auth.vendor_list",
        "GET vendor_pending_list": "auth.vendor_pending_list",
        "PUT vendor_request": "auth.vendor_request",

        "PUT upload": "upload.create",

        //list of common api's
        "POST vat/create": "common.create",
        "GET vat/get": "common.get",
        "GET vat/getAll": "common.getAll",
        "GET discounttype/getAll": "common.getAll_discount",
        "GET paymentmethod/getAll": "common.getAll_paymentmethod",
        "GET discounttype/get": "common.get_discounttype",
		"GET paymentmethod/get": "common.get_paymentmethod",
		"DELETE vat/remove": "common.remove",

        //creditcard payment
        "POST creditcard/card_create": "common.card_create",
        "GET creditcard/card_get": "common.card_get",

        //Dashboard Counts
        "GET common/dashboard": "common.dashboard_counts",

        // Coupon
        "GET coupon/get_useragency_list": "coupon.getuseragencylist",
        //SMTP
        "POST smtp/create": "smtp.create", 
        "GET smtp/get": "smtp.get",       
        "PUT smtp/update": "smtp.update",
        "DELETE smtp/remove": "smtp.remove",

        //SMS
        "POST sms/create": "sms.create",        
        "GET sms/get": "sms.get",
        "PUT sms/update": "sms.update",
        "DELETE sms/remove": "sms.remove",

        //SOCIAL MEDIA
        "POST socialmedia/create": "socialmedia.create",
        "GET socialmedia/getAll": "socialmedia.getAll",
        "GET socialmedia/get": "socialmedia.get",
        "PUT socialmedia/update": "socialmedia.update",
		"DELETE socialmedia/remove": "socialmedia.remove",

		//Package
		"POST package/create": "package.create",
		"GET package/getall": "package.getAll",
		"DELETE package/remove":"package.remove",
		"PUT package/update": "package.update",
		"GET package/get": "package.get",
        "GET package/admingetall": "package.admin_getAll",
        
        // Booking Information
        "GET booking/getbookingbyid": "booking.getbookinginfobyid",
        
        //Newsletter
		"POST newsletter/create": "newsletter.create",
		"GET newsletter/getall": "newsletter.getAll",
		"DELETE newsletter/remove":"newsletter.remove",
		"PUT newsletter/update": "newsletter.update",
        "GET newsletter/get": "newsletter.get",
        "GET newsletter/subscribers": "newsletter.subscriber_getall",
        "DELETE newsletter/subscriber_remove": "newsletter.subscriber_remove",
        "GET newsletter/subcribers_mail": "newsletter.subcribers_mail"
    }
}
