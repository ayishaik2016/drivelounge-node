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

// Address Models
const AddressType = new Database("Daddresstype");
const City = new Database("Dcity");
const Area = new Database("Darea");
const Country = new Database("Dcountry");

//DEFAULT STATUS VALUES SEE IN CONSTANTS JS FILE

const {
    DELETE,
    ACTIVE,
    INACTIVE
} = Constants;

module.exports = {

    // ----------------------------------------- AREA START -------------------------------------//
    areacreate: async function(ctx) {
        let area = {};
        area['areaname'] = ctx.params.areaname;
        area['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE };
        let data = {
            areaname: ctx.params.areaname,
            cityid: ctx.params.cityid,
            countryid: ctx.params.countryid
        }
        return Area.find(ctx, { query: area })
            .then((res) => {
                if (res.data.length === 0) {                    
                    return Area.insert(ctx, data)
                        .then((res) => {
                            return ctx.call("address.areagetAll").then(res => {
                                return this.requestSuccess("Area created successfully!", res.data);
                            })
                            //return this.requestSuccess("Address Area Created", ctx.params.areaname);
                        })
                        .catch((err) => {
                            console.log(err);
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'areaname')
                                    return this.requestError(CodeTypes.ALREADY_EXIST);
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
    areaupdate: function(ctx) {
        return Area.find(ctx, { query: {id: ctx.params.id} })
            .then((res) => {
                return Area.updateBy(ctx, ctx.params.id, {
                    areaname: ctx.params.areaname,
                    cityid: ctx.params.cityid,
                    countryid: ctx.params.countryid
                }, {
                    query: {
                        id: ctx.params.id
                    }
                }).then(res => {                    
                    return ctx.call("address.areagetAll").then(res => {
                        return this.requestSuccess("Area updatad successfully!", res.data);
                    })
                   // return this.requestSuccess("Address Area Updated", res.data.areaname);
                })

            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });

    },
    arearemove: function(ctx) {

        return Area.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                return Area.updateBy(ctx, ctx.params.id, {
                    status: 2
                }, {
                    query: {
                        id: ctx.params.id
                    }
                }).then(res => {
                    return ctx.call("address.areagetAll").then(res => {
                        return this.requestSuccess("Area removed successfully!", res.data);
                    })
                  //  return this.requestSuccess("Requested Area Deleted", res);
                })

            })
    },
    areastatus: function(ctx) {
        return Area.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                 return Area.updateBy(ctx, res.data.id, {
                    areastatus: ctx.params.areastatus ? 1 : 2
                }, {
                    query: {
                        id: ctx.params.id
                    }
                }).then( res =>{
                    return ctx.call("address.areagetAll").then(res => {
                        return this.requestSuccess("Area status changed successfully!", res.data);
                    })
                })
            })
    },
    areaget: function(ctx) {
        let area = {};
        area['status'] = 1;
        return Area.find(ctx, { query: area })
            .then((res) => {
                var arr = res.data;
                return this.requestSuccess("List of Area's", arr);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },
    areagetAll: async function(ctx) {
        return await sequelize12.query('exec sp_getArea', { type: Sequ.QueryTypes.SELECT })
            .then(res => {
                if (res)
                    return this.requestSuccess("Area List", res);
                else
                    return this.requestError(CodeTypes.NOTHING_FOUND);
            })
            .catch(err => {
                console.log(err)
                return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },

    // ----------------------------------------- AREA END -------------------------------------//
    // ----------------------------------------- CITY START -------------------------------------//
    citycreate: async function(ctx) {
        let city_ = {};
        city_['cityname'] = ctx.params.cityname;
        city_['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE };
        return City.find(ctx, { query: city_ })
            .then(res => {
                if (res.data.length === 0) {
                    return City.insert(ctx, {
                            cityname: ctx.params.cityname,
                            countryid: ctx.params.countryid,
                            cityimage: ctx.params.cityimage,
                            showdashboard: ctx.params.showdashboard,
                            citystatus: 1
                        })
                        .then(res => {
                            return ctx.call("address.citygetAll").then(res => {                        
                                return this.requestSuccess("Requested city has updated!", res.data);
                            })
                            //return this.requestSuccess("City Created", ctx.params.cityname);
                        })
                        .catch(err => {
                            console.log(err)
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'cityname')
                                    return this.requestError(CodeTypes.ALREADY_EXIST);
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
    cityupdate: function(ctx) {
        let city_ = {};
        city_['id'] = ctx.params.id
        city_['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE };
        return City.updateBy(ctx, ctx.params.id, {
            cityname: ctx.params.cityname,
            countryid: ctx.params.countryid,
            cityimage: ctx.params.cityimage,
            citystatus: ctx.params.status,
            showdashboard: ctx.params.showdashboard,
        }, {
            query: {
                id: ctx.params.id
            }
        }).then(res => {
            return ctx.call("address.citygetAll").then(res => {                        
                return this.requestSuccess("Requested city has updated!", res.data);
            })
          //  return this.requestSuccess("Requested City Updated.", res.data);
        }).catch((err) => {
            if (err.name === 'Nothing Found')
                return this.requestError(CodeTypes.NOTHING_FOUND);
            else
                return this.requestError(CodeTypes.UNKOWN_ERROR);
        });

    },
    cityremove: function(ctx) {
        return City.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                return City.updateBy(ctx, res.data.id, {
                    status: 2
                }, {
                    query: {
                        id: ctx.params.id
                    }
                }).then(res => {
                    return ctx.call("address.citygetAll").then(res => {
                        return this.requestSuccess("City removed successfully!", res.data);
                    })
                })
            })
    },
    citystatus: function(ctx) {
        return City.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                return City.updateBy(ctx, res.data.id, {
                    citystatus: ctx.params.status
                }, {
                    query: {
                        id: ctx.params.id
                    }
                }).then(res => {
                    return ctx.call("address.citygetAll").then(res => {
                        return this.requestSuccess("Requested City Status Changed!", res.data);
                    })
                })
            })
    },
    citydashboardstatus: function(ctx) {
        console.log(ctx.params)
        return City.findOne(ctx, {
            query: {
                id: ctx.params.id
            }
        })
        .then((res) => {
            return City.updateBy(ctx, res.data.id, {
                showdashboard: ctx.params.status
            }, {
                query: {
                    id: ctx.params.id
                }
            }).then(res => {
                return ctx.call("address.citygetAll").then(res => {
                    return this.requestSuccess("Requested City Status Changed!", res.data);
                })
            })
        })
    },
    cityget: function(ctx) {
        let city_ = {};
        city_['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE };
        return City.find(ctx, { query: city_ })
            .then((res) => {
                var arr = res.data;
                return this.requestSuccess("List of City's", arr);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },
    citygetAll: async function(ctx) {

        return await sequelize12.query('exec sp_getCity', { type: Sequ.QueryTypes.SELECT })
            .then(res => {
                if (res)
                    return this.requestSuccess("City List", res);
                else
                    return this.requestError(CodeTypes.NOTHING_FOUND);
            })
            .catch(err => {
                return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },
    // ----------------------------------------- CITY END -------------------------------------//
    // ----------------------------------------- ADDRESS TYPE START -------------------------------------//
    typecreate: async function(ctx) {
        let addtype = {};
        addtype['addresstypenameen'] = ctx.params.addresstypenameen;
        addtype['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE };
        return AddressType.find(ctx, { query: addtype })
            .then((res) => {
                if (res.data.length === 0) {
                    return AddressType.insert(ctx, {
                            addresstypenameen: ctx.params.addresstypenameen,
                            addresstypenamear: ctx.params.addresstypenamear,
                            addresstypestatus: 1
                        })
                        .then((res) => {
                            return AddressType.find(ctx, { query: {status: 1} })
                            .then(res => {
                                return this.requestSuccess("List of Address Type's", res.data);
                            })
                            //return this.requestSuccess("Address Type Created", ctx.params.addresstypenameen);
                        })
                        .catch((err) => {
                            console.log(err)
                            if (err.name === 'Database Error' && Array.isArray(err.data)) {
                                if (err.data[0].type === 'unique' && err.data[0].field === 'addresstypenameen')
                                    return this.requestError(CodeTypes.ALREADY_EXIST);
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
    typeupdate: function(ctx) {
        let addtype = {};
        addtype['id'] = ctx.params.id
        addtype['status'] = 1; //ctx.params.status ? ctx.params.status : { [Op.ne]: DELETE };
        return AddressType.find(ctx, { query: addtype })
            .then((res) => {
                return AddressType.updateBy(ctx, ctx.params.id, {
                    addresstypenameen: ctx.params.addresstypenameen,
                    addresstypenamear: ctx.params.addresstypenamear,
                    addresstypestatus: ctx.params.addresstypestatus
                }, {
                    query: {
                        id: ctx.params.id
                    }
                }).then(res => {
                    return AddressType.find(ctx, { query: {status: 1} })
                    .then(res => {
                        return this.requestSuccess("List of Address Type's", res.data);
                    })
                })
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },
    typeremove: function(ctx) {
        return AddressType.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                return AddressType.updateBy(ctx, res.data.id, {
                    status: 2
                }, {
                    query: {
                        id: ctx.params.id
                    }
                }).then(res => {
                    return AddressType.find(ctx, { query: {status: 1} })
                    .then(res => {
                        return this.requestSuccess("List of Address Type's", res.data);
                    })
                })
            })
    },
    typestatus: function(ctx) {
        return AddressType.findOne(ctx, {
                query: {
                    id: ctx.params.id
                }
            })
            .then((res) => {
                return AddressType.updateBy(ctx, res.data.id, {
                    addresstypestatus: ctx.params.status
                }, {
                    query: {
                        id: ctx.params.id
                    }
                }).then(res => {
                    return AddressType.find(ctx, { query: {status: 1} })
                    .then(res => {
                        return this.requestSuccess("List of Address Type's", res.data);
                    })
                })                
            })
    },
    typeget: function(ctx) {
        let addtype = {};
        addtype['status'] = ctx.params.status ? ctx.params.status : {
            [Op.ne]: DELETE };
        return AddressType.find(ctx, { query: addtype })
            .then(res => {
                return this.requestSuccess("List of Address Type's", res.data);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },
    typegetById: function(ctx) {
        let addtype = {};
        addtype['id'] = ctx.params.typeid
        addtype['status'] = 1;
        return AddressType.find(ctx, { query: addtype })
            .then((res) => {
                return this.requestSuccess("List of Address Type's", res.data);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },
    typegetAll: function(ctx) {
        return AddressType.find(ctx, { query: {status: 1} })
            .then((res) => {
                return this.requestSuccess("List of Address Type's", res.data);
            })
            .catch((err) => {
                if (err.name === 'Nothing Found')
                    return this.requestError(CodeTypes.NOTHING_FOUND);
                else
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
            });
    },
    // ----------------------------------------- ADDRESS TYPE END -------------------------------------//

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
}