"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types


module.exports = {
	name: "dpushnotification",
	define: {
        id: { // id must always exist
			type: Sequelize.INTEGER(4),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,	
        },
        
        pushnotificationkey: { // Default Unique Key for Country 
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,	
			allowNull: true,
		},		
		notificationapptype: {
			type: Sequelize.STRING(250),
            allowNull: true      
		},			
		type: {
			type: Sequelize.STRING(50),
            allowNull: true            
		},
		port: {
			type: Sequelize.INTEGER,
            allowNull: true            
		},
		title: {
			type: Sequelize.STRING(250),
            allowNull: false            
		},
		message: {
			type: Sequelize.TEXT('long'),
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
        tableName: 'dpushnotification'
	}
};
