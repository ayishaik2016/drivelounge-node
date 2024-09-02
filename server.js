"use strict";

const { ServiceBroker } = require("moleculer");
const DatabaseServices = require("./fixtures/db_connection/Database.ServiceTemplate");
const broker = new ServiceBroker({
	logger: console,
    // transporter: "nats://localhost:4222",
	// validation: false,
    // validator: new JoiValidator()
});

broker.loadServices("./services");

DatabaseServices.forEach( (service) => {
	broker.createService(service);
});

broker.start()
	.then( () => {
		broker.repl();
		broker.call("user.createAdminIfNotExists");
		console.log("Server started");
		// broker.call("sms.create");
		// broker.call("smtp.create")		
	});

