"use strict";

module.exports = {
    bodyParsers: {
        json: true,
    },
    path: "/public/",
    onBeforeCall(ctx, route, req, res) {
        console.log(req.file)
        // Set request headers to context meta
        ctx.meta.userAgent = req.headers["user-agent"];
        ctx.meta.platform = req.headers["host"];
        ctx.meta.clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    },
    authorization: true,

    whitelist: [
        "coupon.*",
    ],
    aliases: {

        "POST upload": {
            type: "multipart",
            // Action level busboy config
            busboyConfig: {
                limits: {
                    files: 1
                },
                onPartsLimit(busboy, alias, svc) {
                    this.logger.info("Busboy parts limit!", busboy);
                },
                onFilesLimit(busboy, alias, svc) {
                    this.logger.info("Busboy file limit!", busboy);
                },
                onFieldsLimit(busboy, alias, svc) {
                    this.logger.info("Busboy fields limit!", busboy);
                }
            },
            action: "upload.create"
        },

        // coupon api's
        "GET coupon/getcouponvalue": "coupon.getcouponvalue",
        "GET coupon/getcoupon": "coupon.getcoupon",
    }
}