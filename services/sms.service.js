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
	name: "sms",

	mixins: [
		Request
	 ],

	actions: {
		create: {
			params: CommonValidator.sms_create,
			handler: CommonController.sms_create,
		},
		get: {
			params: CommonValidator.sms_get,
			handler: CommonController.sms_get,
		},
		update: {
			params: CommonValidator.sms_update,
			handler: CommonController.sms_update,
		},
        remove: {
			params: CommonValidator.sms_remove,
			handler: CommonController.sms_remove,
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
