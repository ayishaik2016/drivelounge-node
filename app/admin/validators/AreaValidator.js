"use strict";

module.exports = {
    create: {
        cityid: "number",
        language: "array",
    },
    getall: {
        status: "string"
    },
    get: {
        id: "string",
        status: "string"
    },
    update: {
        id: "number",
        cityid: "number",
        language: "array",
        status: 'number'
    },
    status: {
        id: "number",
        status: 'number'
    },
    remove: {
        id: "string"
    }
}