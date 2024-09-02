"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types

module.exports = {
	name: "dappconfig",
	define: {
		id: { // id must always exist
			type: Sequelize.INTEGER(4),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
        },
        appname: {
			type: Sequelize.STRING(100),            
			allowNull: false,
		},
		appdescription: {
			type: Sequelize.STRING(250),
            allowNull: false,
		},
		metakeyword: {
			type: Sequelize.STRING(100),
            allowNull: false,
		},
		metadescription: {
			type: Sequelize.STRING(250),
            allowNull: true,
		},
		email: {
			type: Sequelize.STRING(100),
            allowNull: false,
		},
		contactnumber: {
			type: Sequelize.STRING(20),
            allowNull: false,
		},
		contactaddress: {
			type: Sequelize.STRING(200),
            allowNull: false,
		},
		mapkey: {
			type: Sequelize.STRING(100),
            allowNull: false,
		},
		site_copyright: {
			type: Sequelize.STRING(100),
            allowNull: false,
		},
		
		currency_decimalplace: {
			type: Sequelize.INTEGER,
            allowNull: false,
		},
		currency_symbol: {
			type: Sequelize.BOOLEAN,
            allowNull: false,
		},
		commissiontype: {
			type: Sequelize.INTEGER,
            allowNull: false,
		},
		commissionvalue: {
			type: Sequelize.INTEGER,
            allowNull: false,
		},
		// devicetype: {
		// 	type: Sequelize.STRING(20),
        //     allowNull: false,
		// },
		// devicetoken: {
		// 	type: Sequelize.STRING(50),
        //     allowNull: false,
		// },
		site_logo: {
			type: Sequelize.STRING(250),
            allowNull: false,
		},
		fav_logo: {
			type: Sequelize.STRING(250),
            allowNull: false,
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
		}

	},
	options: {
        timestamps: false,
        tableName: 'dappconfig'
	}
};
