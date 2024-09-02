"use strict";

module.exports = {
    bodyParsers: {
        json: true,
    },
    path: "/public/",
    onBeforeCall(ctx, route, req, res) {
        console.log(req.file)
        // Set request headers to context meta
        ctx.meta.userAgent = req.headers["user-agent"];
        ctx.meta.platform = req.headers["host"];
        ctx.meta.clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    },
    authorization: false,

    whitelist: [
        "auth.login",
        "auth.loginOtp",
        "auth.loginOtpResend",
        "auth.get_language",
        "users.create",
        "users.login",
        "users.verifyUsername",
        "users.forgetpassword",
        "users.otp_verify",
        "auth.resetPassword",
        "auth.admin_resetPassword",
        "auth.user_resetPassword",
        "auth.agent_reset",
        "auth.user_reset",
        "country.getAll",
        "address.areagetAll",
        "address.citygetAll",
        "area.getAll",
        "upload.*",
        "category.getAll",
        "currency.getAllActive",
        "currency.getConversion",
        "service.ourservice",
        "review.create",
        "review.getAll",
        "review.get",
        "review.review_count",
        "service.getAll",
        "common.getAll_aboutus",
        "common.add_newsletter",
        "enquiry.*",
        "city.getAll_Web",
        "pagemanagement.*",
        "cms.*",
        "auth.agent_login",
        "website.*",
        "agent.*",
        "car.*",
        "booking.*",
        "coupon.*",
        "users.admin_create",
        "users.admin_update",
        "users.admin_remove",
        "users.*",
        "socialmedia.*"
    ],
    aliases: {

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

        "POST public/upload": "upload.create",

        "POST login": "auth.login",
        "POST loginOtp": "auth.loginOtp",
        "POST loginOtpResend": "auth.loginOtpResend",

        //User: login only
        // Users: create account only
        "POST user/create": "users.create",
        "POST user/admin_create": "users.admin_create",
        "PUT user/admin_update": "users.admin_update",
        "DELETE user/admin_remove": "users.admin_remove",
        "POST user/login": "users.login",
      //  "PUT user/forgetpassword": "users.forgetpassword",
        "PUT user/user_resetPassword": "users.user_resetPassword",
        "PUT user/agent_resetPassword": "users.agent_resetPassword",

        // restet
        "POST agency/reset": "auth.agent_reset", 
        "POST user/reset": "auth.user_reset", 
        //Agent: api's only
        "POST agency/login": "auth.agent_login",   
           
        "POST agency/create": "agent.create",

        //Review api's only
        "POST review/create": "review.create",
        "GET review/getAll": "review.getAll",
        "GET review/review_count": "review.review_count",
        "GET review/get": "review.get",

        //website home page
        "GET website/category_getall": "website.category_getall",
        "GET website/saloon_getall": "website.saloon_getall",
        "GET website/toprating_getall": "website.toprating_getall",

        // reset passwor for forgott admin
        "PUT auth/reset/password": "auth.resetPassword",

        "PUT auth/reset/admin_reset": "auth.resetPassword",

        "PUT auth/reset/user_reset": "auth.user_resetPassword",
        "POST user/verifyUsername": "user.verifyUsername",
        "PUT user/otp_verify": "users.otp_verify",
        "PUT auth/reset/hotel_reset": "auth.hotel_resetPassword",

        //Category list is shown as public
        "GET agent/getAll": "agent.agent_getAll",

        

        // GEt Social media link for footer
        "GET socialmedia/get": "socialmedia.get",

        //Mutiple File upload
        // "POST general/upload": {
        //     type: "multipart",
        //     // Action level busboy config
        //     busboyConfig: {
        //         limits: {
        //             files: 10
        //         },
        //         onPartsLimit(busboy, alias, svc) {
        //             this.logger.info("Busboy parts limit!", busboy);
        //         },
        //         onFilesLimit(busboy, alias, svc) {
        //             this.logger.info("Busboy file limit!", busboy);
        //         },
        //         onFieldsLimit(busboy, alias, svc) {
        //             this.logger.info("Busboy fields limit!", busboy);
        //         }
        //     },
        //     action: "upload.create"
        // },

        //Contactus api's
        "POST enquiry/create": "enquiry.create",


        //Below three api's are used commonly with out authorization
        //country Getall api
        "GET country/getAll": "country.getAll",

        //country Getall api

        "GET addresscity/getAll": "address.citygetAll",
        "GET city/getAll_Web": "city.getAll_Web",

        // coupon api's
        //"GET coupon/getcouponvalue": "coupon.getcouponvalue",
        //area Getall api
        "GET addressarea/getAll": "address.areagetAll",

        //Cms Getall api
        "GET cms/getAll": "pagemanagement.cmsgetAll",
        "GET cms/getByIdLang": "pagemanagement.cmsfindByIdLang", 
        "GET cms/getByRelatedPageLang": "pagemanagement.cmsfindByRelatedPage",       

        //faq getall
        "GET faq/getlang": "pagemanagement.faqgetByLang",

        //ourservice GetAll api
        "GET ourservice/getAll": "service.ourservice",

        "GET currencies/getAll": "currency.getAllActive",
        "GET currencies/conversion": "currency.getConversion",

        // car api's
        "GET car/specification": "car.get_carinformation",
        "GET car/get_cardisplayinfo": "car.get_cardisplayinfo",
        "GET car/get_carfullinfo": "car.get_carfullinfolist",
        "GET car/get_carinterrior": "car.get_carinterrior",
        "GET car/get_carreview": "car.get_carreview",
        "POST car/checkisavailable": "car.checkisavailable",
        // car filter purpose
        "GET car/get_brand": "car.carbrand_get",
        "GET car/type/get": "car.cartype_get",
        "GET car/year/get": "car.caryear_get",
        
        "GET car/get_filterinfo": "car.filterinfo",
        // booking api's
        "GET booking/getdates": "booking.getbookingdates",
        "GET booking/getpayoption": "booking.getpayoption",

        "GET aboutus/get": "common.getAll_aboutus",        

        //news letter subscribtion
        "POST newsletter/subscribe": "common.add_newsletter",

        //contact us (enquiry)
        "POST contactus/create": "contactus.create",
        "GET contactus/getAll": "contactus.getAll",
        "GET contactus/status": "contactus.status",
        "GET contactus/get": "contactus.get",
        "PUT contactus/update": "contactus.update",
        "DELETE contactus/delete": "contactus.remove",
    }
}