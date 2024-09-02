"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types


module.exports = {
	name: "dagentcoupon",
	define: {
        id: { // id must always exist
			type: Sequelize.INTEGER(4),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
        },
        usercouponkey: { // Key for coupon
			type: Sequelize.UUID, 
            defaultValue: Sequelize.UUIDV4,		
			allowNull: true,
		},
        agentid: {
            type: Sequelize.INTEGER(8),
			allowNull: true,
        },
		couponid:{
			type: Sequelize.INTEGER(8),
			allowNull: true,
		},
		couponcode: {
			type: Sequelize.STRING(250),
			allowNull: true,
		},		
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
        tableName: 'dagentcoupon'
	}
};
