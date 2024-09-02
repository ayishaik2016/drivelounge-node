"use strict";

const ApiGateway = require("moleculer-web");
const Request = require("../mixins/request.mixin");
const Busboy = require("busboy");
const pipe = require("pipe");
const fs = require("fs");
const passwordHash = require('password-hash');
const AddressValidator = require("../app/common/validators/AddressValidator");
const AddressController = require("../app/common/controllers/AddressController");
const img_path = __dirname;

module.exports = {
	name: "address",

	mixins: [
		Request
	 ],

	actions: {        

        // City
        citycreate: {
			params: AddressValidator.citycreate,
			handler: AddressController.citycreate,
		},
        cityupdate: {
			params: AddressValidator.cityupdate,
			handler: AddressController.cityupdate,
		},
		cityremove: {
			params: AddressValidator.cityremove,
			handler: AddressController.cityremove,
		},
        citystatus: {
			params: AddressValidator.citystatus,
			handler: AddressController.citystatus,
		},
		citydashboardstatus: {
			handler: AddressController.citydashboardstatus,
		},
		cityget: {
			params: AddressValidator.cityget,
			handler: AddressController.cityget,
		},
        citygetAll: {
			params: AddressValidator.citygetAll,
			handler: AddressController.citygetAll,
		},
        // Area 
        areacreate: {
			params: AddressValidator.areacreate,
			handler: AddressController.areacreate,
		},
        areaupdate: {
			params: AddressValidator.areaupdate,
			handler: AddressController.areaupdate,
		},
		arearemove: {
			params: AddressValidator.arearemove,
			handler: AddressController.arearemove,
		},
        areastatus: {
			params: AddressValidator.areastatus,
			handler: AddressController.areastatus,
		},
		areaget: {
			params: AddressValidator.areaget,
			handler: AddressController.areaget,
		},
        areagetAll: {
			params: AddressValidator.areagetAll,
			handler: AddressController.areagetAll,
		},
        // Address Type
        typecreate: {
			params: AddressValidator.typecreate,
			handler: AddressController.typecreate,
		},
        typeupdate: {
			params: AddressValidator.typeupdate,
			handler: AddressController.typeupdate,
		},
		typeremove: {
			params: AddressValidator.typeremove,
			handler: AddressController.typeremove,
		},
        typestatus: {
			params: AddressValidator.typestatus,
			handler: AddressController.typestatus,
		},
		typeget: {
			params: AddressValidator.typeget,
			handler: AddressController.typeget,
		},
		typegetById: {
			params: AddressValidator.typegetById,
			handler: AddressController.typegetById,
		},
        typegetAll: {
			params: AddressValidator.typegetAll,
			handler: AddressController.typegetAll,
		},
	},

	methods: {
	},

	created() {	}
};
