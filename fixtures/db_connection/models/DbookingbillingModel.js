"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types


module.exports = {
	name: "dbookingbilling",
	define: {
        id: { // id must always exist
			type: Sequelize.INTEGER(4),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
        },
        bookingbillingkey: { // Default Unique Key for Booking
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: true,
		},
		bookingid: {
			type: Sequelize.INTEGER,
            allowNull: true
		},		
		deposit: {
			type: Sequelize.DECIMAL(12, 3),
            allowNull: true
		},
		priceperday: {
			type: Sequelize.DECIMAL(12, 3),
            allowNull: true
		},
        totalrentaldays: {
			type: Sequelize.INTEGER,
            allowNull: true
		},
		couponvalue: {
			type: Sequelize.DECIMAL(12, 3),
            allowNull: true
		},
		vat_percent: {
			type: Sequelize.INTEGER(8),
            allowNull: true
		},
		vat_amount: {
			type: Sequelize.DECIMAL(12, 3),
            allowNull: true
		},
        subtotal: {
			type: Sequelize.DECIMAL(12, 3),
            allowNull: true
		},
		totalcost: {
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
        tableName: 'dbookingbilling'
	}
};
