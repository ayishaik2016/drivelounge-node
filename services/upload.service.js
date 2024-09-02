"use strict";
const Promise = require("bluebird");
const ApiGateway = require("moleculer-web");
const Request = require("./../mixins/request.mixin");
// const Busboy = require("busboy");
const Busboy = require("connect-busboy");
const pipe = require("pipe");
const fs = require("fs");
const passwordHash = require('password-hash');
const UploadValidator = require("./../app/admin/validators/UploadValidator");
const UploadController = require("./../app/admin/controllers/UploadController");
const img_path = __dirname;

module.exports = {
	name: "upload",
	mixins: [
		ApiGateway,
		Request
	],
	actions: {
		create: {
			params: UploadValidator.create,
			handler: UploadController.create,
		},		
	},

	methods: {
		randomName(meta){
           console.log(meta)
                let res = '';
                for(let i = 0; i < 20; i++){
                   const random = Math.floor(Math.random() * 27);
                   res += String.fromCharCode(97 + random);
                };
                return res;
        }
	},

	created() {	}
};
