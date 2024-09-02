"use strict";

module.exports = {
    login: {
        username: "string",
        password: "string"
    },
    loginOtp: {
        username: "string",
        otp: "string",
        otpreference: "string"
    },
    loginOtpResend: {
        username: "string",
        otpreference: "string"
    },
    user_login: {
        email: "string",
        password: "string"
    },
    agent_login: {
        email: "string",
        password: "string"
    },
    verifyPassword: {
        username: "string",
        password: "string"
    },
    verifyOtp: {
        username: "string",
        otpreference: "string",
        otp: "string"
    },
    resendOtp: {
        username: "string",
        otpreference: "string"
    },
    verify_change_Password: {
        id: "number",
        password: "string"
    },
    user_verifyPassword: {
        email: "string",
        password: "string"
    },
    verifyuser_change_Password: {
        id: "number",
        password: "string"
    },
    verifyToken: {
        token: "string"
    },
    countSessions: {},
    closeAllSessions: { },
    admin_resetPassword: {
        email: "string"
    },
    user_resetPassword: {
        email: "string"
    },
    agent_resetPassword: {
        email: "string"
    },
    agent_reset: {
        password: "string"
    },
    verifyagent_change_Password: {
        id: "number",
        password: "string"
    },
    logout: { },
    admin_profile: {
        firstname: "string",
        lastname: "string",
        //usertypeid: "string",
        email: "string"
    }
}

/* const Joi = require('joi');

module.exports = {
    login: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
    }),
    verifyPassword: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
    }),
    verifyToken: Joi.object().keys({
        token: Joi.string().required()
    }),
    countSessions: {},
    closeAllSessions: { },
    logout: { },
} */
