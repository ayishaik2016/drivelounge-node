"use strict";

const jwt	= require("jsonwebtoken");
const Promise = require("bluebird");
const passwordHash = require('password-hash');
const Database = require("../adapters/Database");
const Request = require("../mixins/request.mixin");
const CodeTypes = require("../fixtures/error.codes");
const AuthValidator = require("../app/common/validators/AuthValidator");
const AuthController = require("../app/common/controllers/AuthController");
const nodemailer = require('nodemailer');
const JWT_SECRET = "TOP SECRET!!!";
const Config = require("./../config");

module.exports = {
	name: "auth",

	mixins: [ Request ],

	actions: {		

		login: {
			params: AuthValidator.login,
			handler: AuthController.login
		},

		loginOtp: {
			params: AuthValidator.loginOtp,
			handler: AuthController.loginOtp
		},

		loginOtpResend: {
			params: AuthValidator.loginOtpResend,
			handler: AuthController.loginOtpResend
		},

		resetPassword: {
			params: AuthValidator.resetPassword,
			handler: AuthController.resetPassword
		},

		user_login: {
			params: AuthValidator.user_login,
			handler: AuthController.user_login
		},

		user_resetPassword: {
			params: AuthValidator.user_resetPassword,
			handler: AuthController.user_resetPassword
		},

		verifyPassword: {
			params: AuthValidator.verifyPassword,
			handler: AuthController.verifyPassword
		},

		verifyOtp: {
			params: AuthValidator.verifyOtp,
			handler: AuthController.verifyOtp
		},

		resendOtp: {
			params: AuthValidator.resendOtp,
			handler: AuthController.resendOtp
		},

		verify_change_Password: {
			params: AuthValidator.verify_change_Password,
			handler: AuthController.verify_change_Password
		},

		user_verifyPassword: {
			params: AuthValidator.user_verifyPassword,
			handler: AuthController.user_verifyPassword
		},

		verifyuser_change_Password: {
			params: AuthValidator.verifyuser_change_Password,
			handler: AuthController.verifyuser_change_Password
		},


		verifyToken: {
			//params: AuthValidator.verifyToken,
			handler: AuthController.verifyToken
		},

		countSessions: {
			//params: AuthValidator.countSessions,
			handler: AuthController.countSessions
		},

		closeAllSessions: {
			//params: AuthValidator.closeAllSessions,
			handler: AuthController.closeAllSessions
		},

		logout: {
			//params: AuthValidator.logout,
			handler: AuthController.logout
		},

		get_language: {
			handler: AuthController.get_language
		},

		agent_login: {
			params: AuthValidator.agent_login,
			handler: AuthController.agent_login
		},

		agent_verifyPassword: {
			params: AuthValidator.agent_verifyPassword,
			handler: AuthController.agent_verifyPassword
		},

		agent_resetPassword: {
			params: AuthValidator.agent_resetPassword,
			handler: AuthController.agent_resetPassword
		},

		agent_reset: {
			params: AuthValidator.agent_reset,
			handler: AuthController.agent_reset
		},

		user_reset: {
			params: AuthValidator.agent_reset,
			handler: AuthController.user_reset
		},

		verifyagent_change_Password: {
			params: AuthValidator.verifyagent_change_Password,
			handler: AuthController.verifyagent_change_Password
		},
		admin_profile: {
			params: AuthValidator.admin_profile,
			handler: AuthController.admin_profile
		}
	},

	methods: {

		async sendEmail({ from, to, subject, html }) {
			// const transporter = nodemailer.createTransport(Config.get('/smtp'));
			const transporter = nodemailer.createTransport({
				host: 'smtp-relay.sendinblue.com',
				port: 587,
				auth: {
					user: 'yaaditec@gmail.com',
					pass: 'HM3QmEOSgrcIbK6G'
				}
			});
			await transporter.sendMail({ from, to, subject, html });
		},

		generateToken(user) {

			return this.encode(user, JWT_SECRET);
		},

		getUser(id) {

			return 1;
			return this.Users.findOne(ctx, {
				query: {
					id: id
				}
			}).then((res) => res);
		},

		verifyIfLogged(ctx){

			if (ctx.meta.user !== undefined)
				return this.requestSuccess("User Logged", true);
			else
				return this.requestError(CodeTypes.USERS_NOT_LOGGED_ERROR);
		},
		generateHash(value) {

			return Promise.resolve(passwordHash.generate(value, {algorithm: 'sha256'}))
				.then( (res) => this.requestSuccess("Password Encrypted", res) );
		}

	},

	created() {
		// Create Promisify encode & verify methods
		this.encode = Promise.promisify(jwt.sign);

		// this.Users = new Database("Duser");

	}
};
