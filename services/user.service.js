"use strict";

const jwt = require("jsonwebtoken");
const Promise = require("bluebird");
const Database = require("../adapters/Database");
const CodeTypes = require("../fixtures/error.codes");
const ApiGateway = require("moleculer-web");
const Request = require("../mixins/request.mixin");
const passwordHash = require("password-hash");
const JWT_SECRET = "TOP SECRET!!!";
const UserValidator = require("./../app/common/validators/UserValidator");
const UserController = require("./../app/common/controllers/UserController");

const AuthValidator = require("./../app/common/validators/AuthValidator");
const AuthController = require("./../app/common/controllers/AuthController");

const App_Config_Controller = require("./../app/admin/controllers/AppconfigController");
const App_Config_Validator = require("./../app/admin/validators/AppconfigValidator");

module.exports = {
  name: "users",

  mixins: [Request],

  actions: {
    create: {
      params: UserValidator.user_create,
      handler: UserController.user_create,
    },

    admin_create: {
      params: UserValidator.admin_create,
      handler: UserController.admin_create,
    },

    admin_update: {
      params: UserValidator.admin_update,
      handler: UserController.admin_update,
    },

    admin_remove: {
      params: UserValidator.admin_remove,
      handler: UserController.admin_remove,
    },

    admin_user_create: {
      params: UserValidator.admin_user_create,
      handler: UserController.admin_user_create,
    },

    admin_user_update: {
      params: UserValidator.admin_user_update,
      handler: UserController.admin_user_update,
    },

    login: {
      params: AuthValidator.user_login,
      handler: AuthController.user_login,
    },

    // verifypassword: {
    // 	params: UserValidator.verifypassword,
    // 	handler: UserController.verifypassword
    // },

    changepassword: {
      // params: UserValidator.changePassword,
      handler: UserController.changePassword,
    },

    // verify_changepassword: {
    // 	params: UserValidator.verify_changepassword,
    // 	handler: UserController.verify_changepassword
    // },

    user_resetPassword: {
      params: UserValidator.user_resetPassword,
      handler: AuthController.user_resetPassword,
    },

    agent_resetPassword: {
      params: UserValidator.agent_resetPassword,
      handler: AuthController.agent_resetPassword,
    },

    // close_allsessions: {
    // 	params: UserValidator.close_allsessions,
    // 	handler: UserController.close_allsessions
    // },

    otp_verify: {
      params: UserValidator.otp_verify,
      handler: UserController.otp_verify,
    },
    // admin_usrcreate: {
    // 	params: UserValidator.admin_usrcreate,
    // 	handler: UserController.admin_usrcreate,
    // },

    // getAll: {
    // 	params: UserValidator.getAll,
    // 	handler: UserController.getAll,
    // },

    getuserbyid: {
      params: UserValidator.getuserbyid,
      handler: UserController.getuserbyid,
    },

    changeEmail: {
      // params: UserValidator.changeInfo,
      handler: UserController.changeEmail,
    },

    changeInfo: {
      // params: UserValidator.changeInfo,
      handler: UserController.changeInfo,
    },

    getuserreview: {
      handler: UserController.getuserreview,
    },

    // verifyUsername: {
    // 	///params: UserValidator.update,
    // 	handler: UserController.verifyUsername,
    // },

    // status: {
    // 	params: UserValidator.status,
    // 	handler: UserController.status,
    // },

    // remove: {
    // 	params: UserValidator.remove,
    // 	handler: UserController.remove,
    // },
  },

  methods: {
    generateToken(user) {
      return this.encode(user, JWT_SECRET);
    },

    getUser(id) {
      return this.User.findOne(ctx, {
        query: {
          id: id,
        },
      }).then((res) => res);
    },

    verifyIfLogged(ctx) {
      console.log(ctx.meta.user);
      if (ctx.meta.user !== undefined)
        return this.requestSuccess("User Logged", true);
      else return this.requestError(CodeTypes.USERS_NOT_LOGGED_ERROR);
    },
    generateHash(value) {
      return Promise.resolve(
        passwordHash.generate(value, { algorithm: "sha256" })
      ).then((res) => this.requestSuccess("Password Encrypted", res));
    },
  },

  created() {
    // Create Promisify encode & verify methods
    this.encode = Promise.promisify(jwt.sign);
  },
};
