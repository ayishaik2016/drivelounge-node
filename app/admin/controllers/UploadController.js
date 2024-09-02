"use strict";
// DEVELOPED ON 14-07-2023

const { MoleculerError } = require("moleculer").Errors;
const pipe = require("pipe");

const CodeTypes = require("./../../../fixtures/error.codes");
const Constants = require("./../../../plugin/constants");
const fs = require("fs");
const path = require("path");
const { finished } = require("stream");
const Op = require("sequelize").Op;
const uuid = require("uuid");
const mkdir = require("mkdirp").sync;
const mime = require("mime-types");
const { info } = require("console");

const uploadDir = path.join(__dirname, "__uploads");
mkdir(uploadDir);
const img_path = __dirname;

//Models

//DEFAULT STATUS VALUES SEE IN CONSTANTS JS FILE

const { DELETE, ACTIVE, INACTIVE } = Constants;

//For Roles Filtrations
/**
 *
 * @annotation Upload
 * @permission
 * @whitelist create
 */
module.exports = {
  // USER CREATION WITH FILE UPLOAD
  create: async function (ctx) {
    let data = ctx.meta.$multipart;
    // for (const [key, value] of Object.entries(data)) {
    // 	console.log(`${key}: ${value}`);
    // }
    console.log(ctx.meta);
    const randy = this.randomName(ctx.meta);
    const fileName = ctx.meta.filename;
    const ext = path.extname(fileName).toLowerCase();
    console.log(ext);
    if (
      ext === ".png" ||
      ext === ".jpg" ||
      ext === ".jpeg" ||
      ext === ".webp" ||
      ext === ".pdf"
    ) {
      return new this.Promise((resolve, reject) => {
        //reject(new Error("Disk out of space"));

        // var type = ctx.meta.$multipart.type != null ? ctx.meta.$multipart.type : "";
        // console.log("type:",type,ext)
        // var randy2 = path.join(randy, type);
        // console.log(randy2)
        const filePath = path.join(uploadDir, randy + ext);

        this.logger.info("&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
        this.logger.info(ctx.meta);
        this.logger.info("&&&&&&&&&&&&&&&&&&&&&&&&&&&&");

        const f = fs.createWriteStream(filePath);

        f.on("close", () => {
          // File written successfully
          this.logger.info(`Uploaded file stored in '${filePath}'`);
          resolve({ filePath, meta: ctx.meta });
        });

        f.on("error", (err) => {
          this.logger.info("File error received", err.message);
          reject(err);

          // Destroy the local file
          f.destroy(err);
        });

        f.on("error", () => {
          // Remove the errored file.
          fs.unlinkSync(filePath);
        });

        ctx.params.pipe(f);
      })
        .then((res) => {
          return this.requestSuccess("File uploaded successfully", res);
        })
        .catch((err) => {
          console.log(err);
          if (err.name === "Database Error" && Array.isArray(err.data)) {
            if (
              err.data[0].type === "unique" &&
              err.data[0].field === "username"
            )
              return this.requestError(CodeTypes.USERS_USERNAME_CONSTRAINT);
          } else if (err instanceof MoleculerError) return Promise.reject(err);
          else {
            this.logger.info(err);
            return this.requestError(err);
          }
        });
    } else {
      return this.requestError(`File format ${ext} is not allowed.`);
    }
  },
};
