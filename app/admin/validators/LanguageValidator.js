"use strict";

 

module.exports = {
    
     create: {
        languagename: {type: "string",required: true},
        languagecode: {type: "string",required: true}
    },
    update: { 
        languagename: {type: "string",required: true},
        languagecode: {type: "string", required: true}
    },
    remove: {
        id: "number"
    }
}
