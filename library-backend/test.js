/* const mongoose = require('mongoose');

const uri = 'mongodb+srv://fullstack:AQNkFIa3IPlX0Pxe@fullstack-phone.onvga.mongodb.net/?appName=FullStack-Phone';

mongoose.connect(uri)
    .then(() => {
        console.log('Conectado');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    }); */

/* const dns = require('dns');

console.log('Servidores:', dns.getServers());

dns.resolveSrv(
    '_mongodb._tcp.fullstack-phone.onvga.mongodb.net',
    (err, records) => {
        console.log('SRV ERROR:', err);
        console.log('SRV RECORDS:', records);
    }
); */

const dns = require('dns');

dns.setServers(['1.1.1.1', '8.8.8.8']);

console.log('Servidores:', dns.getServers());

dns.resolveSrv(
    '_mongodb._tcp.fullstack-phone.onvga.mongodb.net',
    (err, records) => {
        console.log(err || records);
    }
);  