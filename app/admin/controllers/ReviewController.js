"use strict";

const { MoleculerError } = require("moleculer").Errors;
const pipe = require("pipe");
const CodeTypes = require("./../../../fixtures/error.codes");
const Constants = require("./../../../plugin/constants");
const Database = require("./../../../adapters/Database");
const fs = require("fs");
const path = require("path");
const { finished } = require("stream");
const Op = require("sequelize").Op;
const Sequ = require("sequelize");

const Config = require("../../../config");
let config = Config.get('/mssqlEnvironment');
//database connections for store Procedures (admin review list api)
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

const Review = new Database("Dreview");
const Reviewfilt = new Database(
  "Dreview"
  // , [
  //     "id",
  //     "reviewkey",
  //     "agentid",
  //     "carid",
  //     "rating",
  //     "isreview",
  //     "created_by",
  //     "created_at"
  // ]
);
const Agentfilt = new Database("Dagent");
const Agentlangfilt = new Database("Dagentlang");

//DEFAULT STATUS VALUES SEE IN CONSTANTS JS FILE

const { DELETE, ACTIVE, INACTIVE } = Constants;

module.exports = {
  // Review creation
  create: async function (ctx) {
    console.log(ctx.params);
    return Review.insert(ctx, {
      userid: ctx.params.userid,
      bookingid: ctx.params.bookingid,
      agentid: ctx.params.agentid,
      carid: ctx.params.carid,
      rating: ctx.params.rating,
      title: ctx.params.title,
      description: ctx.params.description,
    })
      .then((res) => {
        return ctx.call("review.getAll").then((res) => {
          return this.requestSuccess("Review Successfully Created", res.data);
        });
      })
      .catch((err) => {
        if (err.name === "Database Error" && Array.isArray(err.data)) {
          if (err.data[0].type === "unique" && err.data[0].field === "username")
            return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
        } else if (err instanceof MoleculerError) return Promise.reject(err);
        else return this.requestError(err);
      });
  },

  statuschange: function (ctx) {
    let findreview = {};
    findreview["id"] = ctx.params.id;
    findreview["status"] = ctx.params.status
      ? ctx.params.status
      : {
          [Op.ne]: DELETE,
        };
    return Review.findOne(ctx, {
      query: {
        id: ctx.params.id,
      },
    }).then((res) => {
      return Review.updateBy(
        ctx,
        res.data.id,
        {
          isreview: ctx.params.isreview,
        },
        {
          query: {
            id: ctx.params.id,
          },
        }
      ).then((res) => {
        return ctx.call("review.getAll").then((res) => {
          return this.requestSuccess("Review Successfully Created", res.data);
        });
        // let find = {};
        // find['status'] = 1;
        // return Review.find(ctx, { query: find })
        //     .then((res) => {
        //         return this.requestSuccess("Review status changed", res.data);
        //     })
      });
    });
  },

  remove: function (ctx) {
    return Review.findOne(ctx, {
      query: {
        id: ctx.params.id,
      },
    }).then((res) => {
      return Review.updateBy(
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
      ).then((res) => {
        let find = {};
        find["status"] = 1;
        return Review.find(ctx, { query: find }).then((res) => {
          return this.requestSuccess("Request review has deleted", res.data);
        });
      });
      // return this.requestSuccess("Request review has deleted");
    });
  },
  // Admin verified Review list
  getAll: function (ctx) {
    let findreview = {};
    if (ctx.params.isreview) {
      findreview["isreview"] = ctx.params.isreview;
    }
    findreview["status"] = ctx.params.status
      ? ctx.params.status
      : {
          [Op.ne]: DELETE,
        };
    return Review.find(ctx, { query: findreview })
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

  getAll: async function (ctx) {
    return await sequelize12
      .query("exec sp_getratingsandreview", { type: Sequ.QueryTypes.SELECT })
      .then((res) => {
        if (res) return this.requestSuccess("Review and rating List", res);
        else return this.requestError(CodeTypes.NOTHING_FOUND);
      })
      .catch((err) => {
        console.log(err);
        return this.requestError(CodeTypes.UNKOWN_ERROR);
      });
  },
  //Particular Payment method list
  admin_list: async function (ctx) {
    let playersList = await sequelize12.query(
      "EXEC SP_agentReviewDetail :agentid,:rating,:review,:name",
      {
        replacements: {
          agentid: ctx.params.agentid,
          rating: ctx.params.rating,
          review: ctx.params.review,
          name: ctx.params.username,
        },
        type: Sequ.QueryTypes.SELECT,
      }
    );
    return this.requestSuccess("Review List", playersList);
  },

  // Admin verified Review list
  user_reviews: function (ctx) {
    let findreview = {};
    findreview["isreview"] = 1;
    findreview["userid"] = ctx.params.userid;
    findreview["status"] = ctx.params.status
      ? ctx.params.status
      : {
          [Op.ne]: DELETE,
        };
    return Reviewfilt.find(ctx, { query: findreview })
      .then((res) => {
        //TO Get categories of agent
        async function get_agentdetails(ctx, arr) {
          let total_array = [];
          for (var i = 0; i < arr.length; i++) {
            //to get language data of the agent
            let language_val_filter = await Agentlangfilt.find(ctx, {
              query: {
                agentid: arr[i].agentid,
                langshortname:
                  ctx.options.parentCtx.params.req.headers.language,
              },
            }).then((lan_res) => {
              arr[i]["agentname"] = lan_res.data[0].agentname;
              return arr[i];
            });
            // to get agent images
            let agent_image = await Agentfilt.find(ctx, {
              query: { id: arr[i].agentid },
            }).then((images) => {
              let image_arr = " ";
              images.data.map((item) => {
                const split_image = item.photopath.split("__uploads");
                const image = split_image[1];
                const slice_image = image.slice(1);
                //item['agentimages'] = slice_image;
                image_arr = slice_image;
              });
              arr[i]["images"] = image_arr;
              return arr[i];
            });
            total_array.push(language_val_filter);
          }
          return total_array;
        }
        let array = [];
        array.push(res.data);
        const vali = get_agentdetails(ctx, res.data);
        return vali.then((resy) => {
          return resy;
        });
        return res.data;
        //return this.requestSuccess("Requested review list", res.data);
      })
      .catch((err) => {
        if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else return this.requestError(err);
      });
  },

  review_count: function (ctx) {
    return Reviewfilt.count(ctx, {
      agentid: ctx.params.id,
      isreview: 1,
    }).then((res) => {
      return this.requestSuccess("Review list count", res.data);
    });
  },

  // Admin verified Review list
  agent_reviews: function (ctx) {
    let findreview = {};
    // findreview['isreview'] = 1;
    findreview["agentid"] = ctx.params.agentid;
    if (ctx.params.isreview) {
      findreview["isreview"] = ctx.params.isreview;
    }
    findreview["status"] = ctx.params.status
      ? ctx.params.status
      : {
          [Op.ne]: DELETE,
        };
    return Reviewfilt.find(ctx, { query: findreview })
      .then((res) => {
        //TO Get categories of agent
        async function get_agentdetails(ctx, arr) {
          let total_array = [];
          for (var i = 0; i < arr.length; i++) {
            //to get language data of the agent
            let language_val_filter = await Agentlangfilt.find(ctx, {
              query: {
                agentid: arr[i].agentid,
                langshortname:
                  ctx.options.parentCtx.params.req.headers.language,
              },
            }).then((lan_res) => {
              arr[i]["agentname"] = lan_res.data[0].agentname;
              return arr[i];
            });

            // to get agent images
            let agent_image = await Agentfilt.find(ctx, {
              query: { id: arr[i].agentid },
            }).then((images) => {
              let image_arr = " ";
              images.data.map((item) => {
                const split_image = item.photopath.split("__uploads");
                const image = split_image[1];
                const slice_image = image.slice(1);
                //item['agentimages'] = slice_image;
                image_arr = slice_image;
              });
              arr[i]["images"] = image_arr;
              return arr[i];
            });
            total_array.push(language_val_filter);
          }
          return total_array;
        }
        let array = [];
        array.push(res.data);
        const vali = get_agentdetails(ctx, res.data);
        return vali.then((resy) => {
          return resy;
        });
        return res.data;
        //return this.requestSuccess("Requested review list", res.data);
      })
      .catch((err) => {
        if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else return this.requestError(err);
      });
  },

  //status updation for Review
  status: function (ctx) {},

  review_approval: function (ctx) {
    return Review.findOne(ctx, {
      query: {
        id: ctx.params.id,
      },
    })
      .then((res) => {
        Review.updateBy(
          ctx,
          res.data.id,
          {
            isreview: ctx.params.approval,
          },
          {
            query: {
              id: ctx.params.id,
            },
          }
        );

        return this.requestSuccess(
          "Review Verified Successfully",
          ctx.params.id
        );
      })
      .catch((err) => {
        if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else if (err instanceof MoleculerError) return Promise.reject(err);
        else return this.requestError(err);
      });
  },
  //Particular Review list in multiple language
  get: function (ctx) {
    let findreview = {};
    findreview["id"] = ctx.params.id;
    findreview["status"] = ctx.params.status
      ? ctx.params.status
      : {
          [Op.ne]: DELETE,
        };
    return Review.find(ctx, { query: findreview })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else return this.requestError(err);
      });
  },

  //Country update for mutiple language (all fields are mandatory)
  update: function (ctx) {
    let findcountry = {};
    findcountry["countryid"] = {
      [Op.ne]: ctx.params.id,
    };
    findcountry["countryname"] = ctx.params.language[0].countryname
      ? ctx.params.language[0].countryname
      : {
          [Op.ne]: DELETE,
        };
    findcountry["status"] = ctx.params.status
      ? ctx.params.status
      : {
          [Op.ne]: DELETE,
        };
    return CountryLang.find(ctx, { query: findcountry })
      .then((res) => {
        if (res.data.length === 0) {
          Country.updateBy(
            ctx,
            1,
            {
              countrycode: ctx.params.countrycode,
            },
            {
              query: {
                id: ctx.params.id,
              },
            }
          ).then((res) => {
            ctx.params.language.map((lan_item) => {
              CountryLang.updateBy(
                ctx,
                1,
                {
                  languageid: lan_item.languageid,
                  langshort_name: lan_item.langshort_name,
                  countryname: lan_item.countryname,
                  countryshortname: lan_item.countryshortname,
                },
                {
                  query: {
                    languageid: lan_item.languageid,
                    countryid: ctx.params.id,
                  },
                }
              );
            });
          });
          return this.requestSuccess(
            "Country Updated",
            ctx.params.language[0].countryname
          );
        } else {
          return this.requestError(CodeTypes.ALREADY_EXIST);
        }
      })
      .catch((err) => {
        if (err.name === "Database Error" && Array.isArray(err.data)) {
          if (err.data[0].type === "unique" && err.data[0].field === "first")
            return this.requestError(CodeTypes.T1_FIRST_CONSTRAINT);
        } else if (err instanceof MoleculerError) return Promise.reject(err);
        else if (err.name === "Nothing Found")
          return this.requestError(CodeTypes.NOTHING_FOUND);
        else return this.requestError(err);
      });
  },

  //Review delete is used change the status and not complete delete
  remove: function (ctx) {
    return Reviewfilt.findOne(ctx, {
      query: {
        id: ctx.params.id,
      },
    }).then((res) => {
      return Reviewfilt.updateBy(
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
      ).then((res) => {
        return ctx.call("review.getAll").then((res) => {
          return this.requestSuccess("Review Deleted", res.data);
        });
      });
    });
  },
};
