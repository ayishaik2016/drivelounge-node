"use strict";

const ApiGateway = require("moleculer-web");
const { MoleculerError } = require("moleculer").Errors;
const Promise = require("bluebird");

const CodeTypes = require("../fixtures/error.codes");
const Config = require("../config");
const Request = require("../mixins/request.mixin");
const Routes = require("../routes/index");
var Path = require('path');
module.exports = {
    name: "api",

    mixins: [
        ApiGateway,
        Request
    ],

    settings: {
        port: Config.get('/server/port/api'),

        cors: {
            origin: ["http://localhost:9012", "http://13.232.153.14:9012/", "https://drivelounge.com", "https://drivelounge.com/", "https://www.drivelounge.com", "https://www.drivelounge.com/"],
            methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
            credentials: true
        },
        // cors: Config.get('/cors'),

        path: `/api/v${Config.get('/version')}`, // Ex: /api/v1

        routes: Routes,
        assets: {
            // Root folder of assets
            // folder: "../app/admin/controllers/__uploads",
            folder: Path.join(__dirname, "./../app/admin/controllers/__uploads"),
            upload: Path.join(__dirname, "../app/admin/controllers/__uploads"),
            // Further options to `server-static` module
            options: {}
        }
    },


    methods: {

        authorize(ctx, route, req) {

            var authValue = req.headers["authorization"];
            if (authValue && authValue.startsWith("Bearer")) {
                var token = authValue.slice(6);
                var url = ctx.params.req.originalUrl;
                return ctx.call("auth.verifyToken", { token, url })
                    .then((decoded) => {

                        ctx.meta.user = decoded;
                        ctx.meta.user.token = token;
                        if (decoded.access == 0) {
                            return this.requestError(CodeTypes.AUTH_ACCESS_DENIED);
                        }
                    })
                    .catch((err) => {
                        console.log('err', err);
                        if (err instanceof MoleculerError)
                            return Promise.reject(err);

                        return this.requestError(CodeTypes.AUTH_INVALID_TOKEN);
                    });

            } else {
                return this.requestError(CodeTypes.AUTH_NO_TOKEN);
            }
        }

    },
    created() {
        console.log(Path.join(__dirname, "app/admin/controllers/__uploads"))
    },

};