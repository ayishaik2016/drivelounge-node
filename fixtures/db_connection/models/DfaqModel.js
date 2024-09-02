"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types


module.exports = {
    name: "dfaq",
    define: {
        id: { // id must always exist
            type: Sequelize.INTEGER(4),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },

        faqkey: { // Default Unique Key for Country 
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: true,
        },
        faqstatus: {
            type: Sequelize.SMALLINT(4),
            allowNull: true
        },
        sortorder: {
            type: Sequelize.INTEGER(4),
            allowNull: true,
        },
        status: {
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
        tableName: 'dfaq'
    }
};