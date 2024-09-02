"use strict";

module.exports = {
    create: {
        hotelid: {type: "number", min: 1,required: true},
        categoryid: {type: "number", min: 1,required: true},
        servicecost: {type: "number", min: 1,required: true},
        isoffer: {type: "number",  optional: true},
        offerpercent: {type: "number",  optional: true},
        offercost: {type: "number",  optional: true},
        status: {type: "number", min: 1,required: true},
        language: "array",
        photopath: {type: "string", min: 1,required: true}
    },
    getall: {
        hotelid: {type: "string", min: 1,required: true},
        status: {type: "string", min: 1,required: true}
	},
	admin_getAll: {
		status: {type: "string", min: 1,required: true}
	},
    get: {
        id: {type: "string", min: 1,required: true},
        status: {type: "string", min: 1,required: true}
    },
    update: {
        id: {type: "number", min: 1,required: true},
        hotelid: {type: "number", min: 1,required: true},
        categoryid: {type: "number", min: 1,required: true},
        servicecost: {type: "number", min: 1,required: true},
        isoffer: {type: "number", optional: true},
        offerpercent: {type: "number",  optional: true},
        offercost: {type: "number",  optional: true},
        status: {type: "number", min: 1,required: true},
        language: "array",
    },
    status: {
        id: {type: "string", min: 1,required: true},
        status: {type: "string", min: 1,required: true}
    },
    remove: {
        id: {type: "string", min: 1,required: true}
    }
}
