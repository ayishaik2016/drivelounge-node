"use strict";
const Request = require("../mixins/request.mixin");
const ApplicationValidator = require("../app/admin/validators/ApplicationValidator");
const ApplicationController = require("../app/admin/controllers/ApplicationController");

module.exports = {
	name: "application",

	mixins: [
		Request
	 ],

	actions: {
        create: {
			params: ApplicationValidator.create,
			handler: ApplicationController.create,
        },

        update: {
			params: ApplicationValidator.update,
			handler: ApplicationController.update,
        },

        remove: {
			params: ApplicationValidator.remove,
			handler: ApplicationController.remove,
        },

		getAll: {
			params: ApplicationValidator.getAll,
			handler: ApplicationController.getAll,
		},
		
	},

	methods: {
		randombookingnum() {
			const str = Math.random();
			const stmr = str.toString();
			const rande = stmr.split(".");
			return rande[1].substr(2, 6);
		}
	},

	created() {	}
};
