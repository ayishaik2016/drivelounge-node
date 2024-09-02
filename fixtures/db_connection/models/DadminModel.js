"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types

module.exports = {
	name: "dadmin",
	define: {
		id: { // id must always exist
			type: Sequelize.INTEGER(4),
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,			
        },
        
        adminkey: {
			type: Sequelize.UUID, // Uses uuidv4 by default (default value is recommended)
            defaultValue: Sequelize.UUIDV4,		
			allowNull: true,
		},
		firstname: {
			type: Sequelize.STRING(250),
            allowNull: true,
		},
		lastname: {
			type: Sequelize.STRING(250),
            allowNull: true,
		},
        		
		username: {
			type: Sequelize.STRING(250),
            allowNull: true,
		},
		password: {
			type: Sequelize.STRING(250),
            allowNull: true,
		},
		email: {
			type: Sequelize.STRING(250),
            allowNull: true,
		},
		contactnumber: {
			type: Sequelize.STRING(250),
            allowNull: true,
		},
		zipcode: {
			type: Sequelize.STRING(250),
            allowNull: true,
		},
		cityid: {
			type: Sequelize.SMALLINT(4),
			allowNull: true,
		},
		countryid: {
			type: Sequelize.SMALLINT(4),
			allowNull: true,
		},		
		usertypeid: {
			type: Sequelize.SMALLINT(4),
			allowNull: true,
		},	
		roleid: {
			type: Sequelize.SMALLINT(4),
			allowNull: true,
		},				
		photopath: {
			type: Sequelize.STRING(100),
            allowNull: true,
		},
		devicetype: {
			type: Sequelize.STRING(100),
            allowNull: true,
		},
		devicetoken: {
			type: Sequelize.STRING(100),
            allowNull: true,
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
		},
		version: {
			type: Sequelize.DATE,
			allowNull: true
		},
		roleid: {
			type: Sequelize.SMALLINT(4),
			allowNull: true,
		},				
		
	},
	options: {
        timestamps: false,
        tableName: 'dadmin'
	}
};
