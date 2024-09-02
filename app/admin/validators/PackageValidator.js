"use strict";

module.exports = {
    create: {
        hotelid: {type: "number", min: 1,required: true},
		packagecost: {type: "number", min: 1,required: true},
		isoffer: {type: "number", min: 1,optional: true},
        offerpercent: {type: "number", min: 1,optional: true},
        offercost: {type: "number", min: 1,optional: true},
        status: {type: "number", min: 1,required: true},
		language: "array",
		service:"array",
        photopath: {type: "string", min: 4,required: true}
    },
    getall: {
        hotelid: {type: "string", min: 1,required: true},
        status: {type: "string", min: 1,required: true}
    },
    get: {
        id: {type: "string", min: 1,required: true},
        status: {type: "string", min: 1,required: true}
    },
    update: {
        id: {type: "number", min: 1,required: true},
        hotelid: {type: "number", min: 1,required: true},
        packagecost: {type: "number", min: 1,required: true},
        isoffer: {type: "number", min: 1,optional: true},
        offerpercent: {type: "number", min: 1,optional: true},
        offercost: {type: "number", min: 1,optional: true},
        status: {type: "number", min: 1,required: true},
		language: "array",
		service:"array"
	},
	admin_getAll : {
		status: {type: "string", min: 1,required: true}
	},
    status: {
        id: {type: "string", min: 1,required: true},
        status: {type: "string", min: 1,required: true}
    },
    remove: {
        id: {type: "string", min: 1,required: true}
    }
}
