"use strict";

const Request = require("../mixins/request.mixin");
const CurrencyValidator = require("../app/admin/validators/CurrencyValidator");
const CurrencyController = require("../app/admin/controllers/CurrencyController");

module.exports = {
  name: "currency",

  mixins: [Request],

  actions: {
    create: {
      params: CurrencyValidator.create,
      handler: CurrencyController.create,
    },
    update: {
      params: CurrencyValidator.update,
      handler: CurrencyController.update,
    },
    updateStatus: {
      params: CurrencyValidator.updateStatus,
      handler: CurrencyController.updateStatus,
    },
    getAll: {
      params: CurrencyValidator.getAll,
      handler: CurrencyController.getAll,
    },
    getAllActive: {
      params: CurrencyValidator.getAll,
      handler: CurrencyController.getAllActive,
    },
    createConversion: {
      params: CurrencyValidator.createConversion,
      handler: CurrencyController.createConversion,
    },
    updateConversion: {
      params: CurrencyValidator.updateConversion,
      handler: CurrencyController.updateConversion,
    },
    getAllConversions: {
      params: CurrencyValidator.getAllConversions,
      handler: CurrencyController.getAllConversions,
    },
    getConversion: {
      params: CurrencyValidator.getConversion,
      handler: CurrencyController.getConversion,
    },
  },

  methods: {},

  created() {},
};
