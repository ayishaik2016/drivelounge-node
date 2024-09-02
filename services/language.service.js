"use strict";

const Request = require("../mixins/request.mixin");
const LanguageValidator = require("../app/admin/validators/LanguageValidator");
const LanguageController = require("../app/admin/controllers/LanguageController");

const JWT_SECRET = "TOP SECRET!!!";

module.exports = {
    name: "language",

    mixins: [
        Request
    ],

    actions: {
        create: {
            params: LanguageValidator.create,
            handler: LanguageController.create,
        },

        getone: {
            params: LanguageController.getone,
            handler: LanguageController.getone
        },

        update: {
            params: LanguageController.update,
            handler: LanguageController.update
        },

        remove: {
            params: LanguageController.remove,
            handler: LanguageController.remove
        },



    }
};