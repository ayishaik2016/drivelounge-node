"use strict";

module.exports = {
    create: {
        countryid: {type: "number", min: 1,required: true},
        language: "array",
    },
    getall: {
        status: {type: "string", min: 1,required: true},
    },
    getAll_Web: {
        status: {type: "string", min: 1,required: true},
    },
    get: {
        id: {type: "string", min: 1,required: true},
        status: {type: "string", min: 1,required: true},
    },
    update: {
        id: {type: "number", min: 1,required: true},
        countryid: {type: "number", min: 1,required: true},
        language: "array",
        status: {type: "number", min: 1,required: true},
    },
    status: {
        id: {type: "string", min: 1,required: true},
        status: {type: "string", min: 1,required: true},
    },
    remove: {
        id: {type: "string", min: 1,required: true},
    }
}