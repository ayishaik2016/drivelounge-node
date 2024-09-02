const handlebars = require("handlebars");
const activity = require("./activitylog");
const fetch = require("node-fetch");

module.exports = {

    sendSMS: async function(ctx, recipients, message) {
      const url = `https://api.taqnyat.sa/v1/messages?bearerTokens=5ed92bba4abe717336dd29448b906184&sender=Drivelounge&recipients=${recipients}&body=${message}`;

      console.log(url);
      try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        ctx.meta.log = `Message sent to ${recipients} successfully`;
        activity.setLog(ctx);
        return responseData;
    } catch (error) {
        throw new Error("Failed to send SMS: " + error.message);
    }
           
    }
}