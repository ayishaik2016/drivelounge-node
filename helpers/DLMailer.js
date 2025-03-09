const handlebars = require("handlebars");
const fs = require("fs");
const filePath = require("path");
const activity = require("./activitylog");
const { DateTime } = require("luxon");

module.exports = {
  sendMail: function (ctx, fileName, toMailId, replacements, ccMailId = '', attachment = '') {
    let readHTMLFile = function (path, callback) {
      path = filePath.join(__dirname + "/templates/", path);
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
      //mail_template + '/' + fileName,
      fileName,
      function (err, html) {
        const d = DateTime.fromISO(DateTime.utc().toISO(), { zone: "UTC+3" });
        replacements["copyright_year"] = d.toLocaleString("default", {
          year: "numeric",
        });

        let template = handlebars.compile(html);
        const htmlToSend = template(replacements);

        let templateSubject = handlebars.compile(replacements.subject + "");
        const htmlToSendSubject = templateSubject(replacements);

        // Set up the mail parameters
        let mailParams = {
          to: toMailId,
          subject: htmlToSendSubject,
          html: htmlToSend
        };

        if(attachment != '') {
          mailParams.attachments = [{
            filename: 'invoice.pdf',
            path: attachment, 
          }]
        }

        // If CC email is provided, add it to the parameters
        if (ccMailId != '') {
          mailParams.cc = ccMailId;
        }
        
        ctx
          .call("mail.send", mailParams)
          .then((res) => {
            ctx.meta.log = `Email sent to ${toMailId} successfully`;
            activity.setLog(ctx);
          }).catch((err) => {
            ctx.meta.log = `Error sending email: ${err.message}`;
            activity.setLog(ctx);
          });
      }
    );
  },
};
