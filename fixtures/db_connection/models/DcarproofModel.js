"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types


module.exports = {
	name: "dcarproof",
	define: {
        id: { // id must always exist
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,	
        },
        
       carproofkey: { // Default Unique Key for Country 
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,	
			allowNull: true,
		},
		sortorder: {
			type: Sequelize.INTEGER,
            allowNull: true            
		},	
		carid: {
			type: Sequelize.INTEGER,
            allowNull: true  
		},
		bookingid: {
			type: Sequelize.INTEGER,
            allowNull: true  
		},
        imageurl: {
			type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: true
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
        tableName: 'dcarproof'
	}
};
