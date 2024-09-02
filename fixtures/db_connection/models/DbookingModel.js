"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types

module.exports = {
  name: "dbooking",
  define: {
    id: {
      // id must always exist
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    bookingkey: {
      // Default Unique Key for Booking
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: true,
    },
    agentid: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    carid: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    bookingcode: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    reservationcode: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    pickupplace: {
      type: Sequelize.STRING(250),
      allowNull: true,
    },
    pickupaddress: {
      type: Sequelize.STRING(250),
      allowNull: true,
    },
    pickupdate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    dropoffplace: {
      type: Sequelize.STRING(250),
      allowNull: true,
    },
    dropoffaddress: {
      type: Sequelize.STRING(250),
      allowNull: true,
    },
    dropoffdate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    withdriver: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    driveramount: {
      type: Sequelize.DECIMAL(12, 3),
      allowNull: true,
    },
    deposit: {
      type: Sequelize.DECIMAL(12, 3),
      allowNull: true,
    },
    priceperday: {
      type: Sequelize.DECIMAL(12, 3),
      allowNull: true,
    },
    totalrentaldays: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    couponcode: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    couponvalue: {
      type: Sequelize.DECIMAL(12, 3),
      allowNull: true,
    },
    vatpercent: {
      type: Sequelize.INTEGER(8),
      allowNull: true,
    },
    vatamount: {
      type: Sequelize.DECIMAL(12, 3),
      allowNull: true,
    },
    subtotal: {
      type: Sequelize.DECIMAL(12, 3),
      allowNull: true,
    },
    totalcost: {
      type: Sequelize.DECIMAL(12, 3),
      allowNull: true,
    },
    otheramount: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    paymentmode: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    paymentstatus: {
      type: Sequelize.TINYINT,
      allowNull: true,
      defaultValue: 0,
    },
    paymenttransactionid: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    bookingstatus: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 2,
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
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    cancellationreason: {
      type: Sequelize.STRING(1000),
      allowNull: true,
    },
    changerequest: {
      type: Sequelize.STRING(1000),
      allowNull: true,
    },
    changerequeststatus: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
    },
    usertype: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    // pickuplat: {
    //     type: Sequelize.STRING(250),
    //     allowNull: true
    // },
    // pikcuplang: {
    //     type: Sequelize.STRING(250),
    //     allowNull: true
    // },
    // droplat: {
    //     type: Sequelize.STRING(250),
    //     allowNull: true
    // },
    // droplang: {
    //     type: Sequelize.STRING(250),
    //     allowNull: true
    // },
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
      allowNull: true,
    },
    version: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    showmap: {
      type: Sequelize.TINYINT,
      allowNull: true,
      defaultValue: 0,
    },
  },
  options: {
    timestamps: false,
    tableName: "dbooking",
  },
};
