var chalk = require('chalk');
const Confidence = require('confidence');
var ip = require('ip');
var Path = require('path');

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

const criteria = {
    env: process.env.NODE_ENV
};

const app_name = 'drivelounge';

const config = {
    $meta: 'This file configures the plot device.',
    projectName: process.env.app_name,
    version: 1,
    server: {
        host: ip.address(),
        port: {
            api: 9017,
            socket: 8000
        },
        protocol: 'https',
        uri: `https://${ip.address()}:9017`
    },
    //cors: true,
    cors: {
        $filter: 'env',
        production: {
            origin: ["http://localhost:9018", "http://10.2.0.5:9018/", "https://drivelounge.com/"],
            methods: ["GET", /*"PATCH", "OPTIONS",*/ "POST", "PUT", "DELETE"],
            allowedHeaders: [],
            exposedHeaders: [],
            credentials: false,
            maxAge: 3600
        },
        $default: {
            origin: ["http://localhost:9018", "http://10.2.0.5:9018/", "https://drivelounge.com/"],
            methods: ["GET", /*"PATCH", "OPTIONS",*/ "POST", "PUT", "DELETE"],
            allowedHeaders: [],
            exposedHeaders: [],
            credentials: false,
            maxAge: 3600
        }
    },
    path: {
        log_path: Path.join(__dirname, '../logs/log.js'),
        assetsPath: Path.join(__dirname, '../assets/'),
        user_image_path: Path.join(__dirname, './assets/user/'),
    },

    settings: {
        log: false,
        file_log: false
    },
    defaultAdminCredential: {
        $filter: 'env',
        production: {
            username: 'drivelounge@gmail.com',
            password: 'admindrive'
        },
        $default: {
            username: 'drivelounge@gmail.com',
            password: 'admindrive'
        }
    },
    sms: {
        $filter: 'env',
        production: {
            "username": "lamsat",
            "password": 'lamsat123',
            "from": "Drive Lounge",
            "countrycode": '+966',
        },
        $default: {
            "username": "lamsat",
            "password": 'lamsat123',
            "from": "Drive Lounge",
            "countrycode": '+966',
        }
    },
    smtp: {
        $filter: 'env',
        production: {
            "host": "Localhost",
            "encryption": "YUdmk7894sdf",
            "port": "5575",
            "username": "SMTP_boss",
            "password": "boss_8558"
        },
        $default: {
            "host": "Localhost",
            "encryption": "YUdmk7894sdf",
            "port": "5575",
            "username": "SMTP_boss",
            "password": "boss_8558"
        }
    },
    CHALK_ERROR: chalk.bold.red,
    CHALK_LOG: chalk.bold.blue,
    currencyCode: {
        $filter: 'env',
        production: 'INR',
        $default: 'INR'
    },
    COUNTRY_CODE: {
        $filter: 'env',
        production: '+91',
        $default: '+91'
    },
    timeZone: {
        $filter: 'env',
        production: 'Asia/Kolkata',
        $default: 'Asia/Kolkata'
    },
    // mssqlEnvironment: {
    //     $filter: 'env',
    //     production: {
    //         "username": "dbzfmsappstech",
    //         "password": "Scope@#123",
    //         "database": "Drive-Lounge",
    //         "host": "13.94.34.229",
    //         "instancename": "MSQLEXPRESS",
    //         "dialect": "mssql",
    //         "port": "1433"
    //     },
    //     dev: {
    //         "username": "dbzfmsappstech",
    //         "password": "Scope@#123",
    //         "database": "Drive-Lounge",
    //         "host": "13.94.34.229",
    //         "instancename": "MSQLEXPRESS",
    //         "dialect": "mssql",
    //         "port": "1433"
    //     },
    //     $default: {
    //         "username": "dbzfmsappstech",
    //         "password": "Scope@#123",
    //         "database": "Drive-Lounge",
    //         "host": "13.94.34.229",
    //         "instancename": "MSQLEXPRESS",
    //         "dialect": "mssql",
    //         "port": "1433"
    //     }
    // },
          mssqlEnvironment: {
             $filter: 'env',
          production: {
            "username": "Drive",
            "password": "P@ssw0rd",
            "database": "Drive demo",
            "host": "13.94.34.229",
            "instancename": "MSQLEXPRESS",
            "dialect": "mssql",
            "port": "1433"
        },
        dev: {
            "username": "Drive",
            "password": "P@ssw0rd",
            "database": "Drive demo",
            "host": "13.94.34.229",
            "instancename": "MSQLEXPRESS",
            "dialect": "mssql",
            "port": "1433"
        },
        $default: {
            "username": "Drive",
            "password": "P@ssw0rd",
            "database": "Drive demo",
            "host": "13.94.34.229",
            "instancename": "MSQLEXPRESS",
            "dialect": "mssql",
            "port": "1433"
        }
     },
    mailer: {
        $filter: 'env',
        production: {
            "mail_id": "no-reply@drivelounge.com",
            "password": 'T.815117743428an',     //'Qor51302',
            "project_name": app_name,
        },
        $default: {
            "mail_id": "no-reply@drivelounge.com",
            "password": 'T.815117743428an',     //'Qor51302',
            "project_name": app_name,
        }
        // production: {
        //     "mail_id": "technoducedevelopers@gmail.com",
        //     "password": 'technoduce',
        //     "project_name": app_name,
        // },
        // $default: {
        //     "mail_id": "technoducedevelopers@gmail.com",
        //     "password": 'technoduce',
        //     "project_name": app_name,
        // }
    },
};


const store = new Confidence.Store(config);


exports.get = function(key) {

    return store.get(key, criteria);
};


exports.meta = function(key) {

    return store.meta(key, criteria);
};
