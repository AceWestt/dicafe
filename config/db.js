const mongoose = require('mongoose');

const username = 'doadmin';
const password = 'oir07f456E29uDP3';
const dbName = 'admin';
const host = 'private-db-mongodb-fra1-23365-bd71d177.mongo.ondigitalocean.com';
const port = '27017';

const mongodbProdUri = `mongodb+srv://${username}:${password}@${host}/${dbName}`;

const options = {
	ssl: true,
	sslValidate: true,
	sslCA: `${__dirname}/config/ca-certificate.crt`,
};

const connectDB = async () => {
	await mongoose.connect(process.env.MONGO_URI || (mongodbProdUri, options));

	console.log('MongoDB connected');
};

module.exports = connectDB;
