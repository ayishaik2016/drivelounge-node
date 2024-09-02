"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types


module.exports = {
	name: "dcity",
	define: {
        id: { // id must always exist
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,	
        },
        
        areakey: { // Default Unique Key for Country 
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,	
			allowNull: true,
		},
		cityname: {
			type: Sequelize.STRING(16),
            allowNull: true            
		},	
        countryid: {
			type: Sequelize.INTEGER,
            allowNull: true            
		},	
		cityimage: {
			type: Sequelize.STRING(256),
            allowNull: true  
		},
        citystatus: {
			type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1
        }, 	
		showdashboard: {
			type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: 0
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
        tableName: 'dcity'
	}
};
