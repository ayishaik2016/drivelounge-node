"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types

module.exports = {
    name: "dbookingfeature",
    define: {
        id: { // id must always exist
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        bookingfeaturekey: { // Default Unique Key for Booking
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: true,
        },
        
        bookingid: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        pickupcityid: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        dropcityid: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },       
        tripstart: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        tripstartdate: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        tripend: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        tripenddate: {
            type: Sequelize.DATE,
            allowNull: true,
        },
               
        pickuplat: {
            type: Sequelize.STRING(250),
            allowNull: true
        },
        pickuplang: {
            type: Sequelize.STRING(250),
            allowNull: true
        },
        droplat: {
            type: Sequelize.STRING(250),
            allowNull: true
        },
        droplang: {
            type: Sequelize.STRING(250),
            allowNull: true
        },
        created_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },

        created_at: {
            type: Sequelize.DATE,
            allowNull: true,
        },

        updated_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },

        updated_at: {
            type: Sequelize.DATE(4),
            allowNull: true
        },
        version: {
            type: Sequelize.DATE,
            allowNull: true
        }
    },
    options: {
        timestamps: false,
        tableName: 'dbookingfeature'
    }
};