"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types

module.exports = {
    name: "dcaradditional",
    define: {
        id: { // id must always exist
            type: Sequelize.INTEGER(4),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },

        caradditionalkey: {
            type: Sequelize.UUID, // Uses uuidv4 by default (default value is recommended)
            defaultValue: Sequelize.UUIDV4,
            allowNull: true,
        },
        carid: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        radio: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        cdplayer: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        mp3player: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        gpstracker: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        dvdplayer: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        bluetooth: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        pendrive: {
            type: Sequelize.BOOLEAN,
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
        tableName: 'dcaradditional'
    }
};