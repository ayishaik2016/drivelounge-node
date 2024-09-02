"use strict";

const ApiGateway = require("moleculer-web");
const Request = require("../mixins/request.mixin");
const Busboy = require("busboy");
const pipe = require("pipe");
const fs = require("fs");
const passwordHash = require('password-hash');
const FavValidator = require("../app/admin/validators/FavValidator");
const FavController = require("../app/admin/controllers/FavController");
const img_path = __dirname;

module.exports = {
    name: "favorites",

    mixins: [
        Request
    ],

    actions: {
        create: {
            params: FavValidator.create,
            handler: FavController.create,
        },
        update: {
            params: FavValidator.update,
            handler: FavController.update,
        },
        get: {
            params: FavValidator.get,
            handler: FavController.get,
        },
    },

    methods: {},

    created() {}
};