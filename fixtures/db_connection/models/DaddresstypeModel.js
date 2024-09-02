"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types


module.exports = {
	name: "daddresstype",
	define: {
        id: { // id must always exist
			type: Sequelize.INTEGER(4),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,	
        },
        
        addresstypekey: { // Default Unique Key for Country 
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,	
			allowNull: true,
		},	
		addresstypenameen: {
			type: Sequelize.STRING(256),
            allowNull: true            
		},
		addresstypenamear: {
			type: Sequelize.STRING(16),
            allowNull: true            
		},		
        addresstypestatus: {
			type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1
        },	
		status: {
			type: Sequelize.INTEGER,
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
        tableName: 'daddresstype'
	}
};
