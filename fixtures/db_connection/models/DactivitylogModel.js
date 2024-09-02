"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types

module.exports = {
    name: "dactivitylog",
    define: {
        id: { // id must always exist
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,	
        },
        
        activitylogkey: { // Default Unique Key for Country 
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,	
            allowNull: true,
        },	
        clientagent: {
            type: Sequelize.STRING(256),
            allowNull: true            
        },
        clientplatform: {
            type: Sequelize.STRING(16),
            allowNull: true            
        },			
        clientip: {
            type: Sequelize.STRING(16),
            allowNull: true            
        },
        username: {
            type: Sequelize.STRING(250),
            allowNull: true            
        },
        log: {
            type: Sequelize.TEXT,
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
        tableName: 'dactivitylog'
    }
};
