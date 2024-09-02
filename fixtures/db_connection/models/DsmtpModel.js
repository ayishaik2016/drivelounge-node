"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types


module.exports = {
	name: "dsmtp",
	define: {
        id: { // id must always exist
			type: Sequelize.INTEGER(4),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,	
        },
        
        smtpkey: { // Default Unique Key for Country 
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,	
			allowNull: true,
		},	
		smtphost: {
			type: Sequelize.STRING(250),
            allowNull: true      
		},	
        smtpencryption: {
			type: Sequelize.STRING(250),
            allowNull: true      
		},
        smtpport: {
			type: Sequelize.INTEGER,
            allowNull: true      
		},
		smtpusername: {
			type: Sequelize.STRING(250),
            allowNull: true      
		},	
        smtppassword: {
			type: Sequelize.STRING(250),
            allowNull: true      
		},
        smtpisenabled: {
			type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: true      
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
		}
	},
	options: {
        timestamps: false,
        tableName: 'dsmtp'
	}
};