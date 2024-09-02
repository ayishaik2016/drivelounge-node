"use strict";

 

module.exports = {
    
     create: {
        firstname: {type: "string",required: true},
        lastname: {type: "string", min: 4,required: true},
        username: {type:"string",min: 4,required: true},
        email: {type: "string", min: 6,required: true,unique: true},
        password: {type: "string", min: 6,required: true,unique: true},
        usertypeid: {type: "number", required: true},
        roleid: {type: "string", required: true},
        contactnumber: {type: "string", min: 4,max:12,required: true},
        status: {type: "number",required: true},
        created_by: {type: "number", optional: true},
        created_at: {type: "string", optional: true }

    },
    update: {
        firstname: {type: "string",required: true},
        lastname: {type: "string", min: 4,required: true},
        username: {type:"string",min: 4,required: true},
        email: {type: "string", min: 6,required: true,unique: true},
        //password: {type: "string", min: 6,required: true,unique: true},
        usertypeid: {type: "number", required: true},
        contactnumber: {type: "string", min: 4,max:12,required: true},
     //   roleid: {type: "string", required: true},
        status: {type: "number", required: true},
        created_by: {type: "number", optional: true},
        updated_at: {type: "string" ,  optional: true },
    },
    getall: { 
       // user_id: {type: "string", min: 1,required: true},

    },
    remove: {
        id: "string"
    }
  /*  get: {
        id: "number",
        status: "number"
    },
    update: {
        id: "number",
        rolename: "string",
        status: 'number'
    },
    status: {
        id: "number",
        status: 'number'
    },*/
}
