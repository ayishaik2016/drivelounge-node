"use strict";

const passwordHash = require('password-hash');
const jwt = require("jsonwebtoken");
const Promise = require("bluebird");
const Database = require("../adapters/Database");
const Request = require("../mixins/request.mixin");
const UserValidator = require("../app/common/validators/UserValidator");
const UserController = require("../app/common/controllers/UserController");
const AuthValidator = require("../app/common/validators/AuthValidator");
const AuthController = require("../app/common/controllers/AuthController");
module.exports = {
    name: "user",

    mixins: [Request],

    actions: {

        create: {
            params: UserValidator.create,
            handler: UserController.create,
        },

        getAll: {
        	params: UserValidator.getAll,
        	handler: UserController.getAll,
        },

        // get: {
        // 	params: UserValidator.get,
        // 	handler: UserController.get,
        // },

        // count: {
        // 	params: LoginValidator.count,
        // 	handler: LoginController.count
        // },

        // changeInfo: {
        // 	params: LoginValidator.changeInfo,
        // 	handler: LoginController.changeInfo
        // },

        // changePassword: {
        // 	params: LoginValidator.changePassword,
        // 	handler: LoginController.changePassword
        // },

        // user_changePassword: {
        // 	params: LoginValidator.user_changePassword,
        // 	handler: LoginController.user_changePassword
        // },

        agent_login: {
            params: AuthValidator.agent_login,
            handler: AuthController.agent_login
        },

        // agent_verifyPassword: {
        // 	params: LoginValidator.agent_verifyPassword,
        // 	handler: LoginValidator.agent_verifyPassword
        // },

        // agent_resetPassword: {
        // 	params: LoginValidator.agent_resetPassword,
        // 	handler: LoginValidator.agent_resetPassword
        // },

        // verifyagent_change_Password: {
        // 	params: LoginValidator.verifyagent_change_Password,
        // 	handler: LoginValidator.verifyagent_change_Password
        // },

        // changeRole: {
        // 	params: LoginValidator.changeRole,
        // 	handler: LoginController.changeRole
        // },

        // remove: {
        // 	params: LoginValidator.remove,
        // 	handler: LoginController.remove,
        // },

        // banish: {
        // 	params: LoginValidator.banish,
        // 	handler: LoginController.banish
        // },

        // removeAll: {
        // 	params: LoginValidator.removeAll,
        // 	handler: LoginController.removeAll
        // },

        createAdminIfNotExists: {
            params: UserValidator.createAdminIfNotExists,
            handler: UserController.createAdminIfNotExists
        },
        // insertModles: {
        // 	params: LoginValidator.insertModles,
        // 	handler: LoginController.insertModles
        // },
        // getAllModule: {
        // 	params: LoginValidator.getAllModule,
        // 	handler: LoginController.getAllModule
        // }

    },

    methods: {
        generateHash(value) {

            return Promise.resolve(passwordHash.generate(value, { algorithm: 'sha256' }))
                .then((res) => this.requestSuccess("Password Encrypted", res));
        },

        verifyIfLogged(ctx, CodeTypes) {

            if (ctx.meta.user !== undefined)
                return this.requestSuccess("User Logged", true);
            else
                return this.requestError(CodeTypes.USERS_NOT_LOGGED_ERROR);
        },

        verifyIfAdmin(ctx) {

            return this.verifyIfLogged(ctx)
                .then(() => {
                    if (ctx.meta.login.is_admin === ADMIN_ROLE)
                        return this.requestSuccess("User is ADMIN", true);
                    else
                        return this.requestError(CodeTypes.AUTH_ADMIN_RESTRICTION);
                });
        },

        verifyRole(role) {

            if (Roles.indexOf(is_admin) !== -1)
                return this.requestSuccess("Role Exists", true);
            else
                return this.requestError(CodeTypes.USERS_INVALID_ROLE);
        },

        isLastAdmin(ctx) {

            return this.verifyIfAdmin(ctx)
                .then(() => this.Dadmin.count(ctx, {
                    is_admin: ADMIN_ROLE
                }))
                .then((res) => {
                    if (res.data === 1)
                        return this.requestSuccess("Last Admin", true);
                    else
                        return this.requestSuccess("Last Admin", false);
                })
                .catch((err) => {
                    if (err.message === CodeTypes.AUTH_ADMIN_RESTRICTION)
                        return this.requestSuccess("Last Admin", false);
                    else
                        return Promise.reject(err);
                });
        }
    },

    created() {
        // this.encode = Promise.promisify(jwt.sign);
        this.Duser = new Database("Duser");
    }
};