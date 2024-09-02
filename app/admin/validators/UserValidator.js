"use strict";

module.exports = {
    create: {
        firstname: {type: "string", min: 4,required: true},
        lastname: {type: "string", min: 4,required: true},
        password: {type: "string", min: 6, max: 16, required: true},
        confirmpassword: {type: "string", min: 6, max: 16, required: true},
        email: {type: "string", min: 4,required: true},
        contactnumber: {type: "string", min: 4,max:12,required: true},
        devicetype: {type: "string", min: 1,optional: true},
        devicetoken: {type: "string", min: 4,optional: true}
    },
    admin_usrcreate: {
        firstname: {type: "string", min: 4,required: true},
        lastname: {type: "string", min: 4,required: true},
        email: {type: "string", min: 4,required: true},
        contactnumber: {type: "string", required: true},
        devicetype: {type: "string",required: true},
        devicetoken: {type: "string",required: true},
        status: {type: "number", required: true}
    },
    getall: {
        status: {type: "string", min: 1,required: true},
        usertypeid: {type: "string", min: 1,required: true}
    },
    get: {
        id: {type: "string", min: 1,required: true},
    },
    update: {
        id: {type: "number", min: 1,required: true},
        firstname: {type: "string", min: 4,required: true},
        lastname: {type: "string", min: 4,required: true},
        email: {type: "string", min: 4,required: true},
        contactnumber: {type: "string", min: 4,max:12,required: true},
        status: {type: "number", required: true}
        // devicetype: {type: "string", min: 1,required: true},
        // devicetoken: {type: "string", min: 4,required: true}
    },
    status: {
        id: {type: "string", min: 1,required: true},
        status: {type: "string", min: 1,required: true}
    },
    remove: {
        id: {type: "string", min: 1,required: true}
    },
    otp_verify:{
        email: {type: "string", min: 4,required: true}
    }
}