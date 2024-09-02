"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types

module.exports = {
    name: "dcarinformation",
    define: {
        id: { // id must always exist
            type: Sequelize.INTEGER(4),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        carinformationkey: {
            type: Sequelize.UUID, // Uses uuidv4 by default (default value is recommended)
            defaultValue: Sequelize.UUIDV4,
            allowNull: true,
        },
        agentid: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        carno: {
            type: Sequelize.STRING(20),
            allowNull: true,
        },
        // carcoverimagepreview: {
        // 	type: Sequelize.STRING(250),
        //     allowNull: true,
        // },
        coverimagepath: {
        	type: Sequelize.STRING(250),
            allowNull: false,
        },
        carbrand: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },

        carmodel: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        caryear: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        carpriceperday: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        cardeposite: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        caraction: {
            type: Sequelize.TINYINT(4),
            allowNull: true,
        },
        cityid: {
            type: Sequelize.TINYINT(4),
            allowNull: true,
        },
        countryid: {
            type: Sequelize.TINYINT(4),
            allowNull: true,
        },
        minbookingdays: {
            type: Sequelize.TINYINT(4),
            allowNull: true,
        },
        vat: {
            type: Sequelize.TINYINT(4),
            allowNull: true,
        },
        carstatus: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        showdashboard: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        ispickupavailable: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        isdropoffavailable: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        specificlocation: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        status: {
            type: Sequelize.TINYINT(4),
            allowNull: true,
            defaultValue: 1
        },
        category: {
            type: Sequelize.INTEGER(4),
            allowNull: true,
            defaultValue: 1
        },
        sortorder: {
            type: Sequelize.INTEGER(4),
            allowNull: true,
            defaultValue: 1
        },
        created_by: {
            type: Sequelize.INTEGER(4),
            allowNull: true,
        },

        created_at: {
            type: Sequelize.DATE,
            allowNull: true,
        },

        updated_by: {
            type: Sequelize.INTEGER(4),
            allowNull: true,
        },

        updated_at: {
            type: Sequelize.DATE,
            allowNull: true
        },

    },
    options: {
        timestamps: false,
        tableName: 'dcarinformation'
    }
};