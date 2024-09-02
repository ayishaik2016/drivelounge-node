const handlebars = require("handlebars");
const fs = require("fs");
const filePath = require('path');
const activity = require("./activitylog");
const { DateTime } = require("luxon");

module.exports = {

    sendMail: function(ctx, fileName, toMailId, replacements) {
      var ss = replacements.subject;
      
        let readHTMLFile = function (path, callback) {
            path = filePath.join(__dirname + '/templates/', path);
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
              const d = DateTime.fromISO(DateTime.utc().toISO(), {zone: 'UTC+3'});
              console.log(d.toLocaleString("default", { year: "numeric" }));

              replacements["copyright_year"] = d.toLocaleString("default", { year: "numeric" });

              let template = handlebars.compile(html);
              const htmlToSend = template(replacements);

                console.log("MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL ");
                console.log(replacements.subject + '');
                                
                let templateSubject = handlebars.compile(replacements.subject + '');
                const htmlToSendSubject = templateSubject(replacements);

                console.log('----' + htmlToSendSubject);
                console.log("MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL ");



              ctx
                .call("mail.send", {
                  to: toMailId,
                  subject: htmlToSendSubject,
                  html: htmlToSend,
                })

                .then((res) => {
                console.log("MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL ");
                console.log(res);
                console.log(toMailId)
                console.log("MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL MAIL ");
                  ctx.meta.log = `"Email sent to ${toMailId} successfully`;
                  activity.setLog(ctx);
                });
            }
          );
    }
}