"use strict";
const Promise = require("bluebird");
const ApiGateway = require("moleculer-web");
const Request = require("../mixins/request.mixin");
const Busboy = require("busboy");
const pipe = require("pipe");
const fs = require("fs");
const passwordHash = require('password-hash');
const DashboardController = require("../app/admin/controllers/DashboardController");
const img_path = __dirname;

module.exports = {
    name: "dashboard",

    mixins: [
        Request
    ],

    actions: {
        getcounts: {
            handler: DashboardController.getcounts,
        },
        getpiecounts: {
            handler: DashboardController.getpiecounts,
        },
        getbarcounts: {
            handler: DashboardController.getbarcounts,
        },
    },

    methods: {
        generateHash(value) {

            return Promise.resolve(passwordHash.generate(value, { algorithm: 'sha256' }))
                .then((res) => this.requestSuccess("Password Encrypted", res));
        },
    },

    created() {}
};