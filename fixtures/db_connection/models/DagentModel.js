"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types

module.exports = {
    name: "dagent",
    define: {
        id: { // id must always exist
            type: Sequelize.INTEGER(4),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },

        agentkey: {
            type: Sequelize.UUID, // Uses uuidv4 by default (default value is recommended)
            defaultValue: Sequelize.UUIDV4,
            allowNull: true,
        },
        isfeatured: {
            type: Sequelize.TINYINT, //whether the client is paid for preference
            allowNull: false,
            defaultValue: 0
        },
        firstname: {
            type: Sequelize.STRING(150),
            allowNull: true,
        },
        lastname: {
            type: Sequelize.STRING(150),
            allowNull: true,
        },
        username: {
            type: Sequelize.STRING(150),
            allowNull: true,
        },
        email: {
            type: Sequelize.STRING(200),
            allowNull: true,
        },
        password: {
            type: Sequelize.STRING(250),
            allowNull: true,
        },
        agencyname: {
            type: Sequelize.STRING(250),
            allowNull: true,
        },
        latitude: {
            type: Sequelize.DECIMAL(12, 9),
            allowNull: true,
        },
        longitude: {
            type: Sequelize.DECIMAL(12, 9),
            allowNull: true,
        },
        countryid: {
            type: Sequelize.SMALLINT(4),
            allowNull: true,
        },
        cityid: {
            type: Sequelize.SMALLINT(4),
            allowNull: true,
        },
        areaid: {
            type: Sequelize.SMALLINT(4),
            allowNull: true,
        },
        commissiontype: {
            type: Sequelize.STRING(100),
            allowNull: true,
            defaultValue: 0
        },
        commissionvalue: {
            type: Sequelize.STRING(100),
            allowNull: true,
            defaultValue: 0
        },
        contactnumber: {
            type: Sequelize.STRING(250),
            allowNull: true,
        },
        crnumber: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        crdocs: {
            type: Sequelize.STRING(250),
            allowNull: true,
        },
        sortorder: {
            type: Sequelize.STRING(250),
            allowNull: true,
        },
        vat: {
            type: Sequelize.SMALLINT,
            allowNull: true,
            defaultValue: 0
        },
        vatnumber: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        vatdocs: {
            type: Sequelize.STRING(250),
            allowNull: true,
        },
        agentstatus: {
            type: Sequelize.SMALLINT,
            allowNull: true,
        },
        servicelocation: {
            type: Sequelize.STRING(100),
            allowNull: true,
        },
        address: {
            type: Sequelize.STRING(250),
            allowNull: true,
        },
        paymentoption: {
            type: Sequelize.STRING(100),
            allowNull: true,
        },
        usertypeid: {
            type: Sequelize.SMALLINT(4),
            allowNull: true,
        },
        socialtypeid: {
            type: Sequelize.SMALLINT(4),
            allowNull: true,
        },
        socialkey: {
            type: Sequelize.STRING(256),
            allowNull: true,
        },
        devicetype: {
            type: Sequelize.STRING(45),
            allowNull: true,
        },
        devicetoken: {
            type: Sequelize.STRING(45),
            allowNull: true,
        },
        photopath: {
            type: Sequelize.STRING(250),
            allowNull: true,
        },
        // licensepath: {
        //     type: Sequelize.STRING(250),
        //     allowNull: true,
        // },
        otp: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        isverified: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        status: {
            type: Sequelize.TINYINT(4),
            allowNull: true,
            defaultValue: 1
        },
        vatstatus: {
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
        }

    },
    options: {
        timestamps: false,
        tableName: 'dagent'
    }
};