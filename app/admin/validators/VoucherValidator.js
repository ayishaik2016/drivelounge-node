"use strict";

module.exports = {
    create: {
        vouchercouponname: {type: "string", min: 4, max:35,required: true},
        couponcode: {type: "string", min: 4, max:10,required: true},
        maxredeem_amt: {type: "number", min: 1, required: true},
        vouchervalue: {type: "number", min: 1, required: true},
        minvalue: {type: "number", min: 1, required: true},
        startdate: {type: "string", min: 4,required: true},
        expirydate: {type: "string", min: 4, required: true},     
        isallvendor: {type: "number", required: true},
        isalluser: {type: "number", required: true},  
        apptype: {type: "number", required: true},
        vouchertype: {type: "number", required: true},
        vendors: "array",
        users: "array",
        repetivetern: {type: "number", required: true},
        voucher_image: {type: "string", min: 7, required: true},
    },
    vendor_create: {
        vouchercouponname: {type: "string", min: 4, max:35,required: true},
        couponcode: {type: "string", min: 4, max:10,required: true},
        maxredeem_amt: {type: "number", min: 1, required: true},
        vouchervalue: {type: "number", min: 1, required: true},
        minvalue: {type: "number", min: 1, required: true},
        startdate: {type: "string", min: 4,required: true},
        expirydate: {type: "string", min: 4, required: true},      
        isalluser: {type: "number", required: true},  
        apptype: {type: "number", required: true},
        vouchertype: {type: "number", required: true},
        users: "array",
        repetivetern: {type: "number", required: true},
        voucher_image: {type: "string", min: 7, required: true},
    },
    getall: {
        status: "string",
    },
    vendor_voucher: {
        vendorid: "string",
        status: "string",
    },
    get: {
        id: "string",
    },
    // voucher_code: {
    //     digit: "number",
    // },
    coupon_get: {
        couponcode: "string"
    },
    update: {
        vouchercouponname: {type: "string", min: 4, max:35,required: true},
        couponcode: {type: "string", min: 4, max:10,required: true},
        maxredeem_amt: {type: "number", min: 1, required: true},
        vouchervalue: {type: "number", min: 1, required: true},
        minvalue: {type: "number", min: 1, required: true},
        startdate: {type: "string", min: 4,required: true},
        expirydate: {type: "string", min: 4, required: true},     
        isallvendor: {type: "number", required: true},
        isalluser: {type: "number", required: true},  
        apptype: {type: "number", required: true},
        vouchertype: {type: "number", required: true},
        vendors: "array",
        users: "array",
        repetivetern: {type: "number", required: true},
        voucher_image: {type: "string", min: 7, required: true},
    },
    status: {
        id: "string",
        status: 'string'
    },
    remove: {
        id: "string"
    },
    get_apptype: {
        id: "string"
    },
    get_vouchertype: {
        id: "string"
    },
}
