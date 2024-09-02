"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types


module.exports = {
    name: "denquiry",
    define: {
        id: { // id must always exist
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },

        enquirykey: { // Default Unique Key for Country 
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: true,
        },
        firstname: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        lastname: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        email: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        contactnumber: {
            type: Sequelize.STRING(50),
            allowNull: true,
            defaultValue: 1
        },
        subject: {
            type: Sequelize.STRING(256),
            allowNull: true
        },
        content: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: 1
        },
        status: {
            type: Sequelize.INTEGER,
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
        tableName: 'denquiry'
    }
};