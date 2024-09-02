"use strict";

module.exports = {
    create: {
        // userid: { type: "number", min: 1, required: true },
        // carid: { type: "number", min: 1, required: true },
        // agentid: { type: "number", min: 1, required: true },
        // rating: { type: "number", min: 1, required: true }
    },
    getall: {
        status: { type: "string", min: 1, required: true }
    },
    get: {
        // id: { type: "number", min: 1, required: true },
        // status: { type: "number", min: 1, required: true }
    },
    update: {
        // id: { type: "number", min: 1, required: true },
        // countrycode: { type: "string", min: 1, required: true },
        // language: "array",
    },
    status: {
        // id: { type: "number", min: 1, required: true },
        // status: { type: "number", min: 1, required: true }
    },
    remove: {
        id: { type: "string", min: 1, required: true }
    },
    review_approval: {
        id: { type: "number", min: 1, required: true }
    },
    review_count: {
        id: { type: "number", min: 1, required: true }
    },

    user_reviews: {
        userid: { type: "string", min: 1, required: true },
        status: { type: "string", min: 1, required: true }
    },

    hotel_reviews: {
        hotelid: { type: "string", min: 1, required: true },
        status: { type: "string", min: 1, required: true }
    }
}