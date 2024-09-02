"use strict";


const jwt = require("jsonwebtoken");
const Promise = require("bluebird");
const Database = require("./../adapters/Database");
const CodeTypes = require("./../fixtures/error.codes");
const ApiGateway = require("moleculer-web");
const Request = require("./../mixins/request.mixin");
const Busboy = require("busboy");
const pipe = require("pipe");
const fs = require("fs");
const passwordHash = require('password-hash');
const AgentValidator = require("./../app/common/validators/UserValidator");
const AgentController = require("./../app/common/controllers/UserController");
const img_path = __dirname;


const JWT_SECRET = "TOP SECRET!!!";

module.exports = {
    name: "agent",

    mixins: [
        Request
    ],

    actions: {
        create: {
            params: AgentValidator.agent_create,
            handler: AgentController.agent_create,
        },
        admin_create_agent: {
            params: AgentValidator.agent_create_admin,
            handler: AgentController.agent_create_admin,
        },
        // login: {
        // 	params: AgentValidator.agentlogin,
        // 	handler: AgentController.agentlogin,
        // },

        // verifypassword: {
        // 	params: AgentValidator.agent_verifypassword,
        // 	handler: AgentController.agent_verifypassword
        // },

        changepassword: {
        	params: AgentValidator.agent_changePassword,
        	handler: AgentController.agent_changePassword
        },

        // forgetpassword: {
        // 	params: AgentValidator.agent_forgetpassword,
        // 	handler: AgentController.agent_forgetpassword
        // },

        // verify_changepassword: {
        // 	params: AgentValidator.agent_verify_changepassword,
        // 	handler: AgentController.agent_verify_changepassword
        // },

        // count_sessions: {
        // 	params: AgentValidator.agent_count_sessions,
        // 	handler: AgentController.agent_count_sessions
        // },

        // close_allsessions: {
        // 	params: AgentValidator.agent__close_allsessions,
        // 	handler: AgentController.agent_close_allsessions
        // },

        // logout: {
        // 	params: AgentValidator.agent_logout,
        // 	handler: AgentController.agent_logout
        // },

        agent_getbyid: {
            params: AgentController.agent_getbyid,
            handler: AgentController.agent_getbyid
        },
        agent_getAll: {
            params: AgentController.agent_getAll,
            handler: AgentController.agent_getAll
        },
        getAgencyByLang: {
            params: AgentController.getAgencyByLang,
            handler: AgentController.getAgencyByLang
        },
        agent_getApproved: {
            params: AgentController.agent_getApproved,
            handler: AgentController.agent_getApproved
        },
        update: {
            params: AgentController.update,
            handler: AgentController.update
        },
        status: {
            params: AgentController.agent_status,
            handler: AgentController.agent_status
        },
        remove: {
            params: AgentController.agent_remove,
            handler: AgentController.agent_remove
        },



    },

    methods: {
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

        verifyIfLogged(ctx) {

            if (ctx.meta.user !== undefined)
                return this.requestSuccess("User Logged", true);
            else
                return this.requestError(CodeTypes.USERS_NOT_LOGGED_ERROR);
        },
        generateHash(value) {

            return Promise.resolve(passwordHash.generate(value, { algorithm: 'sha256' }))
                .then((res) => this.requestSuccess("Password Encrypted", res));
        }
    },

    created() {
        // Create Promisify encode & verify methods
        // this.encode = Promise.promisify(jwt.sign);
    }
};