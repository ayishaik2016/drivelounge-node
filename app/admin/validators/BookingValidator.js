"use strict";

module.exports = {
    create: {
        // agentid: {type: "number", min: 1,required: true},
        // carid: {type: "number", min: 1,required: true},       
        // pickup_location: {type: "string", min: 3,required: true},
        // pickup_date: {type: "date", required: true},
        // couponcode: {type: "string", min: 4,required: true},
        // subtotal: {type: "number", min: 1,required: true},
        // totalcost: {type: "number", min: 1,required: true},
        // devicetype: {type: "string", min: 2,required: true},        
        // devicetoken: {type: "string", min: 3,required: true},
    },
    getall: {
        status: "string"
    },
    getAll_user: {
        userid: "string",
        status: "string"
    },
    get: {
        id: "string",
        status: "string"
    },
    update: {
        // id: {type: "number", min: 1,required: true},
        // booking_status: {type: "number", min: 1,required: true},
        // status: {type: "number", min: 1,required: true},
    },
    status: {
        id: "string",
        status: 'string'
    },
    remove: {
        id: "string"
    },
    activity_log: {
        name: "string"
    },
    getAll_hotel: {
        hotelid: "string",
        status: "string"
    },
    earnings: {
        customerid: "string"
    },
    earnings_list: {
        customerid: "string"
    },
    // notification_count: {
    //     hotelid: {type: "string", min: 1,required: true},
    // }
}