"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types


module.exports = {
	name: "dcreditcard",
	define: {
        id: { // id must always exist
			type: Sequelize.INTEGER(4),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,	
        },
        
        creditcardkey: { // Default Unique Key for Country 
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,	
			allowNull: true,
		},	
        userid: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
		cardholdername: {
			type: Sequelize.STRING(256),
            allowNull: true            
		},
		cardnumber: {
			type: Sequelize.Sequelize.STRING(20),
            allowNull: true            
		},	
        expirydate: {
			type: Sequelize.STRING(20),
            allowNull: true            
		},	
        cvv: {
			type: Sequelize.INTEGER,
            allowNull: true
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
			type: Sequelize.DATE(4),
			allowNull: true
		}
	},
	options: {
        timestamps: false,
        tableName: 'dcreditcard'
	}
};
