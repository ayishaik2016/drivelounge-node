"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types


module.exports = {
	name: "dcurrency",
	define: {
        id: { // id must always exist
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,	
        },
        name: {
			type: Sequelize.STRING(240),
            allowNull: false            
		},		
        code: {
			type: Sequelize.STRING(240),
            allowNull: false,
        }, 	
        symbol: {
			type: Sequelize.STRING(2),
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
        tableName: 'dcurrency'
	}
};
