"use strict";

module.exports = {
    create: {
        photopath: {type: "string", min: 8,required: true},
        status: {type: "number", min: 1,required: true},
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
        id: {type: "number", min: 1,required: true},    
        photopath: {type: "string", min: 4,required: true},   
        language: "array",
        status: {type: "number", min: 1,required: true},    },
    status: {
        id: "number",
        status: 'number'
    },
    remove: {
        id: "string"
    }
}