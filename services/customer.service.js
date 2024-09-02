"use strict";

const ApiGateway = require("moleculer-web");
const Request = require("../mixins/request.mixin");
const Busboy = require("busboy");
const pipe = require("pipe");
const fs = require("fs");
const passwordHash = require('password-hash');
const CustomerController = require("../app/admin/controllers/CustomerController");
const img_path = __dirname;

module.exports = {
    name: "customer",

    mixins: [
        Request
    ],

    actions: {
        // cms
        getAll: {
            handler: CustomerController.getAll,
        },
        getCardList: {
            handler: CustomerController.getCardList,
        },
        status: {
            handler: CustomerController.status,
        },
        remove: {
            handler: CustomerController.remove,
        }
        // cmsupdate: {
        //     params: PageManagementValidator.cmsupdate,
        //     handler: PageManagementController.cmsupdate,
        // },
        // cmsremove: {
        //     params: PageManagementValidator.cmsremove,
        //     handler: PageManagementController.cmsremove,
        // },
        // cmsstatus: {
        //     params: PageManagementValidator.cmsstatus,
        //     handler: PageManagementController.cmsstatus,
        // },
        // cmsfindById: {
        //     params: PageManagementValidator.cmsfindById,
        //     handler: PageManagementController.cmsfindById,
        // },
        // cmsgetAll: {
        //     params: PageManagementValidator.cmsgetAll,
        //     handler: PageManagementController.cmsgetAll,
        // },
        // // faq
        // faqcreate: {
        //     params: PageManagementValidator.faqcreate,
        //     handler: PageManagementController.faqcreate,
        // },
        // faqupdate: {
        //     params: PageManagementValidator.faqupdate,
        //     handler: PageManagementController.faqupdate,
        // },
        // faqremove: {
        //     params: PageManagementValidator.faqremove,
        //     handler: PageManagementController.faqremove,
        // },
        // faqstatus: {
        //     params: PageManagementValidator.faqstatus,
        //     handler: PageManagementController.faqstatus,
        // },
        // faqfindById: {
        //     params: PageManagementValidator.faqfindById,
        //     handler: PageManagementController.faqfindById,
        // },
        // faqgetAll: {
        //     params: PageManagementValidator.faqgetAll,
        //     handler: PageManagementController.faqgetAll,
        // },

    },

    methods: {},

    created() {}
};