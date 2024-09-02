"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types


module.exports = {
	name: "dmodulelang",
	define: {
        id: { // id must always exist
			type: Sequelize.INTEGER(4),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,	
        },
        
        modulelangkey: { // Default Unique Key for Country 
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,	
			allowNull: true,
		},
		moduleid: {
			type: Sequelize.INTEGER(250),
            allowNull: true      
		},	
		languageid: {
			type: Sequelize.TINYINT(250),
            allowNull: true      
		},			
		langshortname: {
			type: Sequelize.STRING(50),
            allowNull: true            
		},	
		modulename: {
			type: Sequelize.STRING(256),
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
        tableName: 'dmodulelang'
	}
};
