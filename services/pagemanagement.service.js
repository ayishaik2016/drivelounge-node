"use strict";

const ApiGateway = require("moleculer-web");
const Request = require("../mixins/request.mixin");
const Busboy = require("busboy");
const pipe = require("pipe");
const fs = require("fs");
const passwordHash = require('password-hash');
const PageManagementValidator = require("../app/admin/validators/PagemanagementValidator");
const PageManagementController = require("../app/admin/controllers/PagemanagementController");
const img_path = __dirname;

module.exports = {
    name: "pagemanagement",

    mixins: [
        Request
    ],

    actions: {
        // cms
        cmscreate: {
            params: PageManagementValidator.cmscreate,
            handler: PageManagementController.cmscreate,
        },
        cmsupdate: {
            params: PageManagementValidator.cmsupdate,
            handler: PageManagementController.cmsupdate,
        },
        cmsremove: {
            params: PageManagementValidator.cmsremove,
            handler: PageManagementController.cmsremove,
        },
        cmsstatus: {
            params: PageManagementValidator.cmsstatus,
            handler: PageManagementController.cmsstatus,
        },
        cmsfindById: {
            params: PageManagementValidator.cmsfindById,
            handler: PageManagementController.cmsfindById,
        },
        cmsgetAll: {
            params: PageManagementValidator.cmsgetAll,
            handler: PageManagementController.cmsgetAll,
        },

        cmsfindByIdLang: {
            params: PageManagementValidator.cmsfindByIdLang,
            handler: PageManagementController.cmsfindByIdLang,
        },
        cmsfindByRelatedPage: {
            params: PageManagementValidator.cmsfindByRelatedPage,
            handler: PageManagementController.cmsfindByRelatedPage,
        },
        // faq
        faqcreate: {
            params: PageManagementValidator.faqcreate,
            handler: PageManagementController.faqcreate,
        },
        faqupdate: {
            params: PageManagementValidator.faqupdate,
            handler: PageManagementController.faqupdate,
        },
        faqremove: {
            params: PageManagementValidator.faqremove,
            handler: PageManagementController.faqremove,
        },
        faqstatus: {
            params: PageManagementValidator.faqstatus,
            handler: PageManagementController.faqstatus,
        },
        faqfindById: {
            params: PageManagementValidator.faqfindById,
            handler: PageManagementController.faqfindById,
        },
        faqgetAll: {
            params: PageManagementValidator.faqgetAll,
            handler: PageManagementController.faqgetAll,
        },
        faqgetByLang: {
            params: PageManagementValidator.faqgetByLang,
            handler: PageManagementController.faqgetByLang,
        },

    },

    methods: {},

    created() {}
};