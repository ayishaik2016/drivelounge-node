"use strict";

const ApiGateway = require("moleculer-web");
const Request = require("../mixins/request.mixin");
const Busboy = require("busboy");
const pipe = require("pipe");
const fs = require("fs");
const CarValidator = require("../app/common/validators/CarValidator");
const CarController = require("../app/common/controllers/CarController");
const img_path = __dirname;

module.exports = {
    name: "car",

    mixins: [
        Request
    ],

    actions: {
        carbrand_create: {
            params: CarValidator.carbrand_create,
            handler: CarController.carbrand_create,
        },
        carbrand_get: {
            params: CarValidator.carbrand_get,
            handler: CarController.carbrand_get,
        },
        carbrand_remove: {
            params: CarValidator.carbrand_remove,
            handler: CarController.carbrand_remove,
        },
        carbrand_update: {
            params: CarValidator.carbrand_update,
            handler: CarController.carbrand_update,
        },

        cartype_create: {
            params: CarValidator.cartype_create,
            handler: CarController.cartype_create,
        },
        cartype_get: {
            params: CarValidator.cartype_get,
            handler: CarController.cartype_get,
        },
        cartype_remove: {
            params: CarValidator.cartype_remove,
            handler: CarController.cartype_remove,
        },
        cartype_update: {
            params: CarValidator.cartype_update,
            handler: CarController.cartype_update,
        },

        carmodel_create: {
            params: CarValidator.carmodel_create,
            handler: CarController.carmodel_create,
        },
        carmodel_get: {
            params: CarValidator.carmodel_get,
            handler: CarController.carmodel_get,
        },
        carmodel_remove: {
            params: CarValidator.carmodel_remove,
            handler: CarController.carmodel_remove,
        },

        caryear_create: {
            params: CarValidator.caryear_create,
            handler: CarController.caryear_create,
        },
        caryear_get: {
            params: CarValidator.caryear_get,
            handler: CarController.caryear_get,
        },
        caryear_remove: {
            params: CarValidator.caryear_remove,
            handler: CarController.caryear_remove,
        },

        caraction_create: {
            params: CarValidator.caraction_create,
            handler: CarController.caraction_create,
        },
        caraction_get: {
            params: CarValidator.caraction_get,
            handler: CarController.caraction_get,
        },
        caraction_remove: {
            params: CarValidator.caraction_remove,
            handler: CarController.caraction_remove,
        },

        carinsurance_create: {
            params: CarValidator.carinsurance_create,
            handler: CarController.carinsurance_create,
        },
        carinsurance_get: {
            params: CarValidator.carinsurance_get,
            handler: CarController.carinsurance_get,
        },
        carinsurance_remove: {
            params: CarValidator.carinsurance_remove,
            handler: CarController.carinsurance_remove,
        },

        carmilege_create: {
            params: CarValidator.carmilege_create,
            handler: CarController.carmilege_create,
        },
        carmilege_get: {
            params: CarValidator.carmilege_get,
            handler: CarController.carmilege_get,
        },
        carmilege_remove: {
            params: CarValidator.carmilege_remove,
            handler: CarController.carmilege_remove,
        },

        carcylinder_create: {
            params: CarValidator.carcylinder_create,
            handler: CarController.carcylinder_create,
        },
        carcylinder_get: {
            params: CarValidator.carcylinder_get,
            handler: CarController.carcylinder_get,
        },
        carcylinder_remove: {
            params: CarValidator.carcylinder_remove,
            handler: CarController.carcylinder_remove,
        },

        cardriver_create: {
            params: CarValidator.cardriver_create,
            handler: CarController.cardriver_create,
        },
        cardriver_get: {
            params: CarValidator.cardriver_get,
            handler: CarController.cardriver_get,
        },
        cardriver_remove: {
            params: CarValidator.cardriver_remove,
            handler: CarController.cardriver_remove,
        },


        cartransmission_create: {
            params: CarValidator.cartransmission_create,
            handler: CarController.cartransmission_create,
        },
        cartransmission_get: {
            params: CarValidator.cartransmission_get,
            handler: CarController.cartransmission_get,
        },
        cartransmission_remove: {
            params: CarValidator.cartransmission_remove,
            handler: CarController.cartransmission_remove,
        },

        carseat_create: {
            params: CarValidator.carseat_create,
            handler: CarController.carseat_create,
        },
        carseat_get: {
            params: CarValidator.carseat_get,
            handler: CarController.carseat_get,
        },
        carseat_remove: {
            params: CarValidator.carseat_remove,
            handler: CarController.carseat_remove,
        },

        carspeed_create: {
            params: CarValidator.carspeed_create,
            handler: CarController.carspeed_create,
        },
        carspeed_get: {
            params: CarValidator.carspeed_get,
            handler: CarController.carspeed_get,
        },
        carspeed_remove: {
            params: CarValidator.carspeed_remove,
            handler: CarController.carspeed_remove,
        },

        // Createnew Car Information
        car_create: {
            params: CarValidator.car_create,
            handler: CarController.car_create,
        },
        car_get: {
            params: CarValidator.car_get,
            handler: CarController.car_get,
        },
        car_update: {
            params: CarValidator.car_update,
            handler: CarController.car_update,
        },
        car_remove: {
            params: CarValidator.car_remove,
            handler: CarController.car_remove,
        },

        get_carinformation: {
            params: CarValidator.get_carinformation,
            handler: CarController.get_carinformation,
        },
        get_carmanagement: {
            params: CarValidator.get_carmanagement,
            handler: CarController.get_carmanagement,
        },
        get_carmanagement_filter: {
            params: CarValidator.get_carmanagement_filter,
            handler: CarController.get_carmanagement_filter,
        },
        get_carbycarid: {
            params: CarValidator.get_carbycarid,
            handler: CarController.get_carbycarid,
        },
        remove_carmanagement: {
            params: CarValidator.remove_carmanagement,
            handler: CarController.remove_carmanagement,
        },

        get_cardisplayinfo: {
            params: CarValidator.get_cardisplayinfo,
            handler: CarController.get_cardisplayinfo,
        },
        get_carfullinfolist: {
            params: CarValidator.get_carfullinfolist,
            handler: CarController.get_carfullinfolist,
        },
        get_carinterrior: {
            params: CarValidator.get_carinterrior,
            handler: CarController.get_carinterrior,
        },
        get_carreview: {
            params: CarValidator.get_carreview,
            handler: CarController.get_carreview,
        },
        checkisavailable: {
            params: CarValidator.get_carreview,
            handler: CarController.checkisavailable,
        },
        set_CarStatus: {
            handler: CarController.setCarStatus
        },
        filterinfo: {
            params: CarValidator.filterinfo,
            handler: CarController.filterinfo,
        }
    },

    methods: {},

    created() {}
};