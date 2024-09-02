"use strict";
const CodeTypes = require("./../../../fixtures/error.codes");
const Sequ = require("sequelize");

const Config = require("../../../config");
let config = Config.get('/mssqlEnvironment');
//database connections for store Procedures (admin review list api)
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

module.exports = {

    agency: async function(ctx) {
        return await sequelize12.query('EXEC sp_rept_agency_new @agentid=:agentid,@fromdate=:fromdate,@todate=:todate,@bookingno=:bookingno,@carno=:carno', {
            replacements: { agentid: ctx.params.agentid, fromdate: ctx.params.fromdate, todate: ctx.params.todate, bookingno: ctx.params.bookingno, carno: ctx.params.carno }
        }).then(res => {
            console.log(res)
            return this.requestSuccess("Report List", res);
        })
        .catch(err => {
            console.log(err)
            return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },

    admin: async function(ctx) {
        return await sequelize12.query('EXEC sp_rept_admin @agentid=:agentid,@fromdate=:fromdate,@todate=:todate', {
            replacements: { agentid: ctx.params.agentid,  fromdate: ctx.params.fromdate, todate: ctx.params.todate }
        }).then(res => {
            return this.requestSuccess("Report List", res);
        })
        .catch(err => {
            console.log(err)
            return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },

    // Zakat and Vat   
    report1: async function(ctx) {
        return await sequelize12.query('EXEC sp_zakatandvatreport @fromdate=:fromdate,@todate=:todate', {
            replacements: { fromdate: ctx.params.fromdate, todate: ctx.params.todate }
        }).then(res => {
            return this.requestSuccess("Report List", res);
        })
        .catch(err => {
            console.log(err)
            return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },
    report2: async function(ctx) {
        return await sequelize12.query('EXEC sp_rept_billduereport @agentid=:agentid,@fromdate=:fromdate,@todate=:todate', {
            replacements: { agentid: ctx.params.agentid, fromdate: ctx.params.fromdate, todate: ctx.params.todate }
        }).then(res => {
            return this.requestSuccess("Report List", res);
        })
        .catch(err => {
            console.log(err)
            return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },

    report3: async function(ctx) {
        return await sequelize12.query('EXEC sp_rept_confirmedbookingbyagency @agentid=:agentid,@lang=:lang,@fromdate=:fromdate,@todate=:todate', {
            replacements: { agentid: ctx.params.agentid, lang: ctx.params.lang, fromdate: ctx.params.fromdate, todate: ctx.params.todate }
        }).then(res => {
            return this.requestSuccess("Report List", res);
        })
        .catch(err => {
            console.log(err)
            return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },

    report4: async function(ctx) {
        return await sequelize12.query('EXEC sp_rept_cancelledbookingbefore48hours1 @agentid=:agentid,@fromdate=:fromdate,@todate=:todate', {
            replacements: { agentid: ctx.params.agentid, fromdate: ctx.params.fromdate, todate: ctx.params.todate }
        }).then(res => {
            return this.requestSuccess("Report List", res);
        })
        .catch(err => {
            console.log(err)
            return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },

    report5: async function(ctx) {
        return await sequelize12.query('EXEC sp_rept_cancelledbookingbefore48hours2 @agentid=:agentid,@fromdate=:fromdate,@todate=:todate', {
            replacements: { agentid: ctx.params.agentid, fromdate: ctx.params.fromdate, todate: ctx.params.todate }
        }).then(res => {
            return this.requestSuccess("Report List", res);
        })
        .catch(err => {
            console.log(err)
            return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },

    report6: async function(ctx) {
        return await sequelize12.query('EXEC sp_rept_totalbookingreport @cityid=:cityid,@fromdate=:fromdate,@todate=:todate', {
            replacements: { cityid: ctx.params.cityid, fromdate: ctx.params.fromdate, todate: ctx.params.todate }
        }).then(res => {
            return this.requestSuccess("Report List", res);
        })
        .catch(err => {
            console.log(err)
            return this.requestError(CodeTypes.UNKOWN_ERROR);
        });
    },

   
}