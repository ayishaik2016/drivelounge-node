"use strict";

const ApiGateway = require("moleculer-web");
const Request = require("../mixins/request.mixin");
const Busboy = require("busboy");
const pipe = require("pipe");
const fs = require("fs");
const passwordHash = require('password-hash');
const BookingValidator = require("../app/admin/validators/BookingValidator");
const BookingController = require("../app/admin/controllers/BookingController");
const img_path = __dirname;
const { compareAsc } = require('date-fns/compareAsc');

module.exports = {
    name: "booking",

    mixins: [
        Request
    ],

    actions: {
        create: {
            params: BookingValidator.create,
            handler: BookingController.create,
        },

        getAll: {
            params: BookingValidator.getAll,
            handler: BookingController.getAll,
        },
        get_booking_all: {
            params: BookingValidator.get_booking_all,
            handler: BookingController.get_booking_all,
        },
        getAll_user: {
            params: BookingValidator.getAll_user,
            handler: BookingController.getAll_user,
        },

        booking_cancel: {
            params: BookingValidator.booking_cancel,
            handler: BookingController.booking_cancel,
        },

        change_request: {
            params: BookingValidator.change_request,
            handler: BookingController.change_request,
        },

        get: {
            params: BookingValidator.get,
            handler: BookingController.get,
        },

        getbyid: {
            params: BookingValidator.get,
            handler: BookingController.getbyid,
        },

        getpayoption: {
            params: BookingValidator.getpayoption,
            handler: BookingController.getpayoption
        },
        getuserinfo: {
            params: BookingValidator.getuserinfo,
            handler: BookingController.getuserinfo
        },
        update: {
            params: BookingValidator.update,
            handler: BookingController.update,
        },
        update_info: {
            params: BookingValidator.update_info,
            handler: BookingController.update_info,
        },

        admin_pay: {
            params: BookingValidator.admin_pay,
            handler: BookingController.admin_pay,
        },

        getbookinginfo: {
            params: BookingValidator.getbookinginfo,
            handler: BookingController.getbookinginfo
        },
        getmybookinginfo: {
            params: BookingValidator.getmybookinginfo,
            handler: BookingController.getmybookinginfo
        },
        getbookingdates: {
            params: BookingValidator.getbookingdates,
            handler: BookingController.getbookingdates
        },
        getbookinginfobyid: {
            params: BookingValidator.getbookinginfobyid,
            handler: BookingController.getbookinginfobyid
        },
        tripstart: {
            params: BookingValidator.tripstart,
            handler: BookingController.tripstart
        },
        tripend: {
            params: BookingValidator.tripend,
            handler: BookingController.tripend
        },
        pickupimages: {
            params: BookingValidator.pickupimages,
            handler: BookingController.pickupimages
        },
        dropoffimages: {
            params: BookingValidator.dropoffimages,
            handler: BookingController.dropoffimages
        },
        status: {
            params: BookingValidator.status,
            handler: BookingController.status,
        },

        booking_status: {
            handler: BookingController.booking_status,
        },

        remove: {
            params: BookingValidator.remove,
            handler: BookingController.remove,
        },
        activity_log: {
            params: BookingValidator.activity_log,
            handler: BookingController.activity_log,
        },
        booking_status: {
            handler: BookingController.booking_status,
        },
        getAll_vendor: {
            params: BookingValidator.getAll_vendor,
            handler: BookingController.getAll_vendor,
        },
        earnings: {
            params: BookingValidator.earnings,
            handler: BookingController.earnings,
        },

        earnings_list: {
            params: BookingValidator.earnings_list,
            handler: BookingController.earnings_list,
        }
    },

    methods: {
        randombookingnum() {
            const str = Math.random();
            const stmr = str.toString();
            const rande = stmr.split(".");
            return rande[1].substr(2, 6);
        },
        isCouponExpired(expiryDate) {
            return compareAsc(new Date(), expiryDate);
        }
    },

    created() {}
};