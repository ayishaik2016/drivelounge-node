"use strict";

const Constants = require("../../plugin/constants");
const fs = require("fs");
const path = require("path");
// const Busboy = require('connect-busboy');
const Busboy = require('busboy');
var multer = require('multer');
var upload = multer();
module.exports = {
    bodyParsers: {
        json: false,
        urlencoded: false
    },

    path: "/upload/",
    onBeforeCall(ctx, route, req, res) {   
        console.log(req.url);
		// Set request headers to context meta
		ctx.meta.userAgent = req.headers["user-agent"];
		ctx.meta.platform = req.headers["host"];
		ctx.meta.clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    },
    roles: [Constants.ADMIN_ROLE],
    authorization: true,
    whitelist: [
    
        "upload.create"
    ],
    mappingPolicy: "restrict",
    aliases: {
        // File upload from HTML form and overwrite busboy config
        "POST upload": {
            type: "multipart",
            // Action level busboy config
            busboyConfig: {
                
                onPartsLimit(busboy, alias, svc) {
                    this.logger.info("Busboy parts limit!", busboy);
                },
                onFilesLimit(busboy, alias, svc) {
                    this.logger.info("Busboy file limit!", busboy);
                },
                onFieldsLimit(busboy, alias, svc) {
                    console.log(busboy)
                    console.log(alias)
                    console.log(svc)
                    this.logger.info("Busboy fields limit!", busboy);
                }
            },
            action: "upload.create",
        }
    }
}


// routes: [
//     {
//         path: "",

//         // You should disable body parsers
//         bodyParsers: {
//             json: false,
//             urlencoded: false
//         },

//         aliases: {
//             // File upload from HTML form
//             "POST /": "multipart:file.save",

//             // File upload from AJAX or cURL
//             "PUT /": "stream:file.save",

//             // File upload from AJAX or cURL with params
//             "PUT /:id": "stream:file.saveParams",

//             // File upload from HTML form and overwrite busboy config
//             "POST /single": {
//                 type: "multipart",
//                 // Action level busboy config
//                 busboyConfig: {
//                     limits: {
//                         files: 1
//                     },
//                     onPartsLimit(busboy, alias, svc) {
//                         this.logger.info("Busboy parts limit!", busboy);
//                     },
//                     onFilesLimit(busboy, alias, svc) {
//                         this.logger.info("Busboy file limit!", busboy);
//                     },
//                     onFieldsLimit(busboy, alias, svc) {
//                         this.logger.info("Busboy fields limit!", busboy);
//                     }
//                 },
//                 action: "file.save"
//             },

//             // File upload from HTML form and overwrite busboy config
//             "POST /multi": {
//                 type: "multipart",
//                 // Action level busboy config
//                 busboyConfig: {
//                     limits: {
//                         files: 3,
//                         fileSize: 1 * 1024 * 1024
//                     },
//                     onPartsLimit(busboy, alias, svc) {
//                         this.logger.info("Busboy parts limit!", busboy);
//                     },
//                     onFilesLimit(busboy, alias, svc) {
//                         this.logger.info("Busboy file limit!", busboy);
//                     },
//                     onFieldsLimit(busboy, alias, svc) {
//                         this.logger.info("Busboy fields limit!", busboy);
//                     }
//                 },
//                 action: "file.save"
//             }
//         },

//         // https://github.com/mscdex/busboy#busboy-methods
//         busboyConfig: {
//             limits: {
//                 files: 1
//             }
//         },

//         callOptions: {
//             meta: {
//                 a: 5
//             }
//         },

//         mappingPolicy: "restrict"
//     },

// ],