"use strict";

 

module.exports = {
    
     create: {
        roleid: {type: "number",required: true},
        modules: {type: "string", min: 4,required: true},
        access: {type:"string",required: true},
        status: {type: "number", min: 1,required: true},
        created_by: {type: "number", min: 1,required: true},
        created_at: {type: "string", optional: true }   

    },
  /*  update: {

        roleid: {type: "number",required: true},
        modules: {type: "string", min: 4,required: true},
        access: {type:"string",min: 4,required: true},
        status: {type: "number", min: 1,required: true},
        update_by: {type: "number", min: 1,required: true},
        update_at: {type: "string", optional: true }   

    },*/
    getall: { 
       // user_id: {type: "number", min: 1,required: true},

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
    },
    remove: {
        id: "number"
    }*/
}
