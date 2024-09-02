"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types

module.exports = {
    name: "dcarfeatures",
    define: {
        id: { // id must always exist
            type: Sequelize.INTEGER(4),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },

        carfeatureskey: {
            type: Sequelize.UUID, // Uses uuidv4 by default (default value is recommended)
            defaultValue: Sequelize.UUIDV4,
            allowNull: true,
        },
        carinformationid: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        carinsurance: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },

        cardropofdate: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        carmilege: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        carcylinder: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        cardriver: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        cardrivercharge: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        carsunroof: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        cartransmission: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        carseat: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        carspeed: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        carspeedlimit: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        cartype: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        status: {
            type: Sequelize.INTEGER,
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
        tableName: 'dcarfeatures'
    }
};