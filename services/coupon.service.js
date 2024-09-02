"use strict";

const ApiGateway = require("moleculer-web");
var couponCode = require('coupon-code');
var Promise = require('bluebird');
const Request = require("../mixins/request.mixin");
const Busboy = require("busboy");
const pipe = require("pipe");
const fs = require("fs");
const passwordHash = require('password-hash');
const CouponValidator = require("../app/admin/validators/CouponValidator");
const CouponController = require("../app/admin/controllers/CouponController");
const Database = require("../adapters/Database");
const img_path = __dirname;
const { compareAsc } = require('date-fns/compareAsc');

const UserCoupon = new Database('Dusercoupon');
const Coupon = new Database('Dcoupon');

module.exports = {
    name: "coupon",

    mixins: [
        Request
    ],

    actions: {
        generate_couponcode: {
            params: CouponValidator.generate_couponcode,
            handler: CouponController.generate_couponcode,
        },
        getuseragencylist: {
            params: CouponValidator.getuseragencylist,
            handler: CouponController.getuseragencylist,
        },
        couponcode_validate: {
            params: CouponValidator.couponcode_validate,
            handler: CouponController.couponcode_validate,
        },
        coupontype_create: {
            params: CouponValidator.coupontype_create,
            handler: CouponController.coupontype_create,
        },
        coupontype_get: {
            params: CouponValidator.coupontype_get,
            handler: CouponController.coupontype_get,
        },
        couponapptype_create: {
            params: CouponValidator.couponapptype_create,
            handler: CouponController.couponapptype_create,
        },
        couponapptype_get: {
            params: CouponValidator.couponapptype_get,
            handler: CouponController.couponapptype_get,
        },
        create: {
            params: CouponValidator.create,
            handler: CouponController.create,
        },
        update: {
            params: CouponValidator.update,
            handler: CouponController.update,
        },
        remove: {
            params: CouponValidator.remove,
            handler: CouponController.remove,
        },
        // get: {
        // 	params: AppconfigValidator.get,
        // 	handler: AppconfigController.get,
        // },
        getAll: {
            params: CouponValidator.getAll,
            handler: CouponController.getAll,
        },
        getcouponvalue: {
            params: CouponValidator.getcouponvalue,
            handler: CouponController.getcouponvalue,
        },
        getcoupon: {
            params: CouponValidator.getcoupon,
            handler: CouponController.getcoupon,
        },
    },

    methods: {

        // this is code that checks uniqueness and returns a promise
        // check(code, count) {
        // 	return new Promise(function(resolve, reject) {				

        // 		++count;
        // 		console.log(count);
        // 		// first resolve with false, on second try resolve with true
        // 		if (count === 1) {
        // 			console.log(code + ' is not unique');
        // 			resolve(false);
        // 		} else {
        // 			console.log(code + ' is unique');
        // 			resolve(true);
        // 		}

        // 	});
        // },

        generateUniqueCode() {
            var count = 0;
            return Promise.resolve(couponCode.generate())
                .then(res => {
                    return this.requestSuccess("Coupon Code generated", res);
                    console.log("res");
                    // return this.check(res, count)
                    // 	.then(function(result) {
                    // 		if (result) return code;
                    // 		else return generateUniqueCode;
                    // });
                });
        },

        IsExceedMaximumRedumptionValue(ctx, maxRedumptionValue) {
            let usercoupon = {
                'userid': ctx.params.userid,
                'couponcode': ctx.params.couponcode,
                'status': 1
            };

            return UserCoupon.find(ctx, { query: usercoupon })
                .then((res) => {
                    if (res.data.length) {

                        let maxvalue = res.data.reduce((usercoupon, sum) => {
                            sum += usercoupon.couponvalue;
                        }, 0);

                        if (maxvalue <= maxRedumptionValue)
                            return true;
                        else
                            return false;
                    }
                })
        },
        isCouponExpired(expiryDate) {
            console.log(compareAsc(new Date(), expiryDate));
            return compareAsc(new Date(), expiryDate);
        }

    },

    created() {}
};