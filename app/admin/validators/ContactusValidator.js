"use strict";

module.exports = {
    create: {
        firstname: {type: "string", min: 3,required: true},
        // lastname: {type: "string", min: 3,required: true},
        email: {type: "string", min: 3,required: true},
        phone: {type: "string", min: 3,required: true},
        message: {type: "string", min: 3,required: true},    },
    getall: {
        status: {type: "string", min: 1,required: true},    },
    get: {
        id: {type: "string", min: 1,required: true},
        status: {type: "string", min: 1,required: true},    },
    update: {
        
    },
    status: {
        id: {type: "string", min: 1,required: true},
        status: {type: "string", min: 1,required: true},
    },
    remove: {
        id: {type: "string", min: 1,required: true},
    }
}
