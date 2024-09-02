"use strict";

const Request = require("../mixins/request.mixin");
const RoleValidator = require("../app/admin/validators/RoleValidator");
const RoleController = require("../app/admin/controllers/RoleController");
const ModuleValidator = require("../app/admin/validators/RoleValidator");
const ModuleController = require("../app/admin/controllers/ModuleController");
const PermissionController = require("../app/admin/controllers/PermissionController");
module.exports = {
    name: "role",

    mixins: [
        Request
    ],

    actions: {
        create: {
            params: RoleValidator.create,
            handler: RoleController.create,
        },

        getall: {
            params: RoleValidator.getall,
            handler: RoleController.getall
        },

        update: {
            params: RoleValidator.update,
            handler: RoleController.update
        },

        remove: {
            params: RoleValidator.remove,
            handler: RoleController.remove
        },

        getaccessmodule: {
            params: RoleValidator.getall,
            handler: ModuleController.getall
        },

        getpermissionlist: {
            handler: PermissionController.getpermissionlist
        },
        getrolerights: {
            handler: PermissionController.getrolerights
        }
    }
};