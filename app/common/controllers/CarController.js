"use strict";

const { MoleculerError } = require("moleculer").Errors;
const webPush = require("web-push");
const CodeTypes = require("../../../fixtures/error.codes");
const Constants = require("../../../plugin/constants");
const Database = require("../../../adapters/Database");
const Config = require("./../../../config");
const { finished } = require("stream");
const Op = require('sequelize').Op;
// database connections for store Procedures (dashboard counts api)
const Sequ = require("sequelize");
const { QueryTypes } = require("sequelize");

let config = Config.get('/mssqlEnvironment');
const sequelize12 = new Sequ(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    options: {
        encrypt: false
    },
    dialectOptions: {
        options: {
            encrypt: false
        }
    },
    instancename: "MSQLEXPRESS",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

// Car Models
const CarBrand = new Database("Dcarbrand");
const CarModel = new Database("Dcarmodel");
const CarYear = new Database("Dcaryear");
const CarAction = new Database("Dcaraction");
const CarInsurance = new Database("Dcarinsurance");
const CarMilege = new Database("Dcarmilege");
const CarCylinders = new Database("Dcarcylinders");
const CarDriver = new Database("Dcardriver");
const CarTransmission = new Database("Dcartransmission");
const CarSeat = new Database("Dcarseat");
const CarSpeed = new Database("Dcarspeed");
const CarInformation = new Database("Dcarinformation");
const CarFeatures = new Database("Dcarfeatures");
const CarInterrior = new Database("Dcarinterrior");
const CarSupportDocument = new Database("Dcarsupportdocument");
const CarAdditional = new Database("Dcaradditional");
const CarArea = new Database("Dcararea");
const CarType = new Database('Dcartype');
//DEFAULT STATUS VALUES SEE IN CONSTANTS JS FILE

const {
    DELETE,
    ACTIVE,
    INACTIVE
} = Constants;

module.exports = {

    // ----------------------------------------- CAR BRAND START -------------------------------------//
    carbrand_create: async function(ctx) {
        let carbrand = {};
        carbrand['carbrandname'] = ctx.params.carbrandname;
        carbrand['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarBrand.find(ctx, { query: carbrand })
            .then((res) => {
                delete ctx.params.action;
                if (res.data.length === 0) {
                    return CarBrand.insert(ctx, ctx.params)
                        .then((res) => {
                           return CarBrand.find(ctx, { query: {status: 1} })
                            .then(res => {
                                return this.requestSuccess("List of Car Brand", res.data);
                            })
                            //return this.requestSuccess("Car Brand Created", ctx.params.carbrandname);
                        })
                        .catch((err) => {
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'carbrandname')
                                    return this.requestError(CodeTypes.CARBRAND_ALREADY_EXIST);
                            } else if (err instanceof MoleculerError)
                                return Promise.reject(err);
                            else
                                return this.requestError(CodeTypes.UNKOWN_ERROR);
                        });
                } else {
                    return this.requestError(CodeTypes.ALREADY_EXIST);
                }
            })
    },
    carbrand_update: async function(ctx) {
        return CarBrand.find(ctx, { query: { id: ctx.params.id } })
            .then((res) => {
                return CarBrand.updateBy(ctx, ctx.params.id, {
                        carbrandname: ctx.params.carbrandname,
                        carbrandshortname: ctx.params.carbrandshortname,
                        carbrandimage: ctx.params.carbrandimage
                    }, {
                        query: {
                            id: ctx.params.id
                        }
                    })
                    .then((res) => {
                        return CarBrand.find(ctx, { query: {status: 1} })
                        .then(res => {
                            return this.requestSuccess("List of Car Brand", res.data);
                        })
                      //  return this.requestSuccess("Car Brand Updated", ctx.params.carbrandname);
                    })
                    .catch((err) => {
                        if (err.name === 'Database Error' && Array.isArray(err.data)) {
                            if (err.data[0].type === 'unique' && err.data[0].field === 'carbrandname')
                                return this.requestError(CodeTypes.CARBRAND_ALREADY_EXIST);
                        } else if (err instanceof MoleculerError)
                            return Promise.reject(err);
                        else
                            return this.requestError(CodeTypes.UNKOWN_ERROR);
                    });
            })
    },
    carbrand_get: function(ctx) {
        let carbrand = {};
        carbrand['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarBrand.find(ctx, { query: carbrand })
            .then(res => {
                return this.requestSuccess("List of Car Brand", res.data);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    },
    carbrand_remove: function(ctx) {
        return CarBrand.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then( res => {
                 return CarBrand.updateBy(ctx, ctx.params.id, {
                    status: 2
                },{
                    query: {
                        id: ctx.params.id
                    }
                }).then(res => {
                   return CarBrand.find(ctx, {
                        query: {
                            status: 1
                        }
                    })
                    .then((res) => {
                        return this.requestSuccess("Requested Car Model Deleted", res.data);
                    })
                })
                

            })
    },

    // ----------------------------------------- CAR TYPE START -------------------------------------//
    cartype_create: async function(ctx) {
        let cartype = {};
        cartype['cartypename'] = ctx.params.cartypename;
        cartype['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarType.find(ctx, { query: cartype })
            .then((res) => {
                delete ctx.params.action;
                if (res.data.length === 0) {
                    return CarType.insert(ctx, ctx.params)
                        .then((res) => {
                           return CarType.find(ctx, { query: {status: 1} })
                            .then(res => {
                                return this.requestSuccess("List of Car type", res.data);
                            })
                            //return this.requestSuccess("Car type Created", ctx.params.cartypename);
                        })
                        .catch((err) => {
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'cartypename')
                                    return this.requestError(CodeTypes.CARtype_ALREADY_EXIST);
                            } else if (err instanceof MoleculerError)
                                return Promise.reject(err);
                            else
                                return this.requestError(CodeTypes.UNKOWN_ERROR);
                        });
                } else {
                    return this.requestError(CodeTypes.ALREADY_EXIST);
                }
            })
    },
    cartype_update: async function(ctx) {
        return CarType.find(ctx, { query: { id: ctx.params.id } })
            .then((res) => {
                return CarType.updateBy(ctx, ctx.params.id, {
                        cartypename: ctx.params.cartypename,
                        cartypeshortname: ctx.params.cartypeshortname
                    }, {
                        query: {
                            id: ctx.params.id
                        }
                    })
                    .then((res) => {
                        return CarType.find(ctx, { query: {status: 1} })
                        .then(res => {
                            return this.requestSuccess("List of Car type", res.data);
                        })
                      //  return this.requestSuccess("Car type Updated", ctx.params.cartypename);
                    })
                    .catch((err) => {
                        if (err.name === 'Database Error' && Array.isArray(err.data)) {
                            if (err.data[0].type === 'unique' && err.data[0].field === 'cartypename')
                                return this.requestError(CodeTypes.CARtype_ALREADY_EXIST);
                        } else if (err instanceof MoleculerError)
                            return Promise.reject(err);
                        else
                            return this.requestError(CodeTypes.UNKOWN_ERROR);
                    });
            })
    },
    cartype_get: function(ctx) {
        let cartype = {};
        cartype['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarType.find(ctx, { query: cartype })
            .then(res => {
                return this.requestSuccess("List of Car type", res.data);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    },    
    cartype_remove: function(ctx) {
        return CarType.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then( res => {
                 return CarType.updateBy(ctx, ctx.params.id, {
                    status: 2
                },{
                    query: {
                        id: ctx.params.id
                    }
                }).then(res => {
                   return CarType.find(ctx, {
                        query: {
                            status: 1
                        }
                    })
                    .then((res) => {
                        return this.requestSuccess("Requested Car Type Deleted", res.data);
                    })
                })
                

            })
    },
    // ----------------------------------------- CAR TYPE END -------------------------------------//

    // ----------------------------------------- CAR MODEL START -------------------------------------//
    carmodel_create: async function(ctx) {
        let carmodel = {};
        carmodel['carmodelname'] = ctx.params.carmodelname;
        carmodel['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarModel.find(ctx, { query: carmodel })
            .then((res) => {
                if (res.data.length === 0) {
                    return CarModel.insert(ctx, ctx.params)
                        .then((res) => {
                            return this.requestSuccess("Car Model Created", ctx.params.carmodelname);
                        })
                        .catch((err) => {
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'carmodelname')
                                    return this.requestError(CodeTypes.CARMODEL_ALREADY_EXIST);
                            } else if (err instanceof MoleculerError)
                                return Promise.reject(err);
                            else
                                return this.requestError(CodeTypes.UNKOWN_ERROR);
                        });
                } else {
                    return this.requestError(CodeTypes.ALREADY_EXIST);
                }
            })
    },

    carmodel_get: function(ctx) {
        let carbrand = {};
        carbrand['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarModel.find(ctx, { query: carbrand })
            .then((res) => {
                var arr = res.data;
                return this.requestSuccess("List of Car Model", arr);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    },

    carmodel_remove: function(ctx) {
        return CarModel.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                CarModel.updateBy(ctx, res.data.id, {
                    status: 2
                }, {
                    query: {
                        id: ctx.params.id
                    }
                })
                return this.requestSuccess("Requested Car Model Deleted", ctx.params.id);

            })
    },
    // ----------------------------------------- CAR MODAL END -------------------------------------//

    // ----------------------------------------- CAR Year START -------------------------------------//
    caryear_create: async function(ctx) {
        let caryear = {};
        caryear['caryearname'] = ctx.params.caryearname;
        caryear['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarYear.find(ctx, { query: caryear })
            .then((res) => {
                if (res.data.length === 0) {
                    return CarYear.insert(ctx, ctx.params)
                        .then((res) => {
                            return this.requestSuccess("Car Year Created", ctx.params.caryearname);
                        })
                        .catch((err) => {
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'caryearname')
                                    return this.requestError(CodeTypes.CARYear_ALREADY_EXIST);
                            } else if (err instanceof MoleculerError)
                                return Promise.reject(err);
                            else
                                return this.requestError(CodeTypes.UNKOWN_ERROR);
                        });
                } else {
                    return this.requestError(CodeTypes.ALREADY_EXIST);
                }
            })
    },

    caryear_get: function(ctx) {
        return sequelize12.query('EXEC sp_getCarType', { type: Sequ.QueryTypes.SELECT })
            .then(res => {
                if (res.length > 0)
                    return this.requestSuccess("Car Year List", res);
                else
                    return this.requestError("No record found.")
            })
            .catch(err => {
                console.log(err)
                return this.requestError("Something went wrong, Please contact your admin.", err)
            });

    },
    // caryear_get: function(ctx) {
    //     let caryear = {};
    //     caryear['status'] = ctx.params.status ? ctx.params.status : {
    //         [Op.ne]: DELETE
    //     };
    //     return CarYear.find(ctx, { query: caryear })
    //         .then((res) => {
    //             var arr = res.data;
    //             return this.requestSuccess("List of Car Year", arr);
    //         })
    //         .catch((err) => {
    //             if (err.name === 'Nothing Found')
    //                 return this.requestError(CodeTypes.NOTHING_FOUND);
    //             else
    //                 return this.requestError(CodeTypes.UNKOWN_ERROR);
    //         });

    // },

    caryear_remove: function(ctx) {
        return CarYear.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                CarYear.updateBy(ctx, res.data.id, {
                    status: 2
                }, {
                    query: {
                        id: ctx.params.id
                    }
                })
                return this.requestSuccess("Requested Year Deleted", ctx.params.id);

            })
    },
    // ----------------------------------------- CAR YEAR END -------------------------------------//

    // ----------------------------------------- CAR ACTION START -------------------------------------//
    caraction_create: async function(ctx) {
        let caraction = {};
        caraction['caractionname'] = ctx.params.caractionname;
        caraction['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarAction.find(ctx, { query: caraction })
            .then((res) => {
                if (res.data.length === 0) {
                    return CarAction.insert(ctx, ctx.params)
                        .then((res) => {
                            return this.requestSuccess("Car Action Created", ctx.params.caractionname);
                        })
                        .catch((err) => {
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'caractionname')
                                    return this.requestError(CodeTypes.CARACTION_ALREADY_EXIST);
                            } else if (err instanceof MoleculerError)
                                return Promise.reject(err);
                            else
                                return this.requestError(CodeTypes.UNKOWN_ERROR);
                        });
                } else {
                    return this.requestError(CodeTypes.ALREADY_EXIST);
                }
            })
    },

    caraction_get: function(ctx) {
        let caraction = {};
        caraction['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarAction.find(ctx, { query: caraction })
            .then((res) => {
                var arr = res.data;
                return this.requestSuccess("List of Car Action", arr);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    },

    caraction_remove: function(ctx) {
        return CarAction.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                CarAction.updateBy(ctx, res.data.id, {
                    status: 2
                }, {
                    query: {
                        id: ctx.params.id
                    }
                })
                return this.requestSuccess("Requested Action Deleted", ctx.params.id);

            })
    },
    // ----------------------------------------- CAR ACTION END -------------------------------------//

    // ----------------------------------------- CAR INSURaNCE START -------------------------------------//
    carinsurance_create: async function(ctx) {
        let carinsu = {};
        carinsu['carinsurancename'] = ctx.params.carinsurancename;
        carinsu['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarInsurance.find(ctx, { query: carinsu })
            .then((res) => {
                if (res.data.length === 0) {
                    return CarInsurance.insert(ctx, ctx.params)
                        .then((res) => {
                            return this.requestSuccess("Car Insurance Created", ctx.params.carinsurancename);
                        })
                        .catch((err) => {
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'carinsuranncename')
                                    return this.requestError(CodeTypes.CARINSURANCE_ALREADY_EXIST);
                            } else if (err instanceof MoleculerError)
                                return Promise.reject(err);
                            else
                                return this.requestError(CodeTypes.UNKOWN_ERROR);
                        });
                } else {
                    return this.requestError(CodeTypes.ALREADY_EXIST);
                }
            })
    },

    carinsurance_get: function(ctx) {
        let carinsu = {};
        carinsu['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarInsurance.find(ctx, { query: carinsu })
            .then((res) => {
                var arr = res.data;
                return this.requestSuccess("List of Car Insurance", arr);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    },

    carinsurance_remove: function(ctx) {
        return CarInsurance.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                CarInsurance.updateBy(ctx, res.data.id, {
                    status: 2
                }, {
                    query: {
                        id: ctx.params.id
                    }
                })
                return this.requestSuccess("Requested Insurance detail Deleted", ctx.params.id);

            })
    },
    // ----------------------------------------- CAR ACTION END -------------------------------------//

    // ----------------------------------------- CAR MILEGE START -------------------------------------//
    carmilege_create: async function(ctx) {
        let carmilege = {};
        carmilege['carmileagename'] = ctx.params.carmileagename;
        carmilege['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarMilege.find(ctx, { query: carmilege })
            .then((res) => {
                if (res.data.length === 0) {
                    return CarMilege.insert(ctx, ctx.params)
                        .then((res) => {
                            return this.requestSuccess("Car Milege Created", ctx.params.carmileagename);
                        })
                        .catch((err) => {
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'carmilegename')
                                    return this.requestError(CodeTypes.CARMILEGE_ALREADY_EXIST);
                            } else if (err instanceof MoleculerError)
                                return Promise.reject(err);
                            else
                                return this.requestError(CodeTypes.UNKOWN_ERROR);
                        });
                } else {
                    return this.requestError(CodeTypes.ALREADY_EXIST);
                }
            })
    },

    carmilege_get: function(ctx) {
        let carmilege = {};
        carmilege['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarMilege.find(ctx, { query: carmilege })
            .then((res) => {
                var arr = res.data;
                return this.requestSuccess("List of Car Milege", arr);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    },

    carmilege_remove: function(ctx) {
        return CarMilege.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                CarMilege.updateBy(ctx, res.data.id, {
                    status: 2
                }, {
                    query: {
                        id: ctx.params.id
                    }
                })
                return this.requestSuccess("Requested Milege Deleted", ctx.params.id);

            })
    },
    // ----------------------------------------- CAR MILEGE END -------------------------------------//

    // ----------------------------------------- CAR Cylinder START -------------------------------------//
    carcylinder_create: async function(ctx) {
        let carcylinder = {};
        carcylinder['carcylindersname'] = ctx.params.carcylindersname;
        carcylinder['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarCylinders.find(ctx, { query: carcylinder })
            .then((res) => {
                if (res.data.length === 0) {
                    return CarCylinders.insert(ctx, ctx.params)
                        .then((res) => {
                            return this.requestSuccess("Car Cylinder Created", ctx.params.carcylindersname);
                        })
                        .catch((err) => {
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'carcylindersname')
                                    return this.requestError(CodeTypes.CARCYLINDERS_ALREADY_EXIST);
                            } else if (err instanceof MoleculerError)
                                return Promise.reject(err);
                            else
                                return this.requestError(CodeTypes.UNKOWN_ERROR);
                        });
                } else {
                    return this.requestError(CodeTypes.ALREADY_EXIST);
                }
            })
    },

    carcylinder_get: function(ctx) {
        let carcylinder = {};
        carcylinder['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarCylinders.find(ctx, { query: carcylinder })
            .then((res) => {
                var arr = res.data;
                return this.requestSuccess("Car Cylinders type", arr);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    },

    carcylinder_remove: function(ctx) {
        return CarCylinders.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                CarCylinders.updateBy(ctx, res.data.id, {
                    status: 2
                }, {
                    query: {
                        id: ctx.params.id
                    }
                })
                return this.requestSuccess("Requested Car Cylinder Deleted", ctx.params.id);

            })
    },
    // ----------------------------------------- CAR Cylinder END -------------------------------------//

    // ----------------------------------------- CAR DRIVER START -------------------------------------//
    cardriver_create: async function(ctx) {
        let cardriver = {};
        cardriver['cardrivername'] = ctx.params.cardrivername;
        cardriver['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarDriver.find(ctx, { query: cardriver })
            .then((res) => {
                if (res.data.length === 0) {
                    return CarDriver.insert(ctx, ctx.params)
                        .then((res) => {
                            return this.requestSuccess("Car Driver Option Created", ctx.params.cardrivername);
                        })
                        .catch((err) => {
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'cardrivername')
                                    return this.requestError(CodeTypes.CARDRIVER_ALREADY_EXIST);
                            } else if (err instanceof MoleculerError)
                                return Promise.reject(err);
                            else
                                return this.requestError(CodeTypes.UNKOWN_ERROR);
                        });
                } else {
                    return this.requestError(CodeTypes.ALREADY_EXIST);
                }
            })
    },

    cardriver_get: function(ctx) {
        let cardriver = {};
        cardriver['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarDriver.find(ctx, { query: cardriver })
            .then((res) => {
                var arr = res.data;
                return this.requestSuccess("List of Car Driver Options", arr);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    },

    cardriver_remove: function(ctx) {
        return CarDriver.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                CarDriver.updateBy(ctx, res.data.id, {
                    status: 2
                }, {
                    query: {
                        id: ctx.params.id
                    }
                })
                return this.requestSuccess("Requested Car DRIVER Options Deleted", ctx.params.id);

            })
    },
    // ----------------------------------------- CAR DRIVER END -------------------------------------//

    // ----------------------------------------- CAR Transmission START -------------------------------------//
    cartransmission_create: async function(ctx) {
        let cartrans = {};
        cartrans['cartransmissionname'] = ctx.params.cardrivername;
        cartrans['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarTransmission.find(ctx, { query: cartrans })
            .then((res) => {
                if (res.data.length === 0) {
                    return CarTransmission.insert(ctx, ctx.params)
                        .then((res) => {
                            return this.requestSuccess("Car Transmission Option Created", ctx.params.cartransmissionname);
                        })
                        .catch((err) => {
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'cartransmissionname')
                                    return this.requestError(CodeTypes.CARTRANSMISSION_ALREADY_EXIST);
                            } else if (err instanceof MoleculerError)
                                return Promise.reject(err);
                            else
                                return this.requestError(CodeTypes.UNKOWN_ERROR);
                        });
                } else {
                    return this.requestError(CodeTypes.ALREADY_EXIST);
                }
            })
    },

    cartransmission_get: function(ctx) {
        let cartrans = {};
        cartrans['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarTransmission.find(ctx, { query: cartrans })
            .then((res) => {
                var arr = res.data;
                return this.requestSuccess("List of Car Transmission", arr);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    },

    cartransmission_remove: function(ctx) {
        return CarTransmission.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                CarTransmission.updateBy(ctx, res.data.id, {
                    status: 2
                }, {
                    query: {
                        id: ctx.params.id
                    }
                })
                return this.requestSuccess("Requested Car Transmission Options Deleted", ctx.params.id);

            })
    },
    // ----------------------------------------- CAR Transmission END -------------------------------------//

    // ----------------------------------------- CAR SEAT START -------------------------------------//
    carseat_create: async function(ctx) {
        let carseat = {};
        carseat['carseatsname'] = ctx.params.carseatsname;
        carseat['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarSeat.find(ctx, { query: carseat })
            .then((res) => {
                if (res.data.length === 0) {
                    return CarSeat.insert(ctx, ctx.params)
                        .then((res) => {
                            return this.requestSuccess("Car Seat Option Created", ctx.params.carseatsname);
                        })
                        .catch((err) => {
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'carseatsname')
                                    return this.requestError(CodeTypes.CARSEAT_ALREADY_EXIST);
                            } else if (err instanceof MoleculerError)
                                return Promise.reject(err);
                            else
                                return this.requestError(CodeTypes.UNKOWN_ERROR);
                        });
                } else {
                    return this.requestError(CodeTypes.ALREADY_EXIST);
                }
            })
    },

    carseat_get: function(ctx) {
        let carseat = {};
        carseat['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarSeat.find(ctx, { query: carseat })
            .then((res) => {
                var arr = res.data;
                return this.requestSuccess("List of Car Seats Available", arr);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    },

    carseat_remove: function(ctx) {
        return CarSeat.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                CarSeat.updateBy(ctx, res.data.id, {
                    status: 2
                }, {
                    query: {
                        id: ctx.params.id
                    }
                })
                return this.requestSuccess("Requested Car Seats Options Deleted", ctx.params.id);

            })
    },
    // ----------------------------------------- CAR SEAT END -------------------------------------//

    // ----------------------------------------- CAR SPEED START -------------------------------------//
    carspeed_create: async function(ctx) {
        let carspeed = {};
        carspeed['carspeedname'] = ctx.params.carspeedname;
        carspeed['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarSpeed.find(ctx, { query: carspeed })
            .then((res) => {
                if (res.data.length === 0) {
                    return CarSpeed.insert(ctx, ctx.params)
                        .then((res) => {
                            return this.requestSuccess("Car Speed Option Created", ctx.params.carspeedname);
                        })
                        .catch((err) => {
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'carspeedname')
                                    return this.requestError(CodeTypes.CARSPEED_ALREADY_EXIST);
                            } else if (err instanceof MoleculerError)
                                return Promise.reject(err);
                            else
                                return this.requestError(CodeTypes.UNKOWN_ERROR);
                        });
                } else {
                    return this.requestError(CodeTypes.ALREADY_EXIST);
                }
            })
    },

    carspeed_get: function(ctx) {
        let carspeed = {};
        carspeed['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarSpeed.find(ctx, { query: carspeed })
            .then((res) => {
                var arr = res.data;
                return this.requestSuccess("List of Car Sseed Available", arr);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    },

    carspeed_remove: function(ctx) {
        return CarSpeed.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                CarSpeed.updateBy(ctx, res.data.id, {
                    status: 2
                }, {
                    query: {
                        id: ctx.params.id
                    }
                })
                return this.requestSuccess("Requested Car Speed Options Deleted", ctx.params.id);
            })
    },
    // ----------------------------------------- CAR SPEED END -------------------------------------//

    // ----------------------------------------- CAR INFORMATION START -------------------------------------//
    car_create: async function(ctx) {
        let car_information = ctx.params.carinfo;
        let car_features = ctx.params.carfeatures;
        let car_interrior = ctx.params.carinterrior;
        let car_supportdocument = ctx.params.cardocuments;
        let carareas = ctx.params.carareas;
        let carinfo = {};
        carinfo['carno'] = car_information.carno;
        carinfo['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarInformation.find(ctx, { query: carinfo })
            .then((res) => {
                if (res.data.length === 0) {
                    return CarInformation.insert(ctx, car_information)
                        .then((res_car) => {
                            return CarFeatures.insert(ctx, {
                                carinformationid: res_car.data.id,
                                carinsurance: car_features.carinsurance,
                                // cardropofdate: car_features.cardropofdate,
                                carmilege: car_features.carmilege,
                                carcylinder: car_features.carcylinder,
                                cardriver: car_features.cardriver,
                                cardrivercharge: car_features.cardrivercharge,
                                carsunroof: car_features.carsunroof,
                                cartransmission: car_features.cartransmission,
                                carseat: car_features.carseat,
                                carspeed: car_features.carspeed,
                                carspeedlimit: car_features.carspeedlimit,
                                cartype: car_features.cartype
                            }).then(async features => {
                                if(car_interrior !== undefined) {
                                    await car_interrior.forEach(interrior => {
                                        CarInterrior.insert(ctx, {
                                            carid: res_car.data.id,
                                            carinformationid: features.data.id,
                                            carinterriorimagename: interrior.name,
                                            // carimageorderid: interrior.carimageorderid,
                                            // carcoverimage: interrior.carcoverimage
                                        })
                                    });
                                }
                                
                                if(car_supportdocument !== undefined) {
                                    await car_supportdocument.forEach(document => {
                                        CarSupportDocument.insert(ctx, {
                                            carinformationid: res_car.data.id,
                                            sortorder: document.sortorder,
                                            supportdocumentname: document.supportdocumentname
                                        })
                                    });
                                }
                                
                                if(carareas !== undefined) {
                                    await carareas.forEach(area => {
                                        CarArea.insert(ctx, {
                                            carid: res_car.data.id,
                                            agentid: res_car.data.agentid,
                                            areaid: area.areaid,
                                            cityid: area.cityid,
                                            countryid: area.countryid,
                                        })
                                    });
                                }
                                return CarInformation.find(ctx, { query: {status: 1} })
                                .then(res => {
                                    return this.requestSuccess("List of Car Information Available", res.data);
                                })
                              //  return this.requestSuccess("Car Information Created", ctx.params.carbrand);
                            })

                        })
                        .catch((err) => {
                            console.log(err)
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'carbrand')
                                    return this.requestError(CodeTypes.CARINFORMATION_ALREADY_EXIST);
                            } else if (err instanceof MoleculerError)
                                return Promise.reject(err);
                            else
                                return this.requestError(CodeTypes.UNKOWN_ERROR);
                        });
                } else {
                    return this.requestError(CodeTypes.ALREADY_EXIST);
                }
            })
    },

    car_update: async function(ctx) {
        let car_information = ctx.params.carinfo;
        let car_features = ctx.params.carfeatures;
        let car_interrior = ctx.params.carinterrior;
        let car_supportdocument = ctx.params.cardocuments;
        let carareas = ctx.params.carareas;
        let carinfo = {};
        carinfo['carno'] = car_information.carno;
        // carinfo['status'] = ctx.params.status ? ctx.params.status : { [Op.ne]: DELETE };
        return CarInformation.find(ctx, { query: carinfo })
            .then(res => {
                return CarInformation.updateBy(ctx, res.data[0].id, {
                        agentid: car_information.agentid,
                        carno: car_information.carno,
                        carbrand: car_information.carbrand,
                        carmodel: car_information.carmodel,
                        caryear: car_information.caryear,
                        carpriceperday: car_information.carpriceperday,
                        cardeposite: car_information.cardeposite,
                        cityid: car_information.cityid,
                        countryid: car_information.countryid,
                        minbookingdays: car_information.minbookingdays,
                        vat: car_information.vat,
                        //carstatus: car_information.carstatus,
                        showdashboard: car_information.showdashboard,
                        ispickupavailable: car_information.ispickupavailable,
                        isdropoffavailable: car_information.isdropoffavailable,
                        specificlocation: car_information.specificlocation,
                        coverimagepath: car_information.coverimagepath,
                        category: car_information.category,
                        sortorder: car_information.sortorder

                    }, {
                        query: { id: res.data[0].id }
                    })
                    .then((res_car) => {
                        return CarFeatures.updateBy(ctx, res_car.data[0].id, {
                            carinsurance: car_features.carinsurance,
                            // cardropofdate: car_features.cardropofdate,
                            carmilege: car_features.carmilege,
                            carcylinder: car_features.carcylinder,
                            cardriver: car_features.cardriver,
                            cardrivercharge: car_features.cardrivercharge,
                            carsunroof: car_features.carsunroof,
                            cartransmission: car_features.cartransmission,
                            carseat: car_features.carseat,
                            carspeed: car_features.carspeed,
                            carspeedlimit: car_features.carspeedlimit,
                            cartype: car_features.cartype
                        }, {
                            query: { carinformationid: res_car.data[0].id }
                        }).then(async features => {
                            await sequelize12.query('exec sp_RemoveAllInterior @Id=:id', {
                                replacements: { id: res_car.data[0].id },
                                type: Sequ.QueryTypes.SELECT
                            })
                            .then(res => {
                                car_interrior.forEach(interrior => {
                                    CarInterrior.insert(ctx, {
                                        carid: res_car.data[0].id,
                                        carinformationid: features.data[0].id,
                                        carinterriorimagename: interrior.name
                                    })
                                })                                
                            })

                            await sequelize12.query('exec sp_RemoveAllDocs @Id=:id', {
                                replacements: { id: res_car.data[0].id },
                                type: Sequ.QueryTypes.SELECT
                            })
                            .then(res => {
                                car_supportdocument.forEach(document => {
                                    CarSupportDocument.insert(ctx, {
                                        carinformationid: res_car.data[0].id,
                                        sortorder: document.sortorder,
                                        supportdocumentname: document.supportdocumentname,
                                    })
                                })                                
                            })
                           
                            await sequelize12.query('exec sp_RemoveAllArea @Id=:id', {
                                replacements: { id: res_car.data[0].id },
                                type: Sequ.QueryTypes.SELECT
                            })
                            .then(res => {
                                carareas.forEach(document => {
                                    CarArea.insert(ctx, {
                                        carid: res_car.data[0].id,
                                        agentid: car_information.agentid,
                                        areaid: document.areaid,
                                        cityid: document.cityid,
                                        countryid: document.countryid,
                                    })
                                })                                
                            })
                        
                            return CarInformation.find(ctx, { query: {status: 1} })
                            .then(res => {
                                return this.requestSuccess("List of Car Information Available", res.data);
                            })
                        }).catch(err => console.log("inside", err))
                    })
                    .catch((err) => {
                        console.log(err)
                        if (err.name === 'Database Error' && Array.isArray(err.data)) {
                            if (err.data[0].type === 'unique' && err.data[0].field === 'carbrand')
                                return this.requestError(CodeTypes.CARINFORMATION_ALREADY_EXIST);
                        } else if (err instanceof MoleculerError)
                            return Promise.reject(err);
                        else
                            return this.requestError(CodeTypes.UNKOWN_ERROR);
                    });
            })
    },

    car_get: function(ctx) {
        let carinfo = {};
        carinfo['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE
        };
        return CarInformation.find(ctx, { query: carinfo })
            .then(res => {
                return this.requestSuccess("List of Car Information Available", res.data);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    },

    car_remove: function(ctx) {
        return CarInformation.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                CarInformation.updateBy(ctx, res.data.id, {
                    status: 2 // boolean value set 
                }, {
                    returning: true,
                    query: {
                        id: res.data.id
                    }
                }).then(res => {
                    return this.requestSuccess("Requested Car Information Deleted", res);
                }).catch(res => {
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
                })


            })
    },
    // ----------------------------------------- CAR INFORMATION END -------------------------------------//

    get_carinformation: async function(ctx) {
        let informationList;
        return await sequelize12.query('EXEC sp_getcarinformation', { type: Sequ.QueryTypes.SELECT })
            .then(res => {
                informationList = res && res.reduce(function(r, a) {
                    r[a.type] = [...r[a.type] || [], a];
                    return r;
                }, {});
                console.log(informationList)
                return this.requestSuccess("Car Information List", informationList);
            });
    },

    get_carmanagement: async function(ctx) {

        return await sequelize12.query('exec sp_getcarmanagement @status=:status', {
                replacements: { status: ctx.params.status !== undefined ? ctx.params.status: 1 },
                type: Sequ.QueryTypes.SELECT
            })
            .then(res => {
                if (res)
                    return this.requestSuccess("Car Management List", res);
                else
                    return this.requestError(CodeTypes.NOTHING_FOUND);
            })
            .catch(err => {
                console.log(err)
                return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },

    get_carbycarid: async function(ctx) {
        return await sequelize12.query('exec sp_getcarbyid @carid=:carid', {
                replacements: { carid: ctx.params.carid },
                type: Sequ.QueryTypes.SELECT
            })
            .then(res => {
                if (res)
                    return this.requestSuccess("Car Information", res);
                else
                    return this.requestError(CodeTypes.NOTHING_FOUND);
            })
            .catch(err => {
                console.log(err)
                return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },

    get_carmanagement_filter: async function(ctx) {
        return await sequelize12.query('exec sp_getcarmanagement_filter @carno=:carno, @carbrand=:carbrand, @carmodel=:carmodel, @caryear=:caryear, @carstatus=:carstatus', {
                replacements: {...ctx.params },
                type: Sequ.QueryTypes.SELECT
            })
            .then(res => {
                if (res)
                    return this.requestSuccess("Car Management Filter List", res);
                else
                    return this.requestError(CodeTypes.NOTHING_FOUND);
            })
            .catch(err => {
                console.log(err)
                return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },
    
    setCarStatus: function(ctx){
        console.log(ctx.params)
        return CarInformation.updateBy(ctx, ctx.params.id, {
            carstatus: ctx.params.carstatus}, 
            { query: {id: ctx.params.id}
        }).then(res => {
            return ctx.call("car.get_carmanagement").then(res => {
                return this.requestSuccess("Car Management List!", res.data);
            }) .catch(err => {
                return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
            // if (res)
            //     return this.requestSuccess("Car Management List", res);
            // else
            //     return this.requestError(CodeTypes.NOTHING_FOUND);
        })
        .catch(err => {
            console.log(err)
            return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },

    remove_carmanagement: async function(ctx) {
        return await sequelize12.query('exec sp_deletecarbyid @carid=:carid,  @userid=:userid', {
                replacements: { carid: ctx.params.carid, userid: ctx.meta.user.id },
                type: Sequ.QueryTypes.SELECT
            })
            .then(res => {
                if (res)
                    return this.requestSuccess("Car Management List", res);
                else
                    return this.requestError(CodeTypes.NOTHING_FOUND);
            })
            .catch(err => {
                console.log(err)
                return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },

    get_cardisplayinfo: async function() {
        return await sequelize12.query('EXEC sp_getcardisplayinfo', { type: Sequ.QueryTypes.SELECT })
            .then(res => {
                if (res.length > 0)
                    return this.requestSuccess("Car Display Information List", res);
                else
                    return this.requestError("No record found.")
            })
            .catch(err => {
                return this.requestError("Something went wrong, Please contact your admin.", err)
            });
    },

    get_carfullinfolist: async function(ctx) {
        return await sequelize12.query('EXEC sp_getcarfullinfo_new @Lang=:id', { replacements: { id: ctx.params.Lang }, type: Sequ.QueryTypes.SELECT })
            .then(res => {
                return this.requestSuccess("Car Display Information List", res);
            })
            .catch(err => {
                return this.requestError("Something went wrong, Please contact your admin.", err)
            });
    },

    get_carinterrior: async function(ctx) {
        return await sequelize12.query('EXEC sp_getinterriorimagelist @Id=:id', { replacements: { id: ctx.params.id }, type: Sequ.QueryTypes.SELECT })
            .then(res => {
                if (res)
                    return this.requestSuccess("Car Interrior Image List", res);
                else
                    return this.requestError("No record found.")
            })
            .catch(err => {
                return this.requestError("Something went wrong, Please contact your admin.", err)
            });
    },

    get_carreview: async function(ctx) {
        return await sequelize12.query('EXEC sp_getreivewlist  @Id=:id', { replacements: { id: ctx.params.id }, type: Sequ.QueryTypes.SELECT })
        // return await sequelize12.query('EXEC sp_getreivewlist  @Id=:id,@Agentid=:agentid', { replacements: { id: ctx.params.id,agentid: ctx.params.agentid }, type: Sequ.QueryTypes.SELECT })
        .then(res => {
            if (res)
                return this.requestSuccess("Car Review List", res);
            else
                return this.requestError("No record found.")
        })
        .catch(err => {
            return this.requestError("Something went wrong, Please contact your admin.", err)
        });
    },

    checkisavailable: async function(ctx) {
        return await sequelize12.query('EXEC sp_checkIsAlreadyBooked  @carid=:id,@fromdate=:from,@todate=:to', 
        { replacements: { id: ctx.params.carid,from: ctx.params.fromdate,to: ctx.params.todate }, type: Sequ.QueryTypes.SELECT })            
        .then(res => {
            return this.requestSuccess("Car Review List", res);
        })
        .catch(err => {
            console.log(err)
            return this.requestError("Something went wrong, Please contact your admin.", err)
        });
    },

    filterinfo: async function(ctx) {
        return await sequelize12.query('EXEC sp_getfilterinfo', { type: Sequ.QueryTypes.SELECT })
            .then(res => {
                if (res.data !== undefined)
                    return this.requestSuccess("Filter List", res);
                else
                    return this.requestError("No record found.")
            })
            .catch(err => {
                return this.requestError("Something went wrong, Please contact your admin.", err)
            });
    },


}