"use strict";

const ApiGateway = require("moleculer-web");
const Request = require("../mixins/request.mixin");
const Busboy = require("busboy");
const pipe = require("pipe");
const fs = require("fs");
const passwordHash = require('password-hash');
const ReportValidator = require("../app/admin/validators/ReportValidator");
const ReportController = require("../app/admin/controllers/ReportController");
const img_path = __dirname;

module.exports = {
    name: "reports",

    mixins: [
        Request
    ],

    actions: {
        // user: {
        //     params: ReportValidator.user,
        //     handler: ReportController.user,
        // },

        agency: {
            params: ReportValidator.agency,
            handler: ReportController.agency,
        },

        admin: {
            params: ReportValidator.admin,
            handler: ReportController.admin,
        },

        report1: {
            params: ReportValidator.report1,
            handler: ReportController.report1,
        },
        report2: {
            params: ReportValidator.report2,
            handler: ReportController.report2,
        },
        report3: {
            params: ReportValidator.report3,
            handler: ReportController.report3,
        },
        report4: {
            params: ReportValidator.report4,
            handler: ReportController.report4,
        },
        report5: {
            params: ReportValidator.report5,
            handler: ReportController.report5,
        },
        report6: {
            params: ReportValidator.report6,
            handler: ReportController.report6,
        },
    },
};