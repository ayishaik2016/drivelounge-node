"use strict";

module.exports = {
    create: {
        email: {type: "string", min: 1,required: true},
        password: {type: "string", min: 4,max:16,required: true},
        confirmpassword: {type: "string", min: 4, max: 16,required: true},
        contactnumber: {type: "string", min: 4, max:12,required: true},
        description: {type: "string", min: 4,required: true},
        shortdescription: { type: "string", min: 4, required: true},
        areaid: {type: "number", min: 1,required: true},
        cityid: {type: "number", min: 1,required: true},
        countryid: {type: "number", min: 1,required: true},
        devicetype: {type: "string", min: 1,required: true},
        devicetoken: {type: "string", min: 4,required: true},
        location: {type: "string", min: 4,required: true},
        hotelstatusid: {type: "number", min: 1,required: true},
        photopath: {type: "string", min: 10, required: true},
        language: "array",
        category: "array",
        vat: {type: "number", min: 1,required: true},
        status: {type: "number", min: 1,required: true}
    },
    admin_update: {
        email: {type: "string", min: 4,required: true},
        contactnumber: {type: "string", min: 4,max:12,required: true},
        description: {type: "string", min: 4,required: true},
        shortdescription: { type: "string", min: 4, required: true},
        areaid: {type: "number", min: 1,required: true},
        cityid: {type: "number", min: 1,required: true},
        countryid: {type: "number", min: 1,required: true},
        devicetype: {type: "string", min: 1,required: true},
        devicetoken: {type: "string", min: 4,required: true},
        location: {type: "string", min: 4,required: true},
        hotelstatusid: {type: "number", min: 1,required: true},
        vat: {type: "number", min: 1,required: true},
        category: "array",
        photopath: {type: "string", min: 10, required: true},
        status: {type: "number", min: 1,required: true},
        language: "array",
    },
    getall: {
        status: {type: "string", min: 1,required: true},
	},
	searchHotelByCity: {
		status: {type: "string", min: 1,required: true},
		address: {type: "string"},
		date:{type: "string"}
	},
    getAll_Web: {
        status: {type: "string", min: 1,required: true},
        userid: {type: "string", min: 1,required: true},
    },
    get: {
        id: {type: "string", min: 1,required: true},
        status:{type: "string", min: 1,required: true},
    },
    hotellist_category:{
        categoryid: {type: "string", min: 1,required: true},
    },
    favhotelcreate:{
        userid: {type: "number", min: 1,required: true},
        hotelid: {type: "number", min: 1,required: true},
    },
    favhoteluser: {
        userid: {type: "string", min: 1,required: true},
    },
    update: {
		id: {type: "number", min: 1,required: true},
		languageid: {type: "number", min: 1,required: true},
        hotelname: {type: "string", min: 4,required: true},
        description: {type: "string", min: 4,required: true},
        shortdescription: { type: "string", min: 4, required: true},
		location: {type: "string", min: 4,required: true},
		email: {type: "string", min: 4,required: true},
        contactnumber: {type: "string", min: 4,max:12,required: true},
        photopath: {type: "string", min: 10, required: true},
    },
    status: {
        id: {type: "string", min: 1,required: true},
        status: {type: "string", min: 1,required: true}
    },
    remove: {
        id: {type: "string", min: 1,required: true}
    },
    otp_verify:{
        email: {type: "string", min: 1,required: true}
    },
    booking_report: {
        hotelid: {type: "string", min: 1,required: true}
    },
    booking_count: {
        hotelid: {type: "string", min: 1,required: true},
        status: {type: "string", min: 1,required: true}
    },
    hotel_timeget: {
        hotelid: {type: "string", min: 1,required: true}
    },
    hotel_timeupdate: {
        starttime: {type: "string", min: 3,required: true},
        endtime: {type: "string", min: 3,required: true},
        hotelstatus: {type: "number", min: 1,required: true},
        id: {type: "number", min: 1,required: true}
    },
    hotel_timestatus: {
        id: {type: "number", min: 1,required: true},
        hotelstatus: {type: "number", min: 1,required: true}
    },
    hotel_images: {
        hotelid: {type: "string", min: 1,required: true}
    },

    hotel_imgremove: {
        id: {type: "string", min: 1,required: true}
	},
	hotelusers: {
		hotelid: {type: "string", min: 1,required: true}
	}
}
