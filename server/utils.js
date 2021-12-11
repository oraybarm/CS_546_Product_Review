const { ObjectId } = require("mongodb");

exports.isValidString = (value, paramName, minLength) => {
	if (value === null || value === undefined) {
		throw `${paramName || "value"} is null/undefined`;
	}
	if (typeof value !== "string") {
		throw `${paramName || "value"} is not a string`;
	}
	if (minLength) {
		if (value.length < minLength) {
			throw `${paramName || "value"} cannot be less than ${minLength}`;
		}
	}
};

exports.isValidUsername = (username) => {
	let userNameregex = /^(?![\s.]+$)[a-zA-Z\s.]{2,}$/;
	if (!userNameregex.test(username)) {
		throw "Username is not valid";
	}
};

exports.isValidPassword = (password) => {
	let passwordRegex = /^[A-Za-z0-9!:',.@#$%^&*()]{6,}$/;
	if (!passwordRegex.test(password)) {
		throw `Password is not valid ${password}`;
	}
};

exports.isValidEmail = (email) => {
	if (!email.includes("@")) {
		throw "Email is not valid";
	}

	const emailRegex =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return emailRegex.test(email);
};

exports.isValidObject = (object, paramName) => {
	if (object === null || object === undefined) {
		throw `${paramName || "object"} is null/undefined`;
	}
	if (Array.isArray(object)) {
		throw `${paramName || "object"} is not an array`;
	}
	if (typeof object !== "object") {
		throw `${paramName || "object"} is not an object`;
	}
	return true;
};

exports.isValidObjectId = (objectId, paramName) => {
	if (objectId === null || objectId === undefined) {
		throw `${paramName || "objectId"} is null/undefined`;
	}
	if (!ObjectId.isValid(objectId)) {
		throw `${paramName || "objectId"} is not valid`;
	}
};

exports.isValidPicture = (picture, paramName) => {
	if (
		picture === null ||
		picture === undefined ||
		!this.isValidObject(picture)
	) {
		throw "Picture is null/undefined";
	}

	if (
		!picture.hasOwnProperty("data") ||
		!picture.hasOwnProperty("contentType")
	) {
		throw "Picture is not valid";
	}
};

exports.defaultNewUser = {
	isAdmin: false,
	reviews: [],
	reviewCounter: 0,
	likedProducts: [],
	photo: {},
};

exports.saltRounds = 12;

exports.addhttp = (s) => {
	var prefix = "http://";
	const httpsPrefix = "https://";
	if (
		s.substr(0, prefix.length) !== prefix &&
		s.substr(0, httpsPrefix.length) !== httpsPrefix
	) {
		s = prefix + s;
		return s;
	}
	return s;
};
