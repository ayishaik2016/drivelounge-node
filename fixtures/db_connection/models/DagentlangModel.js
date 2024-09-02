"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types

module.exports = {
	name: "dagentlang",
	define: {
		id: { // id must always exist
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
        },
        agentlangkey: {
			type: Sequelize.UUID, // Uses uuidv4 by default (default value is recommended)
            defaultValue: Sequelize.UUIDV4,
			allowNull: true,
		},
		languageid: {
			type: Sequelize.TINYINT,
            allowNull: true
		},
		langshortname: {
			type: Sequelize.STRING(50),
            allowNull: true
		},
		agentid: {
			type: Sequelize.INTEGER,
            allowNull: true
		},
		agentname: {
			type: Sequelize.STRING(250),
            allowNull: true,
		},
		agentdescription: {
			type: Sequelize.TEXT('long'),
            allowNull: true,
		},
		agentaddress: {
			type: Sequelize.TEXT('long'),
            allowNull: true,
		},
		status: {
			type: Sequelize.TINYINT,
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
        tableName: 'dagentlang'
	}
};
