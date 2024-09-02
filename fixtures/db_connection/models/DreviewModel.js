"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types


module.exports = {
    name: "dreview",
    define: {
        id: { // id must always exist
            type: Sequelize.INTEGER(4),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },

        reviewkey: { // Default Unique Key for Country
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: true,
        },
        bookingid: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        userid: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        agentid: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        carid: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        rating: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: true
        },
        title: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        isreview: {
            type: Sequelize.SMALLINT,
            allowNull: true,
            defaultValue: 0
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
        },
        version: {
            type: Sequelize.DATE,
            allowNull: true
        }
    },
    options: {
        timestamps: false,
        tableName: 'dreview'
    }
};