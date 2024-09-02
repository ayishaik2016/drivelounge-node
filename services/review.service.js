"use strict";

const ApiGateway = require("moleculer-web");
const Request = require("../mixins/request.mixin");
const Busboy = require("busboy");
const pipe = require("pipe");
const fs = require("fs");
const passwordHash = require('password-hash');
const ReviewValidator = require("../app/admin/validators/ReviewValidator");
const ReviewController = require("../app/admin/controllers/ReviewController");
const img_path = __dirname;

module.exports = {
    name: "review",

    mixins: [
        Request
    ],

    actions: {
        create: {
            params: ReviewValidator.create,
            handler: ReviewController.create,
        },
        remove: {
            params: ReviewValidator.remove,
            handler: ReviewController.remove,
        },
        statuschange: {
            params: ReviewValidator.status,
            handler: ReviewController.statuschange,
        },
        get: {
            params: ReviewValidator.get,
            handler: ReviewController.get,
        },
        getAll: {
            params: ReviewValidator.getAll,
            handler: ReviewController.getAll,
        },
        update: {
            params: ReviewValidator.update,
            handler: ReviewController.update,
        },
    },

    methods: {},

    created() {}
};