"use strict";

const ApiGateway = require("moleculer-web");
const Request = require("../mixins/request.mixin");
const Busboy = require("busboy");
const pipe = require("pipe");
const fs = require("fs");
const passwordHash = require('password-hash');
const CountryValidator = require("../app/admin/validators/CountryValidator");
const CountryController = require("../app/admin/controllers/CountryController");
const img_path = __dirname;

module.exports = {
	name: "country",

	mixins: [
		Request
	 ],

	actions: { 

        create: {
			params: CountryValidator.create,
			handler: CountryController.create,
		},
        update: {
			params: CountryValidator.update,
			handler: CountryController.update,
		},
		remove: {
			params: CountryValidator.remove,
			handler: CountryController.remove,
		},
        status: {
			params: CountryValidator.status,
			handler: CountryController.status,
		},
		get: {
			params: CountryValidator.get,
			handler: CountryController.get,
		},
        getAll: {
			params: CountryValidator.getAll,
			handler: CountryController.getAll,
		},
        
	},

	methods: {
	},

	created() {	}
};
