"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types


module.exports = {
	name: "dcoupon",
	define: {
        id: { // id must always exist
			type: Sequelize.INTEGER(4),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
        },
        couponkey: { // Key for voucher
			type: Sequelize.UUID, 
            defaultValue: Sequelize.UUIDV4,		
			allowNull: true,
		},
		couponcode: {
			type: Sequelize.STRING(250),
			allowNull: true,
		},
		couponvalue: {
			type: Sequelize.INTEGER(8),
			allowNull: true,
		},
		startdate: {
			type: Sequelize.STRING(250),
			allowNull: true,
		},
		expirydate: {
			type: Sequelize.STRING(250),
			allowNull: true,
		},
		minvalue: {
			type: Sequelize.DECIMAL(12,3),
			allowNull: true,
		},
		isallagent: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
		},
		isalluser: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
		},
		// couponapptype: {
		// 	type: Sequelize.INTEGER(8),
		// 	allowNull: true,
		// },
		// coupontype:{
		// 	type: Sequelize.INTEGER(8),
		// 	allowNull: true,
		// },
		// repetivetern: {
		// 	type: Sequelize.TINYINT,
		// 	allowNull: true,
		// },
		status: {
			type: Sequelize.TINYINT(4),
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
		version: {
			type: Sequelize.DATE,
			allowNull: true
		}
	},
	options: {
        timestamps: false,
        tableName: 'dcoupon'
	}
};
