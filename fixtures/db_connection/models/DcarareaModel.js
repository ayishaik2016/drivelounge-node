"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types

module.exports = {
	name: "dcararea",
	define: {
		id: { // id must always exist
			type: Sequelize.INTEGER(4),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,			
        },
        
        carareakey: {
			type: Sequelize.UUID, // Uses uuidv4 by default (default value is recommended)
            defaultValue: Sequelize.UUIDV4,		
			allowNull: true,
		},
		carid: {
			type: Sequelize.INTEGER,
            allowNull: true,
		},
		agentid: {
			type: Sequelize.INTEGER,
            allowNull: true,
		},
		areaid: {
			type: Sequelize.INTEGER,
            allowNull: true,
		},
        cityid: {
			type: Sequelize.INTEGER,
            allowNull: true,
		},
        countryid: {
			type: Sequelize.INTEGER,
            allowNull: true,
		},
        status: {
			type: Sequelize.INTEGER,
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
        tableName: 'dcararea'
	}
};
