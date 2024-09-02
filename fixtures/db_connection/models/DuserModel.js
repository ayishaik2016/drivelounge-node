"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types

module.exports = {
	name: "duser",
	define: {
		id: { // id must always exist
			type: Sequelize.INTEGER(4),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
        },

        userkey: {
			type: Sequelize.UUID, // Uses uuidv4 by default (default value is recommended)
            defaultValue: Sequelize.UUIDV4,
			allowNull: true,
		},
		firstname: {
			type: Sequelize.STRING(250),
            allowNull: true,
		},
		lastname: {
			type: Sequelize.STRING(250),
            allowNull: true,
		},
		username: {
			type: Sequelize.STRING(250),
            allowNull: true,
		},
		password: {
			type: Sequelize.STRING(250),
            allowNull: true,
		},
		email: {
			type: Sequelize.STRING(250),
            allowNull: true,
		},
		countrycode: {
			type: Sequelize.STRING(250),
            allowNull: true,
		},
		contactnumber: {
			type: Sequelize.STRING(20),
            allowNull: true,
		},
		countryid: {
			type: Sequelize.SMALLINT,
			allowNull: true,
		},
		cityid: {
			type: Sequelize.SMALLINT,
			allowNull: true,
		},
		isverified: {
			type: Sequelize.SMALLINT,
			allowNull: true,
			defaultValue: 0
		},
		otp: {
			type: Sequelize.STRING(20),
			allowNull: true,
		},
		otpreference: {
			type: Sequelize.STRING(64),
			allowNull: true,
		},
		usertypeid: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		roleid: {
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: 0
		},
		panel: {
			type: Sequelize.STRING(50),
			allowNull: true,
		},
		socialtypeid: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		socialkey: {
			type: Sequelize.STRING(256),
			allowNull: true,
		},
		drivinglicense: {
			type: Sequelize.STRING(255),
            allowNull: true,
		},
		photopath: {
			type: Sequelize.STRING(255),
            allowNull: true,
		},
		devicetype: {
			type: Sequelize.STRING(45),
            allowNull: true,
		},
		devicetoken: {
			type: Sequelize.STRING(45),
            allowNull: true,
		},
		userstatus: {
			type: Sequelize.TINYINT,
            allowNull: true,
            defaultValue: 1
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
		},
		version: {
			type: Sequelize.DATE,
			allowNull: true
		},
		address: {
			type: Sequelize.STRING(500),
            allowNull: true,
		},

	},
	options: {
        timestamps: false,
        tableName: 'duser'
	}
};
