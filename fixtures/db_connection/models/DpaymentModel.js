"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types


module.exports = {
	name: "dpayment",
	define: {
        id: { // id must always exist
			type: Sequelize.INTEGER(4),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
        },
        paymentkey: { // Default Unique Key for Booking
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: true,
		},
		bookingid: {
			type: Sequelize.INTEGER,
            allowNull: true
		},		
        agencyid: {
			type: Sequelize.INTEGER,
            allowNull: true
		},	
		paid: {
			type: Sequelize.DECIMAL(12, 3),
            allowNull: true
		},
		other: {
			type: Sequelize.DECIMAL(12, 3),
            allowNull: true
		},
      
		status: {
			type: Sequelize.INTEGER(4),
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
			type: Sequelize.DATE(4),
			allowNull: true
		},
		version: {
			type: Sequelize.DATE,
			allowNull: true
		}
	},
	options: {
        timestamps: false,
        tableName: 'dpayment'
	}
};
