"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types

module.exports = {
	name: "dapplications",
	define: {
		id: { // id must always exist
			type: Sequelize.INTEGER(4),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
        },
        applicationkey: { // Default Unique Key for Country 
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,	
            allowNull: true,
        },	
        applicationno: {
			type: Sequelize.STRING(100),            
			allowNull: true,
		},
		applicationdate: {
			type: Sequelize.DATE,
            allowNull: false,
		},
		applicantname: {
			type: Sequelize.STRING(100),
            allowNull: false,
		},
		applicantemail: {
			type: Sequelize.STRING(250),
            allowNull: true,
		},
		applicationstatus: {
			type: Sequelize.TINYINT,
            allowNull: false,
			defaultValue: 3 // 1: approved 2: rejected 3: pending
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
        tableName: 'dapplications'
	}
};
