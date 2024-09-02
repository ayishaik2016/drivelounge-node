"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types

module.exports = {
	name: "dcarsupportdocument",
	define: {
		id: { // id must always exist
			type: Sequelize.INTEGER(4),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,			
        },
        
        carsupportdocumentkey: {
			type: Sequelize.UUID, // Uses uuidv4 by default (default value is recommended)
            defaultValue: Sequelize.UUIDV4,		
			allowNull: true,
		},
		carinformationid: {
			type: Sequelize.INTEGER,
            allowNull: true,
		},
		sortorder: {
			type: Sequelize.INTEGER,
            allowNull: true,
        },
		supportdocumentname: {
			type: Sequelize.STRING(250),
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
        tableName: 'dcarsupportdocument'
	}
};
