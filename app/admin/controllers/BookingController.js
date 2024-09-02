"use strict";
// DEVELOPED ON 14-07-2023
const { MoleculerError } = require("moleculer").Errors;
const pipe = require("pipe");
const CodeTypes = require("../../../fixtures/error.codes");
const Constants = require("../../../plugin/constants");
const ConstantsMailTemplate = require("../../../plugin/constants-mail-template");
const Database = require("../../../adapters/Database");
const fs = require("fs");
const path = require("path");
const webPush = require("web-push");
const Config = require("../../../config");
const { finished } = require("stream");
const Op = require("sequelize").Op;
const mail_template = __dirname;
const handlebars = require("handlebars");

const activity = require("../../../helpers/activitylog");
const dlMailer = require("../../../helpers/DLMailer");
const dlTimer = require("../../../helpers/DLTimer");

const Sequ = require("sequelize");
const { QueryTypes } = require("sequelize");
let config = Config.get('/mssqlEnvironment');
const sequelize12 = new Sequ(config.database, config.username, config.password, {
  host: config.host,
    dialect: config.dialect,
  port: config.port,
  options: {
    encrypt: false,
  },
  dialectOptions: {
    options: {
      encrypt: false,
    },
  },
  instancename: "MSQLEXPRESS",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
//Models

const Booking = new Database("Dbooking");
const BookingFeature = new Database("Dbookingfeature");
const Payment = new Database("Dpaymentmethod");
const CarProof = new Database("Dcarproof");
// const Bookingfilt = new Database("Dbooking", [
//     "id",
//     "bookingkey",
//     "bookingno",
//     "vendorid",
//     "customerid",
//     "service_date",
//     "service_time",
//     "subtotal",
//     "mincartvalue",
//     "coupon_code",
//     "actualrate",
//     "discountvalue",
//     "vat_percent",
//     "vat_amount",
//     "totalcost",
//     "payment_method",
//     "payment_status",
//     "booking_status",
//     "devicetype",
//     "devicetoken",
//     "location",
//     "status"
// ]);
const BookingBilling = new Database("Dbookingbilling");
// const Bookingsublistfilt = new Database("Tbookingsublist", [
//     "id",
//     "bookingsublistkey",
//     "bookingid",
//     "vendorid",
//     "serviceid",
//     "servicename",
//     "servicecost",
//     "status"
// ]);
const UsedCoupon = new Database("Dusedcoupon");
const UserCoupon = new Database("Dusercoupon");
const Coupon = new Database("Dcoupon");

const User = new Database("Duser");
const CreditCard = new Database("Dcreditcard");
const Admin_Payment = new Database("Dpayment");
const Appconfig = new Database("Dappconfig");
const AgentConfig = new Database("Dagent");
// const Vendorcoupon = new Database("Mvendorcoupon");
// const Vendorfilt = new Database("Mvendor");
// const Vendorlangfilt = new Database("Mvendorlang");
// const Citylang = new Database("Mcitylang");
// const CountryLang = new Database("Mcountrylang");
// const Bookingstatus = new Database("Mbookingstatus",[
//     "id",
//     "bookingstatuskey",
//     "bookingstatus",
//     "status"
// ]);
//DEFAULT STATUS VALUES SEE IN CONSTANTS JS FILE

const { STATUS, DELETE, ACTIVE, INACTIVE, RESERVATION, BOOKED } = Constants;

module.exports = {
  // Reservation
  create: async function (ctx) {
    // activity.getUser(ctx, ctx.meta.user.id, ctx.meta.user.usertypeid).then((res) => {
    //     ctx.meta.username = res.data.email;
    //     activity.setLog(ctx);
    // });
    const AgencyEmail = await AgentConfig.find(ctx, {
      query: { id: ctx.params.agentid, status: 1 },
    }).then((res) => {
      return res.data;
    });
    return Booking.insert(ctx, {
      agentid: ctx.params.agentid,
      carid: ctx.params.carid,
      reservationcode: this.randombookingnum(),
      bookingcode: Math.floor(
        Math.pow(10, 6 - 1) + Math.random() * 8 * Math.pow(10, 6 - 1)
      ), //(new Date().getTime()).toString(36).toUpperCase(),// this.randombookingnum(),
      pickupplace: ctx.params.pickupplace,
      pickupdate: ctx.params.pickupdate,
      dropoffplace: ctx.params.dropplace,
      dropoffdate: ctx.params.dropoffdate,
      withdriver: ctx.params.withdriver,
      driveramount: ctx.params.driveramount,
      deposit: ctx.params.deposit,
      priceperday: ctx.params.priceperday,
      totalrentaldays: ctx.params.totalrentaldays,
      couponcode: ctx.params.couponcode,
      couponvalue: ctx.params.couponvalue,
      vatpercent: ctx.params.vatpercent,
      vatamount: ctx.params.vatamount,
      subtotal: ctx.params.subtotal,
      totalcost: ctx.params.totalcost,
      otheramount: ctx.params.otheramount,
      paymentmode: ctx.params.paymentmode,
      paymentstatus: ctx.params.paymentstatus,
      paymenttransactionid: ctx.params.paymenttransactionid,
      pickupaddress: ctx.params.pickupaddress,
      dropoffaddress: ctx.params.dropoffaddress,
      showmap: ctx.params.showmap,
      bookingstatus: 2,
    })
      .then((res) => {
        return BookingFeature.insert(ctx, {
          bookingid: res.data.id,
          pickupcityid: ctx.params.pickcityid,
          dropcityid: ctx.params.dropcityid,
          pickuplat: ctx.params.pickuplat,
          pickuplang: ctx.params.pickuplng,
          droplat: ctx.params.droplat,
          droplang: ctx.params.droplng,
        })
          .then(async (_res) => {
            return User.findOne(ctx, {
              query: { id: res.data.created_by },
            }).then(async (ans) => {

              return await sequelize12
              .query("exec sp_GetBookingInformationByID_new @Id=:id, @Lang=:lang", {
                replacements: { id: res.data.id, lang: 1 },
                type: Sequ.QueryTypes.SELECT,
              })
                  .then(async (carDetails) => {

                  const AgencyEmail = await AgentConfig.find(ctx, {
                      query: { id: ctx.params.agentid, status: 1 },
                    }).then((res) => {
                      return res.data;
                    });

                  console.log(
                    "------------------------------------------------------"
                  );
                  console.log(ans.data);
                  console.log(
                    "-------------------------------------------------------"
                  );
                  ctx.meta.log = "New booking added by user without coupon.";


                  let replacements = {
                    name: `${ans.data.firstname} ${ans.data.lastname}`,
                    booking_number: res.data.bookingcode,
                    booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
                    pickup_city: res.data.pickupplace,
                    dropoff_city: res.data.dropoffplace,
                    pickup_date_time: dlTimer.convertToLocal(ctx, res.data.pickupdate.toISOString()),
                    dropoff_date_time: dlTimer.convertToLocal(ctx, res.data.dropoffdate.toISOString()),

                    price_per_date: res.data.priceperday,
                    total_rental_days: res.data.totalrentaldays,
                    vat: res.data.vatamount,
                    total_cost: res.data.totalcost,
                    deposit: res.data.deposit,
                    coupon_value: res.data.couponvalue,

                    booking_user_name: carDetails[0].fullname,
                    booking_user_contact_number: carDetails[0].contactnumber,
                    booking_user_email: carDetails[0].email,
                    booking_user_address: carDetails[0].address,

                    booking_agency_name: carDetails[0].agencyname,
                    booking_agency_contact_number: carDetails[0].agencycontact,
                    booking_agency_address: carDetails[0].agencyaddress,
                    booking_agency_address_lat:carDetails[0].agentlat,
                    booking_agency_address_lng:carDetails[0].agentlang,

                    receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
                    receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
                    receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
                    showmap: carDetails[0].showmap == 1 ? true : false,

                    car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
                    car_number: carDetails[0].carno,
                    make: carDetails[0].carbrand,
                    car_year: carDetails[0].caryear,
                    car_model: carDetails[0].carmodel,

                    // car_image_path: 'https://api.drivelounge.com/' + res.data.imageurl,
                    // car_number: res.data.carid,
                    // make: res.data.make,
                    // car_year: res.data.caryear,
                    // car_model: res.data.dropoffplace,

                    subject: ConstantsMailTemplate.UserUserCarBookingSubject,
                  };

                  dlMailer.sendMail(ctx, ConstantsMailTemplate.UserUserCarBooking, ans.data.email, replacements);

                  replacements = {
                    booking_number: res.data.bookingcode,
                    booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
                    pickup_city: res.data.pickupplace,
                    dropoff_city: res.data.dropoffplace,
                    pickup_date_time: dlTimer.convertToLocal(ctx, res.data.pickupdate.toISOString()),
                    dropoff_date_time: dlTimer.convertToLocal(ctx, res.data.dropoffdate.toISOString()),

                    price_per_date: res.data.priceperday,
                    total_rental_days: res.data.totalrentaldays,
                    vat: res.data.vatamount,
                    total_cost: res.data.totalcost,
                    deposit: res.data.deposit,
                    coupon_value: res.data.couponvalue,

                    booking_user_name: carDetails[0].fullname,
                    booking_user_contact_number: carDetails[0].contactnumber,
                    booking_user_email: carDetails[0].email,
                    booking_user_address: carDetails[0].address,

                    booking_agency_name: carDetails[0].agencyname,
                    booking_agency_contact_number: carDetails[0].agencycontact,
                    booking_agency_address: carDetails[0].agencyaddress,
                    booking_agency_address_lat:carDetails[0].agentlat,
                    booking_agency_address_lng:carDetails[0].agentlang,

                    receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
                    receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
                    receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
                    showmap: carDetails[0].showmap == 1 ? true : false,

                    car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
                    car_number: carDetails[0].carno,
                    make: carDetails[0].carbrand,
                    car_year: carDetails[0].caryear,
                    car_model: carDetails[0].carmodel,

                    agency_name: AgencyEmail[0].agencyname,
                    subject: ConstantsMailTemplate.AgencyUserCarBookingSubject,
                  };

                  dlMailer.sendMail(ctx, ConstantsMailTemplate.AgencyUserCarBooking, AgencyEmail[0].email, replacements);

                  replacements = {
                    booking_number: res.data.bookingcode,
                    booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
                    pickup_city: res.data.pickupplace,
                    dropoff_city: res.data.dropoffplace,
                    pickup_date_time: dlTimer.convertToLocal(ctx, res.data.pickupdate.toISOString()),
                    dropoff_date_time: dlTimer.convertToLocal(ctx, res.data.dropoffdate.toISOString()),

                    price_per_date: res.data.priceperday,
                    total_rental_days: res.data.totalrentaldays,
                    vat: res.data.vatamount,
                    total_cost: res.data.totalcost,
                    deposit: res.data.deposit,
                    coupon_value: res.data.couponvalue,

                    booking_user_name: carDetails[0].fullname,
                    booking_user_contact_number: carDetails[0].contactnumber,
                    booking_user_email: carDetails[0].email,
                    booking_user_address: carDetails[0].address,

                    booking_agency_name: carDetails[0].agencyname,
                    booking_agency_contact_number: carDetails[0].agencycontact,
                    booking_agency_address: carDetails[0].agencyaddress,
                    booking_agency_address_lat:carDetails[0].agentlat,
                    booking_agency_address_lng:carDetails[0].agentlang,

                    receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
                    receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
                    receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
                    showmap: carDetails[0].showmap == 1 ? true : false,

                    car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
                    car_number: carDetails[0].carno,
                    make: carDetails[0].carbrand,
                    car_year: carDetails[0].caryear,
                    car_model: carDetails[0].carmodel,

                    agency_name: AgencyEmail[0].agencyname,
                    subject: ConstantsMailTemplate.AdminUserCarBookingSubject,
                  };

                  dlMailer.sendMail(ctx, ConstantsMailTemplate.AdminUserCarBooking, Constants.AdminMailId, replacements);

                  /*
                  //activity.setLog(ctx);
                  // Sending mail after user update
                  let readHTMLFile = function (path, callback) {
                    fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
                      if (err) {
                        throw err;
                      } else {
                        callback(null, html);
                      }
                    });
                  };

                  //Reads the html template,body of the mail content
                  readHTMLFile(
                    mail_template + "/UserBookingtemplate.html",
                    function (err, html) {
                      let template = handlebars.compile(html);
                      let replacements = {
                        username: `${ans.data.firstname} ${ans.data.lastname}`,
                        bookingnumber: ans.data.bookingcode,
                        subject: "Car Booking",
                      };
                      const htmlToSend = template(replacements);
                      // this method call the mail service to send mail
                      ctx
                        .call("mail.send", {
                          to: ans.data.email,
                          subject: "Car Booking",
                          html: htmlToSend,
                        })
                        .then((res) => {
                          ctx.meta.log = `"Email sent to ${ans.data.firstname} ${ans.data.lastname} successfully`;
                          activity.setLog(ctx);
                        });
                    }
                  );

                  //Reads the html template,body of the mail content
                  readHTMLFile(
                    mail_template + "/AgentBookingtemplate.html",
                    function (err, html) {
                      let template = handlebars.compile(html);
                      let replacements = {
                        bookingnumber: ans.data.bookingcode,
                        subject: "Car Booking",
                        booking_id: ans.data.bookingcode,
                        booking_cost: ans.data.totalcost,
                      };
                      const htmlToSend = template(replacements);
                      // this method call the mail service to send mail
                      ctx
                        .call("mail.send", {
                          to: AgencyEmail[0].email,
                          subject: "Car Booking",
                          html: htmlToSend,
                        })
                        .then((res) => {
                          ctx.meta.log = `"Email sent to agent successfully`;
                          activity.setLog(ctx);
                        });
                    }
                  );
                  */

                  return this.requestSuccess("Car reserved", _res);
                });
              });

            // const {cardcvv, cardexpiry, cardholdername, carnumber} = ctx.params.cardinfo;
            // return await sequelize12.query('exec sp_CreditCardInformation @Id=:id,@name=:name,@cardnumber=:cardnumber,@expiry=:expiry,@cvv=:cvv', {
            //     replacements: { id: res.data.created_by, name: cardholdername, cardnumber: carnumber, expiry: cardexpiry, cvv: cardcvv },
            //     type: Sequ.QueryTypes.SELECT
            // }).then(resData => {
            //     console.log(res)
            //     return this.requestSuccess("Car reserved", res);
            // }).catch(err =>{
            //     return this.requestError("Car reserved", res);
            // })
          })
          .catch((err) => {
            console.log(err);
            return this.requestError("Car reserved", res);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  admin_pay: function (ctx) {
    return Admin_Payment.insert(ctx, {
      bookingid: ctx.params.bookingid,
      agencyid: ctx.params.agencyid,
      paid: ctx.params.payment,
      status: ctx.params.status,
    })
      .then((res) => {
        return this.requestSuccess("Amount paid", res);
      })
      .catch((err) => {
        console.log(err);
        return this.requestError("Error has occured", err);
      });
  },

  update_info: async function (ctx) {
    return Booking.updateBy(
      ctx,
      ctx.params.id,
      {
        pickupplace: ctx.params.pickupplace,
        pickupdate: ctx.params.pickupdate,
        dropoffplace: ctx.params.dropplace,
        dropoffdate: ctx.params.dropoffdate,
        totalrentaldays: ctx.params.totalrentaldays,
        vatamount: ctx.params.vatamount,
        subtotal: ctx.params.subtotal,
        totalcost: ctx.params.totalcost,
        pickupaddress: ctx.params.pickupaddress,
        dropoffaddress: ctx.params.dropoffaddress,
        changerequeststatus: 0,
      },
      {
        query: { id: ctx.params.id },
      }
    ).then((booking) => {
      return BookingFeature.updateBy(
        ctx,
        ctx.params.id,
        {
          pickupcityid: ctx.params.pickupcityid,
          dropcityid: ctx.params.dropcityid,
          pickuplat: ctx.params.pickuplat,
          pickuplang: ctx.params.pickuplng,
          droplat: ctx.params.droplat,
          droplang: ctx.params.droplng,
        },
        {
          query: { bookingid: ctx.params.id },
        }
      ).then((res) => {
        return User.findOne(ctx, {
          query: { id: booking.data[0].created_by },
        }).then(async (ans) => {
          ctx.meta.log = "New booking added by user without coupon.";
          activity.setLog(ctx);


          const AgencyEmail = await AgentConfig.find(ctx, {
            query: { id: ctx.params.agentid, status: 1 },
          }).then((res) => {
            return res.data;
          });

        console.log(
          "------------------------------------------------------"
        );
        console.log(ans.data);
        console.log(
          "-------------------------------------------------------"
        );
        ctx.meta.log = "Booking updated by user without coupon.";


        return await sequelize12
        .query("exec sp_GetBookingInformationByID_new @Id=:id, @Lang=:lang", {
          replacements: { id: ctx.params.id, lang: 1 },
          type: Sequ.QueryTypes.SELECT,
        })
            .then(async (carDetails) => {

          let replacements = {
            name: `${ans.data.firstname} ${ans.data.lastname}`,
            booking_number: booking.data[0].bookingcode,
            booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
            pickup_city: booking.data[0].pickupplace,
            dropoff_city: booking.data[0].dropoffplace,
            pickup_date_time: dlTimer.convertToLocal(ctx, booking.data[0].pickupdate.toISOString()),
            dropoff_date_time: dlTimer.convertToLocal(ctx, booking.data[0].dropoffdate.toISOString()),

            price_per_date: booking.data[0].priceperday,
            total_rental_days: booking.data[0].totalrentaldays,
            vat: booking.data[0].vatamount,
            total_cost: booking.data[0].totalcost,
            deposit: booking.data[0].deposit,
            coupon_value: booking.data[0].couponvalue,

            booking_user_name: carDetails[0].fullname,
            booking_user_contact_number: carDetails[0].contactnumber,
            booking_user_email: carDetails[0].email,
            booking_user_address: carDetails[0].address,

            booking_agency_name: carDetails[0].agencyname,
            booking_agency_contact_number: carDetails[0].agencycontact,
            booking_agency_address: carDetails[0].agencyaddress,
            booking_agency_address_lat:carDetails[0].agentlat,
            booking_agency_address_lng:carDetails[0].agentlang,

            receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
            receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
            receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
            showmap: carDetails[0].showmap == 1 ? true : false,

            car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
            car_number: carDetails[0].carno,
            make: carDetails[0].carbrand,
            car_year: carDetails[0].caryear,
            car_model: carDetails[0].carmodel,

            subject: ConstantsMailTemplate.UserUserCarBookingSubject,
          };

          dlMailer.sendMail(ctx, ConstantsMailTemplate.UserUserCarBooking, ans.data.email, replacements);

          replacements = {
            booking_number: booking.data[0].bookingcode,
            booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
            pickup_city: booking.data[0].pickupplace,
            dropoff_city: booking.data[0].dropoffplace,
            pickup_date_time: dlTimer.convertToLocal(ctx, booking.data[0].pickupdate.toISOString()),
            dropoff_date_time: dlTimer.convertToLocal(ctx, booking.data[0].dropoffdate.toISOString()),

            price_per_date: booking.data[0].priceperday,
            total_rental_days: booking.data[0].totalrentaldays,
            vat: booking.data[0].vatamount,
            total_cost: booking.data[0].totalcost,
            deposit: booking.data[0].deposit,
            coupon_value: booking.data[0].couponvalue,

            booking_user_name: carDetails[0].fullname,
            booking_user_contact_number: carDetails[0].contactnumber,
            booking_user_email: carDetails[0].email,
            booking_user_address: carDetails[0].address,

            booking_agency_name: carDetails[0].agencyname,
            booking_agency_contact_number: carDetails[0].agencycontact,
            booking_agency_address: carDetails[0].agencyaddress,
            booking_agency_address_lat:carDetails[0].agentlat,
            booking_agency_address_lng:carDetails[0].agentlang,

            receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
            receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
            receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
            showmap: carDetails[0].showmap == 1 ? true : false,

            car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
            car_number: carDetails[0].carno,
            make: carDetails[0].carbrand,
            car_year: carDetails[0].caryear,
            car_model: carDetails[0].carmodel,

            agency_name: AgencyEmail[0].agencyname,
            subject: ConstantsMailTemplate.AgencyUserCarBookingSubject,
          };

          dlMailer.sendMail(ctx, ConstantsMailTemplate.AgencyUserCarBooking, AgencyEmail[0].email, replacements);

          replacements = {
            booking_number: booking.data[0].bookingcode,
            booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
            pickup_city: booking.data[0].pickupplace,
            dropoff_city: booking.data[0].dropoffplace,
            pickup_date_time: dlTimer.convertToLocal(ctx, booking.data[0].pickupdate.toISOString()),
            dropoff_date_time: dlTimer.convertToLocal(ctx, booking.data[0].dropoffdate.toISOString()),

            price_per_date: booking.data[0].priceperday,
            total_rental_days: booking.data[0].totalrentaldays,
            vat: booking.data[0].vatamount,
            total_cost: booking.data[0].totalcost,
            deposit: booking.data[0].deposit,
            coupon_value: booking.data[0].couponvalue,

            booking_user_name: carDetails[0].fullname,
            booking_user_contact_number: carDetails[0].contactnumber,
            booking_user_email: carDetails[0].email,
            booking_user_address: carDetails[0].address,

            booking_agency_name: carDetails[0].agencyname,
            booking_agency_contact_number: carDetails[0].agencycontact,
            booking_agency_address: carDetails[0].agencyaddress,
            booking_agency_address_lat:carDetails[0].agentlat,
            booking_agency_address_lng:carDetails[0].agentlang,

            receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
            receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
            receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
            showmap: carDetails[0].showmap == 1 ? true : false,

            car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
            car_number: carDetails[0].carno,
            make: carDetails[0].carbrand,
            car_year: carDetails[0].caryear,
            car_model: carDetails[0].carmodel,

            agency_name: AgencyEmail[0].agencyname,
            subject: ConstantsMailTemplate.AdminUserCarBookingSubject,
          };

          dlMailer.sendMail(ctx, ConstantsMailTemplate.AdminUserCarBooking, Constants.AdminMailId, replacements);

          /*
            // Sending mail after user update
            let readHTMLFile = function (path, callback) {
              fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
                if (err) {
                  throw err;
                } else {
                  callback(null, html);
                }
              });
            };
            //Reads the html template,body of the mail content
            readHTMLFile(
              mail_template + "/Bookingtemplate.html",
              function (err, html) {
                let template = handlebars.compile(html);
                let replacements = {
                  Name: ans.data.firstname,
                  booking_id: booking.data[0].bookingcode,
                  booking_cost: booking.data[0].totalcost,
                  message12: "Booking Information Changed",
                };
                const htmlToSend = template(replacements);
                // this method call the mail service to send mail
                ctx
                  .call("mail.send", {
                    to: ans.data.email,
                    subject: "Booking Changes Successfull",
                    html: htmlToSend,
                  })
                  .then((res) => {
                    return "Email sent successfully.";
                  });
              }
            );
            */

            return this.requestSuccess(
              "Your Service Booked Successfully",
              booking.data[0].id
            );
          });
        });
      });
    });
  },
  update: async function (ctx) {
    return Booking.updateBy(
      ctx,
      ctx.params.id,
      {
        bookingcode: this.randombookingnum(),
        // bookingstatus: BOOKED,
        dropoffdate: ctx.params.dropoffdate,
        totalrentaldays: ctx.params.totalrentaldays,
        vatamount: ctx.params.vatamount,
        subtotal: ctx.params.subtotal,
        totalcost: ctx.params.totalcost,
        paymentmode: ctx.params.paymentmode,
        paymentstatus: ctx.params.paymentstatus,
        paymenttransactionid: ctx.params.paymenttransactionid,
        pickupaddress: ctx.params.pickupaddress,
        dropoffaddress: ctx.params.dropoffaddress,
        // pickuplat: ctx.params.pickuplat,
        // pickuplang: ctx.params.pickuplng,
        // droplat: ctx.params.droplat,
        // droplang: ctx.params.droplng
      },
      {
        query: { id: ctx.params.id },
      }
    ).then((booking) => {
      return User.findOne(ctx, {
        query: { id: booking.data[0].created_by },
      }).then(async (ans) => {
        ctx.meta.log = "New booking added by user without coupon.";
        activity.setLog(ctx);


        const AgencyEmail = await AgentConfig.find(ctx, {
          query: { id: ctx.params.agentid, status: 1 },
        }).then((res) => {
          return res.data;
        });

      console.log(
        "------------------------------------------------------"
      );
      console.log(ans.data);
      console.log(
        "-------------------------------------------------------"
      );
      ctx.meta.log = "Booking updated by user without coupon.";


      return await sequelize12
      .query("exec sp_GetBookingInformationByID_new @Id=:id, @Lang=:lang", {
        replacements: { id: booking.data[0].id, lang: 1 },
        type: Sequ.QueryTypes.SELECT,
      })
            .then(async (carDetails) => {

          let replacements = {
            name: `${ans.data.firstname} ${ans.data.lastname}`,
            booking_number: booking.data[0].bookingcode,
            booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
            pickup_city: booking.data[0].pickupplace,
            dropoff_city: booking.data[0].dropoffplace,
            pickup_date_time: dlTimer.convertToLocal(ctx, booking.data[0].pickupdate.toISOString()),
            dropoff_date_time: dlTimer.convertToLocal(ctx, booking.data[0].dropoffdate.toISOString()),

            price_per_date: booking.data[0].priceperday,
            total_rental_days: booking.data[0].totalrentaldays,
            vat: booking.data[0].vatamount,
            total_cost: booking.data[0].totalcost,
            deposit: booking.data[0].deposit,
            coupon_value: booking.data[0].couponvalue,

            booking_user_name: carDetails[0].fullname,
            booking_user_contact_number: carDetails[0].contactnumber,
            booking_user_email: carDetails[0].email,
            booking_user_address: carDetails[0].address,

            booking_agency_name: carDetails[0].agencyname,
            booking_agency_contact_number: carDetails[0].agencycontact,
            booking_agency_address: carDetails[0].agencyaddress,
            booking_agency_address_lat:carDetails[0].agentlat,
            booking_agency_address_lng:carDetails[0].agentlang,

            receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
            receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
            receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
            showmap: carDetails[0].showmap == 1 ? true : false,

            car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
            car_number: carDetails[0].carno,
            make: carDetails[0].carbrand,
            car_year: carDetails[0].caryear,
            car_model: carDetails[0].carmodel,

            subject: ConstantsMailTemplate.UserUserCarBookingSubject,
          };

          dlMailer.sendMail(ctx, ConstantsMailTemplate.UserUserCarBooking, ans.data.email, replacements);

          replacements = {
            booking_number: booking.data[0].bookingcode,
            booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
            pickup_city: booking.data[0].pickupplace,
            dropoff_city: booking.data[0].dropoffplace,
            pickup_date_time: dlTimer.convertToLocal(ctx, booking.data[0].pickupdate.toISOString()),
            dropoff_date_time: dlTimer.convertToLocal(ctx, booking.data[0].dropoffdate.toISOString()),

            price_per_date: booking.data[0].priceperday,
            total_rental_days: booking.data[0].totalrentaldays,
            vat: booking.data[0].vatamount,
            total_cost: booking.data[0].totalcost,
            deposit: booking.data[0].deposit,
            coupon_value: booking.data[0].couponvalue,

            booking_user_name: carDetails[0].fullname,
            booking_user_contact_number: carDetails[0].contactnumber,
            booking_user_email: carDetails[0].email,
            booking_user_address: carDetails[0].address,

            booking_agency_name: carDetails[0].agencyname,
            booking_agency_contact_number: carDetails[0].agencycontact,
            booking_agency_address: carDetails[0].agencyaddress,
            booking_agency_address_lat:carDetails[0].agentlat,
            booking_agency_address_lng:carDetails[0].agentlang,

            receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
            receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
            receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
            showmap: carDetails[0].showmap == 1 ? true : false,

            car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
            car_number: carDetails[0].carno,
            make: carDetails[0].carbrand,
            car_year: carDetails[0].caryear,
            car_model: carDetails[0].carmodel,

            agency_name: AgencyEmail[0].agencyname,
            subject: ConstantsMailTemplate.AgencyUserCarBookingSubject,
          };

          dlMailer.sendMail(ctx, ConstantsMailTemplate.AgencyUserCarBooking, AgencyEmail[0].email, replacements);

          replacements = {
            booking_number: booking.data[0].bookingcode,
            booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
            pickup_city: booking.data[0].pickupplace,
            dropoff_city: booking.data[0].dropoffplace,
            pickup_date_time: dlTimer.convertToLocal(ctx, booking.data[0].pickupdate.toISOString()),
            dropoff_date_time: dlTimer.convertToLocal(ctx, booking.data[0].dropoffdate.toISOString()),

            price_per_date: booking.data[0].priceperday,
            total_rental_days: booking.data[0].totalrentaldays,
            vat: booking.data[0].vatamount,
            total_cost: booking.data[0].totalcost,
            deposit: booking.data[0].deposit,
            coupon_value: booking.data[0].couponvalue,

            booking_user_name: carDetails[0].fullname,
            booking_user_contact_number: carDetails[0].contactnumber,
            booking_user_email: carDetails[0].email,
            booking_user_address: carDetails[0].address,

            booking_agency_name: carDetails[0].agencyname,
            booking_agency_contact_number: carDetails[0].agencycontact,
            booking_agency_address: carDetails[0].agencyaddress,
            booking_agency_address_lat:carDetails[0].agentlat,
            booking_agency_address_lng:carDetails[0].agentlang,

            receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
            receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
            receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
            showmap: carDetails[0].showmap == 1 ? true : false,

            car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
            car_number: carDetails[0].carno,
            make: carDetails[0].carbrand,
            car_year: carDetails[0].caryear,
            car_model: carDetails[0].carmodel,

            agency_name: AgencyEmail[0].agencyname,
            subject: ConstantsMailTemplate.AdminUserCarBookingSubject,
          };

          dlMailer.sendMail(ctx, ConstantsMailTemplate.AdminUserCarBooking, Constants.AdminMailId, replacements);

          /*
            // Sending mail after user update
            let readHTMLFile = function (path, callback) {
              fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
                if (err) {
                  throw err;
                } else {
                  callback(null, html);
                }
              });
            };
            //Reads the html template,body of the mail content
            readHTMLFile(
              mail_template + "/Bookingtemplate.html",
              function (err, html) {
                let template = handlebars.compile(html);
                let replacements = {
                  Name: ans.data.firstname,
                  booking_id: booking.data[0].bookingcode,
                  booking_cost: booking.data[0].totalcost,
                  message12: "Booking Detail",
                };
                const htmlToSend = template(replacements);
                // this method call the mail service to send mail
                ctx
                  .call("mail.send", {
                    to: ans.data.email,
                    cc: "admin@drivelounge.com",
                    subject: "Booking Successfull",
                    html: htmlToSend,
                  })
                  .then((res) => {
                    return "Email sent successfully.";
                  });
              }
            );
            */

            return this.requestSuccess(
              "Your Service Booked Successfully",
              booking.data[0].id
            );
        })
      });
    });
  },
  getbyid: function (ctx) {
    let findstatus = {};
    findstatus["id"] = ctx.params;
    findstatus["status"] = 1;
    return Booking.find(ctx, { query: findstatus })
      .then((res) => {
        return res.data;
        //return this.requestSuccess("Requested review list", res.data);
      })
      .catch((err) => {
        if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else return this.requestError(err);
      });
  },

  getpayoption: function (ctx) {
    return Payment.find(ctx, { query: { status: 1 } })
      .then((res) => {
        return res.data;
        //return this.requestSuccess("Requested review list", res.data);
      })
      .catch((err) => {
        if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else return this.requestError(err);
      });
  },

  getuserinfo: async function (ctx) {
    return await sequelize12
      .query("EXEC sp_getUserInfo  @Id=:id", {
        replacements: { id: ctx.params.id },
        type: Sequ.QueryTypes.SELECT,
      })
      .then((res) => {
        if (res) return this.requestSuccess("User information list", res);
        else return this.requestError("No record found.");
      })
      .catch((err) => {
        console.log(err);
        return this.requestError(
          "Something went wrong, Please contact your admin.",
          err
        );
      });
  },

  getbookinginfo: async function (ctx) {
    return await sequelize12
      .query("EXEC sp_getbookinginfo  @Id=:id, @Lang=:lang", {
        replacements: { id: ctx.params.id, lang: ctx.params.lang },
        type: Sequ.QueryTypes.SELECT,
      })
      .then((res) => {
        if (res) return this.requestSuccess("Booking information details", res);
        else return this.requestError("No record found.");
      })
      .catch((err) => {
        console.log(err);
        return this.requestError(
          "Something went wrong, Please contact your admin.",
          err
        );
      });
  },

  getmybookinginfo: async function (ctx) {
    return await sequelize12
      .query("EXEC sp_getmybooking  @Id=:id", {
        replacements: { id: ctx.params.id },
        type: Sequ.QueryTypes.SELECT,
      })
      .then((res) => {
        if (res) return this.requestSuccess("My Booking information list", res);
        else return this.requestError("No record found.");
      })
      .catch((err) => {
        return this.requestError(
          "Something went wrong, Please contact your admin.",
          err
        );
      });
  },

  booking_cancel: function (ctx) {
    // :TODO User cancelling the booking
    return Booking.findOne(ctx, { query: { id: ctx.params.id } }).then(
      (res) => {
        if (res.data !== undefined && res.data.id) {
          return Booking.updateBy(
            ctx,
            ctx.params.id,
            {
              bookingstatus: 0,
              cancellationreason: ctx.params.reason,
              usertype: ctx.params.usertype,
            },
            { query: { id: ctx.params.id } }
          )
            .then(async (res_) => {
              const AgencyEmail = await AgentConfig.find(ctx, {
                query: { id: res_.data[0].agentid, status: 1 },
              })
                .then((res) => {
                  return res.data;
                })
                .catch((err) => {
                  console.log("Agency Email error: ", err);
                });
              return await sequelize12
                .query("EXEC sp_getmybooking  @Id=:id", {
                  replacements: { id: ctx.params.userid },
                  type: Sequ.QueryTypes.SELECT,
                })
                .then((res) => {
                  if (res) {
                    return User.findOne(ctx, {
                      query: { id: ctx.params.userid },
                    })
                      .then((ans) => {
                        ctx.meta.log = "Booking status changes";
                        activity.setLog(ctx);


                        let replacements = {
                          agency_name: AgencyEmail[0].agencyname,
                          user_name: ans.data.firstname + "" + ans.data.lastname,
                          subject: ConstantsMailTemplate.AdminCancelledCarBookingSubject,
                        };

                        dlMailer.sendMail(ctx, ConstantsMailTemplate.AdminCancelledCarBooking, Constants.AdminMailId, replacements);

                        replacements = {
                          agency_name: AgencyEmail[0].agencyname,
                          user_name: ans.data.firstname + "" + ans.data.lastname,
                          subject: ConstantsMailTemplate.AgencyCancelledCarBookingSubject,
                        };
                        dlMailer.sendMail(ctx, ConstantsMailTemplate.AgencyCancelledCarBooking, AgencyEmail[0].email, replacements);

                        replacements = {
                          agency_name: AgencyEmail[0].agencyname,
                          user_name: ans.data.firstname + "" + ans.data.lastname,
                          subject: ConstantsMailTemplate.UserAdminCancelledCarBookingSubject,
                        };
                        dlMailer.sendMail(ctx, ConstantsMailTemplate.UserAdminCancelledCarBooking, ans.data.email, replacements);


                        // Sending mail after user update
                        let readHTMLFile = function (path, callback) {
                          fs.readFile(
                            path,
                            { encoding: "utf-8" },
                            function (err, html) {
                              if (err) {
                                throw err;
                              } else {
                                callback(null, html);
                              }
                            }
                          );
                        };

                        /*
                        //Reads the html template,body of the mail content
                        readHTMLFile(
                          mail_template + "/Bookingstatustemplate.html",
                          function (err, html) {
                            let template = handlebars.compile(html);

                            let replacements = {
                              username:
                                ans.data.firstname + "" + ans.data.lastname,
                              content: `This is to confirm that you have cancelled your Booking Number ${res_.data[0].bookingcode}, we hope to see you
                            again.`,
                            };
                            const htmlToSend = template(replacements);
                            ctx
                              .call("mail.send", {
                                to: ans.data.email,
                                cc: "admin@drivelounge.com",
                                subject: "Car Booking Status",
                                html: htmlToSend,
                              })
                              .then((res) => {
                                console.log("Email sent successfully.");
                              });
                            if (res_.data[0].bookingstatus == 0) {
                              let replacements = {
                                greetings: AgencyEmail[0].agencyname,
                                content: `This is to confirm that Booking Number ${res_.data[0].bookingcode} was cancelled by the Customer and there are no
                                    further actions required, the car associated with that booking should now be published on Drive
                                    Lounge website.`,
                              };
                              const htmlToSend = template(replacements);
                              ctx
                                .call("mail.send", {
                                  to: AgencyEmail[0].email,
                                  cc: "admin@drivelounge.com",
                                  subject: "Car Booking Status",
                                  html: htmlToSend,
                                })
                                .then((res) => {
                                  console.log("Email sent successfully.");
                                });
                            }
                          }
                        );
                        */

                        return this.requestSuccess(
                          "My Booking information list",
                          res
                        );
                      })
                      .catch((err) => {
                        return this.requestError(
                          "Something went wrong, Please contact your admin.",
                          err
                        );
                      });
                  } else return this.requestError("No record found.");
                })
                .catch((err) => {
                  return this.requestError(
                    "Something went wrong, Please contact your admin.",
                    err
                  );
                });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    );
  },

  change_request: function (ctx) {
    return Booking.findOne(ctx, { query: { id: ctx.params.id } }).then(
      (res) => {
        if (res.data !== undefined && res.data.id) {
          return Booking.updateBy(
            ctx,
            ctx.params.id,
            {
              changerequest: ctx.params.request,
              usertype: ctx.params.usertype,
            },
            { query: { id: ctx.params.id } }
          ).then(async (res) => {
            return await sequelize12
              .query("EXEC sp_getmybooking  @Id=:id", {
                replacements: { id: ctx.params.userid },
                type: Sequ.QueryTypes.SELECT,
              })
              .then((res) => {
                if (res)
                  return this.requestSuccess(
                    "My Booking information list",
                    res
                  );
                else return this.requestError("No record found.");
              })
              .catch((err) => {
                return this.requestError(
                  "Something went wrong, Please contact your admin.",
                  err
                );
              });
          });
        }
      }
    );
  },

  tripstart: function (ctx) {
    return BookingFeature.findOne(ctx, { query: { bookingid: ctx.params.id } })
      .then((res) => {
        if (res.data !== undefined && res.data.id) {
          return BookingFeature.updateBy(
            ctx,
            ctx.params.id,
            { tripstart: true, tripstartdate: new Date() },
            { query: { bookingid: ctx.params.id } }
          )
            .then(async (res) => {
              if (res.data !== undefined) {
                return await sequelize12
                .query("exec sp_GetBookingInformationByID_new @Id=:id, @Lang=:lang", {
                  replacements: { id: ctx.params.id, lang: 1 },
                  type: Sequ.QueryTypes.SELECT,
                })
                  .then((res) => {
                    if (res)
                      return this.requestSuccess("Booking information", res);
                    else return this.requestError(CodeTypes.NOTHING_FOUND);
                  })
                  .catch((err) => {
                    return this.requestError(CodeTypes.UNKOWN_ERROR);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  tripend: function (ctx) {
    return BookingFeature.findOne(ctx, {
      query: { bookingid: ctx.params.id },
    }).then((res) => {
      if (res.data !== undefined && res.data.id) {
        return BookingFeature.updateBy(
          ctx,
          ctx.params.id,
          { tripend: true, tripenddate: new Date() },
          { query: { bookingid: ctx.params.id } }
        ).then(async (res) => {
          if (res.data !== undefined && res.data) {
            return await sequelize12
            .query("exec sp_GetBookingInformationByID_new @Id=:id, @Lang=:lang", {
              replacements: { id: ctx.params.id, lang: 1 },
              type: Sequ.QueryTypes.SELECT,
            })
              .then((res) => {
                if (res) return this.requestSuccess("Booking information", res);
                else return this.requestError(CodeTypes.NOTHING_FOUND);
              })
              .catch((err) => {
                return this.requestError(CodeTypes.UNKOWN_ERROR);
              });
          }
        });
      }
    });
  },

  pickupimages: function (ctx) {
    let imagelist = ctx.params.file;
    console.log(imagelist);
    if (imagelist !== undefined && imagelist.length > 0) {
      imagelist.map((img) => {
        console.log(img);
        CarProof.insert(ctx, {
          sortorder: 1,
          bookingid: ctx.params.id,
          imageurl: img.imageurl,
          carid: ctx.params.carid,
        }).catch((err) => {
          console.log(err);
        });
        // CarProof.findOne(ctx, { query: { bookingid: ctx.params.bookingid, sortorder: 1 } }).then(res => {
        //     console.log(res)
        //     if (res.data !== undefined && res.data.id) {
        //         return CarProof.updateBy(ctx, ctx.params.id,
        //             { imageurl: img.imageurl, status: img.status },
        //             { query: { id: ctx.params.id } }
        //         )
        //     }else{
        //         CarProof.insert(ctx, {
        //             sortorder: 1,
        //             bookingid: ctx.params.bookingid,
        //             imageurl: img.imageurl
        //         })
        //     }
        // }).catch( err => {
        //     console.log(err)
        // })
      });
      return CarProof.findOne(ctx, {
        query: { bookingid: ctx.params.id, sortorder: 1 },
      }).then((res) => {
        return this.requestSuccess("Images updated successfully", res);
      });
    } else {
      return this.requestSuccess("Images updated successfully");
    }
  },

  dropoffimages: function (ctx) {
    let imagelist = ctx.params.file;
    if (imagelist !== undefined && imagelist.length > 0) {
      imagelist.map((img) => {
        CarProof.insert(ctx, {
          sortorder: 2,
          bookingid: ctx.params.id,
          imageurl: img.imageurl,
          carid: ctx.params.carid,
        });

        // CarProof.findOne(ctx, { query: { bookingid: ctx.params.bookingid, id: img.id, sortorder: 2 } }).then(res => {
        //     if (res.data !== undefined && res.data.id) {
        //         return CarProof.updateBy(ctx, ctx.params.id,
        //             { imageurl: img.imageurl, status: img.status },
        //             { query: { id: ctx.params.id } }
        //         )
        //     }else{
        //         CarProof.insert(ctx, {
        //             sortorder: 2,
        //             bookingid: ctx.params.bookingid,
        //             imageurl: img.imageurl
        //         })
        //     }
        // })
      });
      return CarProof.findOne(ctx, {
        query: { bookingid: ctx.params.id, sortorder: 2 },
      }).then((res) => {
        return this.requestSuccess("Images updated successfully", res);
      });
    } else {
      return this.requestSuccess("Images updated successfully");
    }
  },

  get_booking_all: async function (ctx) {
    console.log('params--', ctx.params)
    return await sequelize12
      .query(
        "exec sp_getbooking_new @id=:id, @bookingno=:bookingno, @status=:status",
        {
          replacements: {
            id: ctx.params.id,
            bookingno:
              ctx.params.bookingno !== undefined ? ctx.params.bookingno : 0,
            status: ctx.params.status !== undefined ? ctx.params.status : "",
          },
          type: Sequ.QueryTypes.SELECT,
        }
      )
      .then((res) => {
        if (res) return this.requestSuccess("Booking list fetched", res);
        else return this.requestError(CodeTypes.NOTHING_FOUND);
      })
      .catch((err) => {
        console.error("eror---", err);
        return this.requestError(CodeTypes.UNKOWN_ERROR);
      });
  },

  getbookinginfobyid: async function (ctx) {
    return await sequelize12
      .query("exec sp_GetBookingInformationByID_new @Id=:id, @Lang=:lang", {
        replacements: { id: ctx.params.id, lang: ctx.params.lang },
        type: Sequ.QueryTypes.SELECT,
      })
      .then((res) => {

        /*
        console.log("????????????????????????????????????????");
        console.log(res[0].bookingdate);


        console.log(dlTimer.convertToLocal(ctx, res[0].bookingdate.toISOString()));
        const d = DateTime.fromISO(res[0].bookingdate.toISOString(), {zone: 'UTC+3'});
        console.log(d.toISO());
        console.log(res[0].bookingdate.toISOString());
        */

        if (res) return this.requestSuccess("Booking information", res);
        else return this.requestError(CodeTypes.NOTHING_FOUND);
      })
      .catch((err) => {
        return this.requestError(CodeTypes.UNKOWN_ERROR);
      });
  },

  // Booking list For particular user
  getAll_user: function (ctx) {
    let findbooking = {};
    findbooking["customerid"] = ctx.params.userid;
    findbooking["status"] = ctx.params.status
      ? ctx.params.status
      : {
          [Op.ne]: DELETE,
        };
    return Bookingfilt.find(ctx, { query: findbooking })
      .then((res) => {
        var arr = res.data;
        async function get_bookings(ctx, arr) {
          let final = [];
          for (var i = 0; i < arr.length; i++) {
            let vendor_name = await Vendorlangfilt.find(ctx, {
              query: {
                vendorid: arr[i]["vendorid"],
                langshortname:
                  ctx.options.parentCtx.params.req.headers.language,
              },
            }).then((lan_res) => {
              arr[i]["vendorname"] = lan_res.data[0].vendorname;
              arr[i]["address"] = lan_res.data[0].vendoraddress;
              return arr[i];
            });

            let vendor_details = await Vendorfilt.find(ctx, {
              query: { id: arr[i]["vendorid"] },
            }).then((lan_res) => {
              arr[i]["vendor_location"] = lan_res.data[0].location;
              const split_image = lan_res.data[0].photopath.split("__uploads");
              const image = split_image[1];
              const slice_image = image.slice(1);

              let city_name = Citylang.find(ctx, {
                query: {
                  cityid: lan_res.data[0].cityid,
                  langshortname:
                    ctx.options.parentCtx.params.req.headers.language,
                },
              }).then((res) => {
                arr[i]["cityname"] = res.data[0].cityname;
              });

              let country_name = CountryLang.find(ctx, {
                query: {
                  countryid: lan_res.data[0].countryid,
                  langshortname:
                    ctx.options.parentCtx.params.req.headers.language,
                },
              }).then((res) => {
                arr[i]["countryname"] = res.data[0].countryname;
              });

              arr[i]["vendor_image"] = slice_image;
              return arr[i];
            });
            let booking_sublist = await Bookingsublistfilt.find(ctx, {
              query: { bookingid: arr[i].id },
            }).then((lan_res) => {
              arr[i]["sublist"] = lan_res.data;
              return arr[i];
            });

            final.push(booking_sublist);
          }
          return final;
        }
        const vali = get_bookings(ctx, arr);
        return vali.then((resy) => {
          return this.requestSuccess("List of Bookings", resy);
        });
      })
      .catch((err) => {
        if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else return this.requestError(err);
      });
  },

  // Booking list For admin
  getAll: function (ctx) {
    let findbooking = {};
    findbooking["status"] = ctx.params.status
      ? ctx.params.status
      : {
          [Op.ne]: DELETE,
        };
    return Bookingfilt.find(ctx, { query: findbooking })
      .then((res) => {
        var arr = res.data;
        async function get_bookings(ctx, arr) {
          let final = [];
          for (var i = 0; i < arr.length; i++) {
            let vendor_name = await Vendorlangfilt.find(ctx, {
              query: {
                vendorid: arr[i]["vendorid"],
                langshortname:
                  ctx.options.parentCtx.params.req.headers.language,
              },
            }).then((lan_res) => {
              arr[i]["vendorname"] = lan_res.data[0].vendorname;
              arr[i]["address"] = lan_res.data[0].vendoraddress;
              return arr[i];
            });

            let vendor_details = await Vendorfilt.find(ctx, {
              query: { id: arr[i]["vendorid"] },
            }).then((lan_res) => {
              arr[i]["vendor_location"] = lan_res.data[0].location;
              const split_image = lan_res.data[0].photopath.split("__uploads");
              const image = split_image[1];
              const slice_image = image.slice(1);
              arr[i]["vendor_image"] = slice_image;

              let city_name = Citylang.find(ctx, {
                query: {
                  cityid: lan_res.data[0].cityid,
                  langshortname:
                    ctx.options.parentCtx.params.req.headers.language,
                },
              }).then((res) => {
                arr[i]["cityname"] = res.data[0].cityname;
              });

              let country_name = CountryLang.find(ctx, {
                query: {
                  countryid: lan_res.data[0].countryid,
                  langshortname:
                    ctx.options.parentCtx.params.req.headers.language,
                },
              }).then((res) => {
                arr[i]["countryname"] = res.data[0].countryname;
              });
              return arr[i];
            });

            let booking_sublist = await Bookingsublistfilt.find(ctx, {
              query: { bookingid: arr[i].id },
            }).then((lan_res) => {
              arr[i]["sublist"] = lan_res.data;
              return arr[i];
            });
            final.push(booking_sublist);
          }
          return final;
        }
        const vali = get_bookings(ctx, arr);
        return vali.then((resy) => {
          return this.requestSuccess("List of Bookings", resy);
        });
      })
      .catch((err) => {
        if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else return this.requestError(err);
      });
  },

  // Booking list For particular vendor
  getAll_vendor: function (ctx) {
    let findbooking = {};
    findbooking["vendorid"] = ctx.params.vendorid;
    if (ctx.params.bookingstatus) {
      findbooking["booking_status"] = ctx.params.bookingstatus;
    }
    findbooking["status"] = ctx.params.status
      ? ctx.params.status
      : {
          [Op.ne]: DELETE,
        };
    return Bookingfilt.find(ctx, { query: findbooking })
      .then((res) => {
        var arr = res.data;
        async function get_bookings(ctx, arr) {
          let final = [];
          for (var i = 0; i < arr.length; i++) {
            let vendor_name = await Vendorlangfilt.find(ctx, {
              query: {
                vendorid: arr[i]["vendorid"],
                langshortname:
                  ctx.options.parentCtx.params.req.headers.language,
              },
            }).then((lan_res) => {
              arr[i]["vendorname"] = lan_res.data[0].vendorname;
              arr[i]["address"] = lan_res.data[0].vendoraddress;
              return arr[i];
            });

            let user_name = await User.find(ctx, {
              query: { id: arr[i]["customerid"] },
            }).then((lan_res) => {
              arr[i]["username"] = lan_res.data[0].email;
              arr[i]["user_contact"] = lan_res.data[0].contactnumber;
              return arr[i];
            });

            let vendor_details = await Vendorfilt.find(ctx, {
              query: { id: arr[i]["vendorid"] },
            }).then((lan_res) => {
              arr[i]["vendor_location"] = lan_res.data[0].location;
              const split_image = lan_res.data[0].photopath.split("__uploads");
              const image = split_image[1];
              const slice_image = image.slice(1);

              let city_name = Citylang.find(ctx, {
                query: {
                  cityid: lan_res.data[0].cityid,
                  langshortname:
                    ctx.options.parentCtx.params.req.headers.language,
                },
              }).then((res) => {
                arr[i]["cityname"] = res.data[0].cityname;
              });

              let country_name = CountryLang.find(ctx, {
                query: {
                  countryid: lan_res.data[0].countryid,
                  langshortname:
                    ctx.options.parentCtx.params.req.headers.language,
                },
              }).then((res) => {
                arr[i]["countryname"] = res.data[0].countryname;
              });

              arr[i]["vendor_image"] = slice_image;
              return arr[i];
            });
            let booking_sublist = await Bookingsublistfilt.find(ctx, {
              query: { bookingid: arr[i].id },
            }).then((lan_res) => {
              arr[i]["sublist"] = lan_res.data;
              return arr[i];
            });

            final.push(booking_sublist);
          }
          return final;
        }
        const vali = get_bookings(ctx, arr);
        return vali.then((resy) => {
          return this.requestSuccess("List of Bookings", resy);
        });
      })
      .catch((err) => {
        if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else return this.requestError(err);
      });
  },

  status: function (ctx) {},
  get: function (ctx) {
    let findbooking = {};
    findbooking["id"] = ctx.params.id;
    findbooking["status"] = ctx.params.status
      ? ctx.params.status
      : {
          [Op.ne]: DELETE,
        };
    return Bookingfilt.find(ctx, { query: findbooking })
      .then((res) => {
        var arr = res.data;
        async function get_booking(ctx, arr) {
          let final = [];
          for (var i = 0; i < arr.length; i++) {
            let sublist_val = await Bookingsublistfilt.find(ctx, {
              query: { bookingid: arr[i].id },
            }).then((lan_res) => {
              arr[i]["sublist"] = lan_res.data;
              return arr[i];
            });

            final.push(sublist_val);
          }
          return final;
        }
        const vali = get_booking(ctx, arr);
        return vali.then((resy) => {
          return this.requestSuccess("Requested Booking", resy);
        });
      })
      .catch((err) => {
        if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else return this.requestError(err);
      });
  },

  //Booking delete is used change the status and not complete delete
  remove: function (ctx) {
    activity
      .getUser(ctx, ctx.meta.user.id, ctx.meta.user.usertypeid)
      .then((res) => {
        ctx.meta.username = res.data.email;
      });
    return Bookingfilt.findOne(ctx, {
      query: {
        id: ctx.params.id,
      },
    }).then((res) => {
      Booking.updateBy(
        ctx,
        res.data.id,
        {
          status: 2,
        },
        {
          query: {
            id: ctx.params.id,
          },
        }
      );

      let update = {};
      update["status"] = 2;
      let des = {};
      des["bookingid"] = ctx.params.id;
      Bookingsublist.updateMany(ctx, des, update);
      ctx.meta.log = "Booking deleted.";
      activity.setLog(ctx);
      Usedcoupon.updateMany(ctx, des, update);
      return this.requestSuccess(
        "Your Booking has been successfully Deleted",
        ctx.params.id
      );
    });
  },

  activity_log: async function (ctx) {
    let playersList = await sequelize12.query(
      "EXEC SP_ActivityLog :searchmail",
      {
        replacements: { searchmail: ctx.params.name },
        type: Sequ.QueryTypes.SELECT,
      }
    );
    return this.requestSuccess("Booking Logs", playersList);
  },

  booking_status: function (ctx) {
    let reason = ctx.params.reason !== undefined ? ctx.params.reason : "";
    return Booking.find(ctx, { query: { id: ctx.params.id } })
      .then((res) => {
        if (res) {
          return Booking.updateBy(
            ctx,
            ctx.params.id,
            {
              bookingstatus: ctx.params.status,
              usertype: ctx.params.usertype,
              cancellationreason: reason,
            },
            {
              query: { id: ctx.params.id },
            }
          )
            .then((book) => {
              return User.findOne(ctx, {
                query: { id: book.data[0].created_by },
              }).then(async (user) => {
                // Sending mail after user update
                const AgencyEmail = await AgentConfig.find(ctx, {
                  query: { id: book.data[0].agentid, status: 1 },
                }).then((res) => {
                  return res.data;
                });
                const AdminEmail = await Appconfig.find(ctx, {
                  query: { status: 1 },
                }).then((res) => {
                  return res.data;
                });






                return await sequelize12
                .query("exec sp_GetBookingInformationByID_new @Id=:id, @Lang=:lang", {
                  replacements: { id: book.data[0].id, lang: 1 },
                  type: Sequ.QueryTypes.SELECT,
                })
                  .then(async (carDetails) => {

                    if (ctx.params.status == 1) {


                      let replacements = {
                        name: user.data.firstname + " " + user.data.lastname,
                        booking_number: book.data[0].bookingcode,
                        booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
                        pickup_city: book.data[0].pickupplace,
                        dropoff_city: book.data[0].dropoffplace,
                        pickup_date_time: dlTimer.convertToLocal(ctx, book.data[0].pickupdate.toISOString()),
                        dropoff_date_time: dlTimer.convertToLocal(ctx, book.data[0].dropoffdate.toISOString()),

                        price_per_date: book.data[0].priceperday,
                        total_rental_days: book.data[0].totalrentaldays,
                        vat: book.data[0].vatamount,
                        total_cost: book.data[0].totalcost,
                        deposit: book.data[0].deposit,
                        coupon_value: book.data[0].couponvalue,

                        booking_user_name: carDetails[0].fullname,
                        booking_user_contact_number: carDetails[0].contactnumber,
                        booking_user_email: carDetails[0].email,
                        booking_user_address: carDetails[0].address,

                        booking_agency_name: carDetails[0].agencyname,
                        booking_agency_contact_number: carDetails[0].agencycontact,
                        booking_agency_address: carDetails[0].agencyaddress,
                        booking_agency_address_lat:carDetails[0].agentlat,
                        booking_agency_address_lng:carDetails[0].agentlang,

                        receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
                        receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
                        receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
                        showmap: carDetails[0].showmap == 1 ? true : false,

                        car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
                        car_number: carDetails[0].carno,
                        make: carDetails[0].carbrand,
                        car_year: carDetails[0].caryear,
                        car_model: carDetails[0].carmodel,

                        agency_name: AgencyEmail[0].agencyname,
                        subject: ConstantsMailTemplate.UserConfirmedCarBookingSubject,
                      };
                      dlMailer.sendMail(ctx, ConstantsMailTemplate.UserConfirmedCarBooking, user.data.email, replacements);

                      replacements = {
                        name: user.data.firstname + " " + user.data.lastname,
                        booking_number: book.data[0].bookingcode,
                        booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
                        pickup_city: book.data[0].pickupplace,
                        dropoff_city: book.data[0].dropoffplace,
                        pickup_date_time: dlTimer.convertToLocal(ctx, book.data[0].pickupdate.toISOString()),
                        dropoff_date_time: dlTimer.convertToLocal(ctx, book.data[0].dropoffdate.toISOString()),

                        price_per_date: book.data[0].priceperday,
                        total_rental_days: book.data[0].totalrentaldays,
                        vat: book.data[0].vatamount,
                        total_cost: book.data[0].totalcost,
                        deposit: book.data[0].deposit,
                        coupon_value: book.data[0].couponvalue,

                        booking_user_name: carDetails[0].fullname,
                        booking_user_contact_number: carDetails[0].contactnumber,
                        booking_user_email: carDetails[0].email,
                        booking_user_address: carDetails[0].address,

                        booking_agency_name: carDetails[0].agencyname,
                        booking_agency_contact_number: carDetails[0].agencycontact,
                        booking_agency_address: carDetails[0].agencyaddress,
                        booking_agency_address_lat:carDetails[0].agentlat,
                        booking_agency_address_lng:carDetails[0].agentlang,

                        receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
                        receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
                        receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
                        showmap: carDetails[0].showmap == 1 ? true : false,

                        car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
                        car_number: carDetails[0].carno,
                        make: carDetails[0].carbrand,
                        car_year: carDetails[0].caryear,
                        car_model: carDetails[0].carmodel,

                        agency_name: AgencyEmail[0].agencyname,
                        subject: ConstantsMailTemplate.AdminConfirmedCarBookingSubject,
                      };
                      dlMailer.sendMail(ctx, ConstantsMailTemplate.AdminConfirmedCarBooking, Constants.AdminMailId, replacements);

                      replacements = {
                        booking_number: book.data[0].bookingcode,
                        booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
                        pickup_city: book.data[0].pickupplace,
                        dropoff_city: book.data[0].dropoffplace,
                        pickup_date_time: dlTimer.convertToLocal(ctx, book.data[0].pickupdate.toISOString()),
                        dropoff_date_time: dlTimer.convertToLocal(ctx, book.data[0].dropoffdate.toISOString()),

                        price_per_date: book.data[0].priceperday,
                        total_rental_days: book.data[0].totalrentaldays,
                        vat: book.data[0].vatamount,
                        total_cost: book.data[0].totalcost,
                        deposit: book.data[0].deposit,
                        coupon_value: book.data[0].couponvalue,

                        booking_user_name: carDetails[0].fullname,
                        booking_user_contact_number: carDetails[0].contactnumber,
                        booking_user_email: carDetails[0].email,
                        booking_user_address: carDetails[0].address,

                        booking_agency_name: carDetails[0].agencyname,
                        booking_agency_contact_number: carDetails[0].agencycontact,
                        booking_agency_address: carDetails[0].agencyaddress,
                        booking_agency_address_lat:carDetails[0].agentlat,
                        booking_agency_address_lng:carDetails[0].agentlang,

                        receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
                        receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
                        receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
                        showmap: carDetails[0].showmap == 1 ? true : false,

                        car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
                        car_number: carDetails[0].carno,
                        make: carDetails[0].carbrand,
                        car_year: carDetails[0].caryear,
                        car_model: carDetails[0].carmodel,

                        name: user.data.firstname + " " + user.data.lastname,
                        agency_name: AgencyEmail[0].agencyname,
                        subject: ConstantsMailTemplate.AgencyConfirmedCarBookingSubject,
                      };
                      dlMailer.sendMail(ctx, ConstantsMailTemplate.AgencyConfirmedCarBooking, AgencyEmail[0].email, replacements);
                    }
                    if (ctx.params.status == 3) {

                      let replacements = {
                        booking_number: book.data[0].bookingcode,
                        booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
                        pickup_city: book.data[0].pickupplace,
                        dropoff_city: book.data[0].dropoffplace,
                        pickup_date_time: dlTimer.convertToLocal(ctx, book.data[0].pickupdate.toISOString()),
                        dropoff_date_time: dlTimer.convertToLocal(ctx, book.data[0].dropoffdate.toISOString()),

                        price_per_date: book.data[0].priceperday,
                        total_rental_days: book.data[0].totalrentaldays,
                        vat: book.data[0].vatamount,
                        total_cost: book.data[0].totalcost,
                        deposit: book.data[0].deposit,
                        coupon_value: book.data[0].couponvalue,

                        booking_user_name: carDetails[0].fullname,
                        booking_user_contact_number: carDetails[0].contactnumber,
                        booking_user_email: carDetails[0].email,
                        booking_user_address: carDetails[0].address,

                        booking_agency_name: carDetails[0].agencyname,
                        booking_agency_contact_number: carDetails[0].agencycontact,
                        booking_agency_address: carDetails[0].agencyaddress,
                        booking_agency_address_lat:carDetails[0].agentlat,
                        booking_agency_address_lng:carDetails[0].agentlang,

                        receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
                        receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
                        receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
                        showmap: carDetails[0].showmap == 1 ? true : false,

                        car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
                        car_number: carDetails[0].carno,
                        make: carDetails[0].carbrand,
                        car_year: carDetails[0].caryear,
                        car_model: carDetails[0].carmodel,

                        name: user.data.firstname + " " + user.data.lastname,
                        user_name: user.data.firstname + " " + user.data.lastname,
                        agency_name: AgencyEmail[0].agencyname,
                        subject: ConstantsMailTemplate.UserCompletedCarBookingSubject,
                      };
                      dlMailer.sendMail(ctx, ConstantsMailTemplate.UserCompletedCarBooking, user.data.email, replacements);

                      replacements = {
                        booking_number: book.data[0].bookingcode,
                        booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
                        pickup_city: book.data[0].pickupplace,
                        dropoff_city: book.data[0].dropoffplace,
                        pickup_date_time: dlTimer.convertToLocal(ctx, book.data[0].pickupdate.toISOString()),
                        dropoff_date_time: dlTimer.convertToLocal(ctx, book.data[0].dropoffdate.toISOString()),

                        price_per_date: book.data[0].priceperday,
                        total_rental_days: book.data[0].totalrentaldays,
                        vat: book.data[0].vatamount,
                        total_cost: book.data[0].totalcost,
                        deposit: book.data[0].deposit,
                        coupon_value: book.data[0].couponvalue,

                        booking_user_name: carDetails[0].fullname,
                        booking_user_contact_number: carDetails[0].contactnumber,
                        booking_user_email: carDetails[0].email,
                        booking_user_address: carDetails[0].address,

                        booking_agency_name: carDetails[0].agencyname,
                        booking_agency_contact_number: carDetails[0].agencycontact,
                        booking_agency_address: carDetails[0].agencyaddress,
                        booking_agency_address_lat:carDetails[0].agentlat,
                        booking_agency_address_lng:carDetails[0].agentlang,

                        receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
                        receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
                        receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
                        showmap: carDetails[0].showmap == 1 ? true : false,

                        car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
                        car_number: carDetails[0].carno,
                        make: carDetails[0].carbrand,
                        car_year: carDetails[0].caryear,
                        car_model: carDetails[0].carmodel,

                        name: user.data.firstname + " " + user.data.lastname,
                        agency_name: AgencyEmail[0].agencyname,
                        subject: ConstantsMailTemplate.AdminCompletedCarBookingSubject,
                      };
                      dlMailer.sendMail(ctx, ConstantsMailTemplate.AdminCompletedCarBooking, Constants.AdminMailId, replacements);

                      replacements = {
                        booking_number: book.data[0].bookingcode,
                        booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
                        pickup_city: book.data[0].pickupplace,
                        dropoff_city: book.data[0].dropoffplace,
                        pickup_date_time: dlTimer.convertToLocal(ctx, book.data[0].pickupdate.toISOString()),
                        dropoff_date_time: dlTimer.convertToLocal(ctx, book.data[0].dropoffdate.toISOString()),

                        price_per_date: book.data[0].priceperday,
                        total_rental_days: book.data[0].totalrentaldays,
                        vat: book.data[0].vatamount,
                        total_cost: book.data[0].totalcost,
                        deposit: book.data[0].deposit,
                        coupon_value: book.data[0].couponvalue,

                        booking_user_name: carDetails[0].fullname,
                        booking_user_contact_number: carDetails[0].contactnumber,
                        booking_user_email: carDetails[0].email,
                        booking_user_address: carDetails[0].address,

                        booking_agency_name: carDetails[0].agencyname,
                        booking_agency_contact_number: carDetails[0].agencycontact,
                        booking_agency_address: carDetails[0].agencyaddress,
                        booking_agency_address_lat:carDetails[0].agentlat,
                        booking_agency_address_lng:carDetails[0].agentlang,

                        receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
                        receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
                        receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
                        showmap: carDetails[0].showmap == 1 ? true : false,

                        car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
                        car_number: carDetails[0].carno,
                        make: carDetails[0].carbrand,
                        car_year: carDetails[0].caryear,
                        car_model: carDetails[0].carmodel,

                        name: user.data.firstname + " " + user.data.lastname,
                        agency_name: AgencyEmail[0].agencyname,
                        subject: ConstantsMailTemplate.AgencyCompletedCarBookingSubject,
                      };
                      dlMailer.sendMail(ctx, ConstantsMailTemplate.AgencyCompletedCarBooking, AgencyEmail[0].email, replacements);



                    }
                    if (ctx.params.status == 0) {
                      if (book.data[0].bookingstatus == 0) {



                        if(ctx.params.usertype == 1) {

                          let replacements = {
                            booking_number: book.data[0].bookingcode,
                            booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
                            pickup_city: book.data[0].pickupplace,
                            dropoff_city: book.data[0].dropoffplace,
                            pickup_date_time: dlTimer.convertToLocal(ctx, book.data[0].pickupdate.toISOString()),
                            dropoff_date_time: dlTimer.convertToLocal(ctx, book.data[0].dropoffdate.toISOString()),

                            price_per_date: book.data[0].priceperday,
                            total_rental_days: book.data[0].totalrentaldays,
                            vat: book.data[0].vatamount,
                            total_cost: book.data[0].totalcost,
                            deposit: book.data[0].deposit,
                            coupon_value: book.data[0].couponvalue,

                            booking_user_name: carDetails[0].fullname,
                            booking_user_contact_number: carDetails[0].contactnumber,
                            booking_user_email: carDetails[0].email,
                            booking_user_address: carDetails[0].address,

                            booking_agency_name: carDetails[0].agencyname,
                            booking_agency_contact_number: carDetails[0].agencycontact,
                            booking_agency_address: carDetails[0].agencyaddress,
                            booking_agency_address_lat:carDetails[0].agentlat,
                            booking_agency_address_lng:carDetails[0].agentlang,

                            receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
                            receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
                            receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
                            showmap: carDetails[0].showmap == 1 ? true : false,

                            car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
                            car_number: carDetails[0].carno,
                            make: carDetails[0].carbrand,
                            car_year: carDetails[0].caryear,
                            car_model: carDetails[0].carmodel,

                            user_name: user.data.firstname + " " + user.data.lastname,
                            agency_name: AgencyEmail[0].agencyname,
                            subject: ConstantsMailTemplate.UserAdminCancelledCarBookingSubject,
                          };
                          dlMailer.sendMail(ctx, ConstantsMailTemplate.UserAdminCancelledCarBooking, user.data.email, replacements);

                          replacements = {
                            booking_number: book.data[0].bookingcode,
                            booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
                            pickup_city: book.data[0].pickupplace,
                            dropoff_city: book.data[0].dropoffplace,
                            pickup_date_time: dlTimer.convertToLocal(ctx, book.data[0].pickupdate.toISOString()),
                            dropoff_date_time: dlTimer.convertToLocal(ctx, book.data[0].dropoffdate.toISOString()),

                            price_per_date: book.data[0].priceperday,
                            total_rental_days: book.data[0].totalrentaldays,
                            vat: book.data[0].vatamount,
                            total_cost: book.data[0].totalcost,
                            deposit: book.data[0].deposit,
                            coupon_value: book.data[0].couponvalue,

                            booking_user_name: carDetails[0].fullname,
                            booking_user_contact_number: carDetails[0].contactnumber,
                            booking_user_email: carDetails[0].email,
                            booking_user_address: carDetails[0].address,

                            booking_agency_name: carDetails[0].agencyname,
                            booking_agency_contact_number: carDetails[0].agencycontact,
                            booking_agency_address: carDetails[0].agencyaddress,
                            booking_agency_address_lat:carDetails[0].agentlat,
                            booking_agency_address_lng:carDetails[0].agentlang,

                            receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
                            receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
                            receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
                            showmap: carDetails[0].showmap == 1 ? true : false,

                            car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
                            car_number: carDetails[0].carno,
                            make: carDetails[0].carbrand,
                            car_year: carDetails[0].caryear,
                            car_model: carDetails[0].carmodel,

                            user_name: user.data.firstname + " " + user.data.lastname,
                            agency_name: AgencyEmail[0].agencyname,
                            subject: ConstantsMailTemplate.AgencyAdminCancelledCarBookingSubject,
                          };
                          dlMailer.sendMail(ctx, ConstantsMailTemplate.AgencyAdminCancelledCarBooking, AgencyEmail[0].email, replacements);


                          replacements = {
                            booking_number: book.data[0].bookingcode,
                            booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
                            pickup_city: book.data[0].pickupplace,
                            dropoff_city: book.data[0].dropoffplace,
                            pickup_date_time: dlTimer.convertToLocal(ctx, book.data[0].pickupdate.toISOString()),
                            dropoff_date_time: dlTimer.convertToLocal(ctx, book.data[0].dropoffdate.toISOString()),

                            price_per_date: book.data[0].priceperday,
                            total_rental_days: book.data[0].totalrentaldays,
                            vat: book.data[0].vatamount,
                            total_cost: book.data[0].totalcost,
                            deposit: book.data[0].deposit,
                            coupon_value: book.data[0].couponvalue,

                            booking_user_name: carDetails[0].fullname,
                            booking_user_contact_number: carDetails[0].contactnumber,
                            booking_user_email: carDetails[0].email,
                            booking_user_address: carDetails[0].address,

                            booking_agency_name: carDetails[0].agencyname,
                            booking_agency_contact_number: carDetails[0].agencycontact,
                            booking_agency_address: carDetails[0].agencyaddress,
                            booking_agency_address_lat:carDetails[0].agentlat,
                            booking_agency_address_lng:carDetails[0].agentlang,

                            receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
                            receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
                            receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
                            showmap: carDetails[0].showmap == 1 ? true : false,

                            car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
                            car_number: carDetails[0].carno,
                            make: carDetails[0].carbrand,
                            car_year: carDetails[0].caryear,
                            car_model: carDetails[0].carmodel,

                            user_name: user.data.firstname + " " + user.data.lastname,
                            agency_name: AgencyEmail[0].agencyname,
                            subject: ConstantsMailTemplate.AdminAdminCancelledCarBookingSubject,
                          };
                          dlMailer.sendMail(ctx, ConstantsMailTemplate.AdminAdminCancelledCarBooking, Constants.AdminMailId, replacements);


                        } else {

                          let replacements = {
                            booking_number: book.data[0].bookingcode,
                            booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
                            pickup_city: book.data[0].pickupplace,
                            dropoff_city: book.data[0].dropoffplace,
                            pickup_date_time: dlTimer.convertToLocal(ctx, book.data[0].pickupdate.toISOString()),
                            dropoff_date_time: dlTimer.convertToLocal(ctx, book.data[0].dropoffdate.toISOString()),

                            price_per_date: book.data[0].priceperday,
                            total_rental_days: book.data[0].totalrentaldays,
                            vat: book.data[0].vatamount,
                            total_cost: book.data[0].totalcost,
                            deposit: book.data[0].deposit,
                            coupon_value: book.data[0].couponvalue,

                            booking_user_name: carDetails[0].fullname,
                            booking_user_contact_number: carDetails[0].contactnumber,
                            booking_user_email: carDetails[0].email,
                            booking_user_address: carDetails[0].address,

                            booking_agency_name: carDetails[0].agencyname,
                            booking_agency_contact_number: carDetails[0].agencycontact,
                            booking_agency_address: carDetails[0].agencyaddress,
                            booking_agency_address_lat:carDetails[0].agentlat,
                            booking_agency_address_lng:carDetails[0].agentlang,

                            receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
                            receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
                            receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
                            showmap: carDetails[0].showmap == 1 ? true : false,

                            car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
                            car_number: carDetails[0].carno,
                            make: carDetails[0].carbrand,
                            car_year: carDetails[0].caryear,
                            car_model: carDetails[0].carmodel,

                            user_name: user.data.firstname + " " + user.data.lastname,
                            agency_name: AgencyEmail[0].agencyname,
                            subject: ConstantsMailTemplate.UserAgencyCancelledCarBookingSubject,
                          };
                          dlMailer.sendMail(ctx, ConstantsMailTemplate.UserAgencyCancelledCarBooking, user.data.email, replacements);

                          replacements = {
                            booking_number: book.data[0].bookingcode,
                            booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
                            pickup_city: book.data[0].pickupplace,
                            dropoff_city: book.data[0].dropoffplace,
                            pickup_date_time: dlTimer.convertToLocal(ctx, book.data[0].pickupdate.toISOString()),
                            dropoff_date_time: dlTimer.convertToLocal(ctx, book.data[0].dropoffdate.toISOString()),

                            price_per_date: book.data[0].priceperday,
                            total_rental_days: book.data[0].totalrentaldays,
                            vat: book.data[0].vatamount,
                            total_cost: book.data[0].totalcost,
                            deposit: book.data[0].deposit,
                            coupon_value: book.data[0].couponvalue,

                            booking_user_name: carDetails[0].fullname,
                            booking_user_contact_number: carDetails[0].contactnumber,
                            booking_user_email: carDetails[0].email,
                            booking_user_address: carDetails[0].address,

                            booking_agency_name: carDetails[0].agencyname,
                            booking_agency_contact_number: carDetails[0].agencycontact,
                            booking_agency_address: carDetails[0].agencyaddress,
                            booking_agency_address_lat:carDetails[0].agentlat,
                            booking_agency_address_lng:carDetails[0].agentlang,

                            receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
                            receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
                            receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
                            showmap: carDetails[0].showmap == 1 ? true : false,

                            car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
                            car_number: carDetails[0].carno,
                            make: carDetails[0].carbrand,
                            car_year: carDetails[0].caryear,
                            car_model: carDetails[0].carmodel,

                            user_name: user.data.firstname + " " + user.data.lastname,
                            reason: reason,
                            agency_name: AgencyEmail[0].agencyname,
                            subject: ConstantsMailTemplate.AdminAgencyCancelledCarBookingSubject,
                          };
                          dlMailer.sendMail(ctx, ConstantsMailTemplate.AdminAgencyCancelledCarBooking, Constants.AdminMailId, replacements);

                          replacements = {
                            booking_number: book.data[0].bookingcode,
                            booking_date: dlTimer.convertToLocal(ctx, carDetails[0].bookingdate.toISOString()),
                            pickup_city: book.data[0].pickupplace,
                            dropoff_city: book.data[0].dropoffplace,
                            pickup_date_time: dlTimer.convertToLocal(ctx, book.data[0].pickupdate.toISOString()),
                            dropoff_date_time: dlTimer.convertToLocal(ctx, book.data[0].dropoffdate.toISOString()),

                            price_per_date: book.data[0].priceperday,
                            total_rental_days: book.data[0].totalrentaldays,
                            vat: book.data[0].vatamount,
                            total_cost: book.data[0].totalcost,
                            deposit: book.data[0].deposit,
                            coupon_value: book.data[0].couponvalue,

                            booking_user_name: carDetails[0].fullname,
                            booking_user_contact_number: carDetails[0].contactnumber,
                            booking_user_email: carDetails[0].email,
                            booking_user_address: carDetails[0].address,

                            booking_agency_name: carDetails[0].agencyname,
                            booking_agency_contact_number: carDetails[0].agencycontact,
                            booking_agency_address: carDetails[0].agencyaddress,
                            booking_agency_address_lat:carDetails[0].agentlat,
                            booking_agency_address_lng:carDetails[0].agentlang,

                            receiving_address: carDetails[0].showmap == 1 ? carDetails[0].pickupaddress : '',
                            receiving_address_lat:carDetails[0].showmap == 1 ? carDetails[0].pickuplat : '',
                            receiving_address_lng:carDetails[0].showmap == 1 ? carDetails[0].pickuplang : '',
                            showmap: carDetails[0].showmap == 1 ? true : false,

                            car_image_path: 'https://api.drivelounge.com/' + carDetails[0].imageurl,
                            car_number: carDetails[0].carno,
                            make: carDetails[0].carbrand,
                            car_year: carDetails[0].caryear,
                            car_model: carDetails[0].carmodel,

                            user_name: user.data.firstname + " " + user.data.lastname,
                            reason: reason,
                            agency_name: AgencyEmail[0].agencyname,
                            subject: ConstantsMailTemplate.AgencyAgencyCancelledCarBookingSubject,
                          };
                          dlMailer.sendMail(ctx, ConstantsMailTemplate.AgencyAgencyCancelledCarBooking, AgencyEmail[0].email, replacements);
                        }
                        /*

                        */

                      }
                    }


                    /*
                    let readHTMLFile = function (path, callback) {
                      fs.readFile(
                        path,
                        { encoding: "utf-8" },
                        function (err, html) {
                          if (err) {
                            throw err;
                          } else {
                            callback(null, html);
                          }
                        }
                      );
                    };
                    //Reads the html template,body of the mail content
                    readHTMLFile(
                      mail_template + "/Status.html",
                      function (err, html) {
                        let template = handlebars.compile(html);
                        // console.log(
                        //   "--------------------------Status-------------------------------",
                        //   ctx.params.status
                        // );
                        if (ctx.params.status == 1) {
                          let replacements = {
                            greetings:
                              user.data.firstname + "" + user.data.lastname,
                            content: `This is to confirm that your Booking Number ${book.data[0].bookingcode} was reviewed by the Agency and was
                                confirmed. For any queries, please do not hesitate to contact us`,
                          };
                          const htmlToSend = template(replacements);
                          ctx
                            .call("mail.send", {
                              to: user.data.email,
                              cc: "admin@drivelounge.com",
                              subject: "Car Booking Status",
                              html: htmlToSend,
                            })
                            .then((res) => {
                              console.log("Email sent successfully.");
                            });

                          let replacementsagency = {
                            greetings: AgencyEmail[0].agencyname,
                            content: ` This is to confirm that you have reviewed Booking Number ${book.data[0].bookingcode} and confirmed it, and a
                                corresponding email was sent to the User`,
                          };
                          const htmlToSendAgency = template(replacementsagency);
                          ctx
                            .call("mail.send", {
                              to: AgencyEmail[0].email,
                              cc: "admin@drivelounge.com",
                              subject: "Car Booking Status",
                              html: htmlToSendAgency,
                            })
                            .then((res) => {
                              console.log("Email sent successfully.");
                            });
                        }
                        if (ctx.params.status == 3) {
                          let replacements = {
                            greetings:
                              user.data.firstname + " " + user.data.lastname,
                            content: `This is to confirm that your Booking Number ${book.data[0].bookingcode} and was completed, we hope that your
                                experience with Drive Lounge and the Agency was seamless. We also do encourage you to rate your
                                experience with us, your constructive feedback will be used to enhance our services and your future
                                experiences.`,
                          };
                          // console.log("users: ", replacements);
                          // console.log("email: ", user.data.email);
                          const htmlToSend = template(replacements);
                          ctx
                            .call("mail.send", {
                              to: user.data.email,
                              cc: "admin@drivelounge.com",
                              subject: "Car Booking Status",
                              html: htmlToSend,
                            })
                            .then((res) => {
                              console.log("Email sent successfully.");
                            });

                          let replacementsagency = {
                            greetings: AgencyEmail[0].agencyname,
                            content: ` This is to confirm that you have reviewed Booking Number ${book.data[0].bookingcode} and was completed it, and a
                                  corresponding email was sent to the User`,
                          };
                          // console.log("AGency: ", replacementsagency);
                          const htmlToSendAgency = template(replacementsagency);
                          // console.log("email: ", AgencyEmail[0].email);
                          ctx
                            .call("mail.send", {
                              to: AgencyEmail[0].email,
                              cc: "admin@drivelounge.com",
                              subject: "Car Booking Status",
                              html: htmlToSendAgency,
                            })
                            .then((res) => {
                              console.log("Email sent successfully.");
                            });

                          let replacementsadmin = {
                            greetings: "Admin",
                            content: ` This is to confirm you that ${AgencyEmail[0].agencyname} have reviewed Booking Number ${book.data[0].bookingcode} and was completed it, and a
                                    corresponding email was sent to the User`,
                          };
                          // console.log("Admin: ", replacementsadmin);
                          const htmlToSendAdmin = template(replacementsadmin);
                          // console.log("email: ", AdminEmail[0].email);
                          ctx
                            .call("mail.send", {
                              to: AdminEmail[0].email,
                              cc: "admin@drivelounge.com",
                              subject: "Car Booking Status",
                              html: htmlToSendAdmin,
                            })
                            .then((res) => {
                              console.log("Email sent successfully.");
                            });
                        }
                        if (ctx.params.status == 0) {
                          if (res.data[0].bookingstatus == 1) {
                            let replacementsadmin = {
                              greetings: "Admin",
                              content: ` This is to confirm you that ${AgencyEmail[0].agencyname} have reviewed Booking Number ${book.data[0].bookingcode} and denied it, and a
                                      corresponding email was sent to the User`,
                            };
                            // console.log("Admin: ", replacementsadmin);
                            const htmlToSendAdmin = template(replacementsadmin);
                            // console.log("email: ", AdminEmail[0].email);
                            ctx
                              .call("mail.send", {
                                to: AdminEmail[0].email,
                                cc: "admin@drivelounge.com",
                                subject: "Car Booking Status",
                                html: htmlToSendAdmin,
                              })
                              .then((res) => {
                                console.log("Email sent successfully.");
                              });

                            let replacements = {
                              greetings: AgencyEmail[0].agencyname,
                              content: `This is to confirm that you have reviewed Booking Number ${book.data[0].bookingcode} and denied it, and a
    corresponding email was sent to the User.`,
                            };

                            const htmlToSend = template(replacements);
                            ctx
                              .call("mail.send", {
                                to: AgencyEmail[0].email,
                                cc: "admin@drivelounge.com",
                                subject: "Car Booking Status",
                                html: htmlToSend,
                              })
                              .then((res) => {
                                console.log("Email sent successfully.");
                              });
                          }
                          let replacements = {
                            greetings:
                              user.data.firstname + "" + user.data.lastname,
                            content:
                              res.data[0].bookingstatus == 0
                                ? `We regret to inform you that your Booking Number ${book.data[0].bookingcode} was not confirmed due to circumstances
                                    arising in the Agency, you may sign in to your account and explore other alternative cars.
                                    We do encourage you to rate your experience with us, your constructive feedback will be used to
                                    enhance our services and your future experiences.`
                                : `We regret to inform you that your Booking Number ${book.data[0].bookingcode} was cancelled due to circumstances
                                    arising in the Agency, they should have contacted you by now or will contact you shortly to explore
                                    the situation with you.
                                    We have strict rules for cancellation of confirmed bookings and most likely your booking was
                                    cancelled for circumstances beyond the control of the Agency.
                                    We do encourage you to rate your experience with us, your constructive feedback will be used to
                                    enhance our services and your future experiences.`,
                          };

                          const htmlToSend = template(replacements);
                          ctx
                            .call("mail.send", {
                              to: user.data.email,
                              cc: "admin@drivelounge.com",
                              subject: "Car Booking Status",
                              html: htmlToSend,
                            })
                            .then((res) => {
                              console.log("Email sent successfully.");
                            });
                        }
                        // console.log(
                        //   "--------------------------Status End-------------------------------"
                        // );
                      }
                    );
                    */


                    return this.requestSuccess("Booking status changed");
                });
              });
            })
            .catch((err) => {
              console.log(err);
              return this.requestError("Error has been occured", err);
            });
        }
        return res.data;
        //return this.requestSuccess("Requested review list", res.data);
      })
      .catch((err) => {
        if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else return this.requestError(err);
      });
  },

  getbookingdates: function (ctx) {
    return sequelize12
      .query("EXEC sp_GetBookingDetails @id=:id", {
        replacements: { id: ctx.params.id },
      })
      .then((res) => {
        return this.requestSuccess("Booking Dates", res);
      })
      .catch((err) => {
        if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else return this.requestError(err);
      });
  },

  earnings: async function (ctx) {
    let earnings_obj = {};
    let playersList = await sequelize12.query(
      "EXEC sp_totalcustomerdiscount :customerid",
      {
        replacements: { customerid: ctx.params.customerid },
        type: Sequ.QueryTypes.SELECT,
      }
    );
    console.log(
      "EEEEEEEEEEEEEEEEEEEEe",
      playersList[0]["total_customer_discount"]
    );
    earnings_obj["Total Earnings"] = playersList[0]["total_customer_discount"];

    let playersList1 = await sequelize12.query(
      "EXEC sp_customerdiscountlist :customerid",
      {
        replacements: { customerid: ctx.params.customerid },
        type: Sequ.QueryTypes.SELECT,
      }
    );
    earnings_obj["Total Earnings list"] = playersList1;

    return this.requestSuccess("Total Earnings", earnings_obj);
  },

  earnings_list: async function (ctx) {},
};
