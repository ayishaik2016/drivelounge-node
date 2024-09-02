"use strict";

const Promise = require("bluebird");
const ApiGateway = require("moleculer-web");
const Request = require("../mixins/request.mixin");
const Busboy = require("busboy");
const pipe = require("pipe");
const fs = require("fs");
const passwordHash = require('password-hash');
// const EnquiryValidator = require("../app/admin/validators/EnquiryValidator");
const EnquiryController = require("../app/admin/controllers/EnquiryController");
const img_path = __dirname;

module.exports = {
    name: "enquiry",

    mixins: [
        Request
    ],

    actions: {
        create: {
            // params: EnquiryValidator.create,
            handler: EnquiryController.create,
        },
        getAll: {
            // params: EnquiryValidator.getAll,
            handler: EnquiryController.getAll,
        },
        remove: {
            // params: EnquiryValidator.remove,
            handler: EnquiryController.remove,
        },
    },
};