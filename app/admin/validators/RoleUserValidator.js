"use strict";

module.exports = {
    create: {
		roleid: "number",
		userid: "number"
    },
    getall: {
        status: "number"
    },
    get: {
        id: "number",
        status: "number"
    },
    update: {
		id:"number",
        userid: "number",
        roleid: "number",
        status: 'number'
    },
    status: {
        id: "number",
        status: 'number'
    },
    remove: {
        id: "number"
    }
}
