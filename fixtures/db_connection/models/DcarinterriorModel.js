"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types

module.exports = {
	name: "dcarinterrior",
	define: {
		id: { // id must always exist
			type: Sequelize.INTEGER(4),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,			
        },
        
        carinterriorkey: {
			type: Sequelize.UUID, // Uses uuidv4 by default (default value is recommended)
            defaultValue: Sequelize.UUIDV4,		
			allowNull: true,
		},
		carid: {
			type: Sequelize.INTEGER,
            allowNull: true,
		},
		carinformationid: {
			type: Sequelize.INTEGER,
            allowNull: true,
		},
		carinterriorimagename: {
			type: Sequelize.STRING(250),
            allowNull: true,
		},
		carimageorderid: {
			type: Sequelize.TINYINT,
            allowNull: true,
		},
		carcoverimage:{
			type: Sequelize.BOOLEAN,
            allowNull: true,
			defaultValue: false
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
		}			
		
	},
	options: {
        timestamps: false,
        tableName: 'dcarinterrior'
	}
};
