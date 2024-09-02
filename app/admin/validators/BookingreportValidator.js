"use strict";

module.exports = {
    getall: {
		limit: {type: "string", min: 1,required: true},
		skip: {type: "string", min: 1,required: true},
    },
    remove: {
        id: "number"
	}
}
