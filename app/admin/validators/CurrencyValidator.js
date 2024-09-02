"use strict";

module.exports = {
  create: {
    name: { type: "string", min: 1, required: true },
    code: { type: "string", min: 1, required: true },
  },
  createConversion: {
    from: { type: "string", min: 1, required: true },
    to: { type: "string", min: 1, required: true },
    equalto: { type: "string", min: 1, required: true },
  },
  updateConversion: {
    id: { type: "number", min: 1, required: true },
    from: { type: "string", min: 1, required: true },
    to: { type: "string", min: 1, required: true },
    equalto: { type: "string", min: 1, required: true },
  },
  getall: {},
  getAllConversions: {},
  getConversion: {
    code: { type: "string", min: 1, required: true },
  },
  update: {
    id: { type: "number", min: 1, required: true },
    name: { type: "string", min: 1, required: true },
    code: { type: "string", min: 1, required: true },
  },
  updateStatus: {
    code: { type: "string", min: 1, required: true },
    status: { type: "number", min: 0, max: 1, required: true },
  },
};
