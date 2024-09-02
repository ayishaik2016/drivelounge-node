"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types


module.exports = {
    name: "dcms",
    define: {
        id: { // id must always exist
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },

        cmskey: { // Default Unique Key for Country 
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: true,
        },
        relatedpage: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        cmsstatus: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        status: {
            type: Sequelize.INTEGER(4),
            allowNull: true,
            defaultValue: 1
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
            type: Sequelize.DATE,
            allowNull: true
        }
    },
    options: {
        timestamps: false,
        tableName: 'dcms'
    }
};