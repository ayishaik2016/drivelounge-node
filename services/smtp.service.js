"use strict";
const Promise = require("bluebird");
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
	name: "smtp",

	mixins: [
		Request
	 ],

	actions: {
		create: {
			params: CommonValidator.smtp_create,
			handler: CommonController.smtp_create,
		},
		get: {
			params: CommonValidator.smtp_get,
			handler: CommonController.smtp_get,
		},
		update: {
			params: CommonValidator.smtp_update,
			handler: CommonController.smtp_update,
		},
        remove: {
			params: CommonValidator.smtp_remove,
			handler: CommonController.smtp_remove,
		},
	},

	methods: {
		generateHash(value) {

			return Promise.resolve(passwordHash.generate(value, {algorithm: 'sha256'}))
				.then( (res) => this.requestSuccess("Password Encrypted", res) );
		},
	},

	created() {	}
};
