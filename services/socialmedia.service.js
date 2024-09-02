"use strict";

const ApiGateway = require("moleculer-web");
const Request = require("../mixins/request.mixin");
const Busboy = require("busboy");
const pipe = require("pipe");
const fs = require("fs");
const passwordHash = require('password-hash');
const CommonValidator = require("../app/common/validators/CommonValidator");
const CommonController = require("../app/common/controllers/CommonController");
const img_path = __dirname;

module.exports = {
	name: "socialmedia",

	mixins: [
		Request
	 ],

	actions: {
		create: {
			params: CommonValidator.social_create,
			handler: CommonController.social_create,
		},
		get: {
			params: CommonValidator.social_get,
			handler: CommonController.social_get,
		},
        getAll: {
			params: CommonValidator.social_getAll,
			handler: CommonController.social_getAll,
		},
		update: {
			params: CommonValidator.social_update,
			handler: CommonController.social_update,
		},
        remove: {
			params: CommonValidator.social_remove,
			handler: CommonController.social_remove,
		},
	},

	methods: {
	},

	created() {	}
};
