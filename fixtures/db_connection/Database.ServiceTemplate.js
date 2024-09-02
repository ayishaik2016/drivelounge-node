"use strict";

const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Config = require("../../config");

const Models = require("./models/index");

const serviceActions = {
	actions: {

		insertMany(ctx) {
			return this.adapter.insertMany(ctx.params.entities);
		},

		updateById(ctx) {
			return this.adapter.updateById(ctx.params.id, { $set: ctx.params.update });
		},

		removeById(ctx) {
			return this.adapter.removeById(ctx.params.id);
		},

		removeMany(ctx) {
			return this.adapter.removeMany(ctx.params.query);
		},

		list(ctx){
			return this.adapter.query();
		},

		removeAll(ctx) {
			return this.adapter.clear();
		}

	}
}

function CreateDBService(table) {

	let config = Config.get('/mssqlEnvironment');	
	if (Models[table] !== undefined)
		return {
				name: `DB_${table}s`,

				mixins: [
					DbService,
					serviceActions
				],
				adapter: new SqlAdapter(config.database, config.username, config.password, {
					host: config.host,
					dialect: config.dialect,
					port: config.port,   
					pool: {
						max: 5,
						min: 0,
						idle: 10000
					},
					options: {
						encrypt: false
					},
					dialectOptions: {
						options: {
							encrypt: false
						}
					}
				}),
				model: Models[table]

			};
	else
		return undefined;
};

var DatabaseServices = [];

for (var item in Models){
	// if (!Models[item].define.userid)
	// 	throw new Error(`Error: model of table '${item}' needs to have a field 'id' as a Primary Key.`);
	// if (Models[item].define.userid.primaryKey !== true)
	// 	throw new Error(`Error: field 'id' of table '${item}' needs to be set as a Primary Key.`);

	DatabaseServices.push( CreateDBService(item) );
}

module.exports = DatabaseServices;