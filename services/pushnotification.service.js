"use strict";

const Promise = require("bluebird");
const webPush = require('web-push');
const Request = require("../mixins/request.mixin");
const pipe = require("pipe");
const passwordHash = require('password-hash');
const CommonValidator = require("../app/common/validators/CommonValidator");
const CommonController = require("../app/common/controllers/CommonController");
const Config = require("./../config");
module.exports = {
	name: "pushnotification",

	mixins: [
		Request
	 ],

	actions: {
		send: {
			params: CommonValidator.pushnotify_send,
			handler: CommonController.pushnotify_send,
		},
	},

	methods: {
		generateHash(value) {
			return Promise.resolve(passwordHash.generate(value, {algorithm: 'sha256'}))
				.then( (res) => this.requestSuccess("Password Encrypted", res) );
		},
		
	},

	created() {	
		// const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
    	// const privateVapidKey = process.env.PRIVATE_VAPID_KEY;		
		// webPush.setVapidDetails(`mailto:${Config.get('mailer/mail_id')}`, publicVapidKey, privateVapidKey);
	}
};
