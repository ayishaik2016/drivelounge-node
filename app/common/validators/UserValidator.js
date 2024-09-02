"use strict";

module.exports = {
    create: {
        username: "string",
        password: "string"
    },
    getall: {
        id: "number"
    },
    // get: {
    //     username: "string"
    // },
    count: {},
    changeInfo: {
        age: "number"
    },
    changePassword: {
        // id: "number",
        // oldpassword: {type: "string", min: 6,max: 16,required: true},
        // newpassword: {type: "string", min: 6,max: 16,required: true},
        // confirmpassword: {type: "string", min: 6,max: 16,required: true},
    },
    user_changePassword: {
        // id: "number",
        // oldpassword: {type: "string", min: 6,max: 16,required: true},
        // newpassword: {type: "string", min: 6,max: 16,required: true},
        // confirmpassword: {type: "string", min: 6,max: 16,required: true},
    },
    agent_changePassword: {
        // id: "number",
        // oldpassword: {type: "string", min: 6,max: 16,required: true},
        // newpassword: {type: "string", min: 6,max: 16,required: true},
        // confirmpassword: {type: "string", min: 6,max: 16,required: true},
    },
    changeRole: {
        username: "string",
        role: "string"
    },
    remove: {
        password: "string"
    },
    banish: {
        username: "string"
    },
    removeAll: {
        password: "string"
    },
    createAdminIfNotExists: { },
}


/* const Joi = require('joi');

module.exports = {
    create: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
    }),
    getall: {},
    get: Joi.object().keys({
        username: Joi.string().required(),
    }),
    count: {},
    changeInfo: Joi.object().keys({
        age: Joi.string().required(),
    }),
    changePassword: Joi.object().keys({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
    }),
    changeRole: Joi.object().keys({
        username: Joi.string().required(),
        role: Joi.string().required(),
    }),
    remove: Joi.object().keys({
        password: Joi.string().required(),
    }),
    banish: Joi.object().keys({
        username: Joi.string().required(),
    }),
    removeAll: Joi.object().keys({
        password: Joi.string().required(),
    }),
    createAdminIfNotExists: { },
} */