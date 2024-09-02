"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types

module.exports = {
	name: "drole",
	define: {
		id: { // id must always exist
			type: Sequelize.INTEGER(4),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
        },
        rolekey: {
			type: Sequelize.UUID, // Uses uuidv4 by default (default value is recommended)
            defaultValue: Sequelize.UUIDV4,
			allowNull: true,
		},
		rolename: {
			type: Sequelize.STRING(250),
            allowNull: true,
		},
		role_status: {
			type: Sequelize.TINYINT(4),
            allowNull: true,
            defaultValue: 1
        },
		status: {
			type: Sequelize.TINYINT(4),
            allowNull: true,
            defaultValue: 1
        },
		created_by: {
			type: Sequelize.INTEGER(8),
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
		version: {
			type: Sequelize.DATE,
			allowNull: true
		}

	},
	options: {
        timestamps: false,
        tableName: 'drole'
	}
};
