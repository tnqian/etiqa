const _             = require('lodash');
const e             = require('../exception/error');
const Worker        = require('worker-middleware').Worker;
const cd            = require('../../code/statusCode.json')['error'];
const users         = require('./users');

const v             = require('../validate');

exports = module.exports = {};
exports.run = run;

function validate(event , type){
	return function (context, next){
		if(type=="registerUser")
		{
			var rule = [
				[["name","username","email","phone_number"], "required", 502],
				[["skillsets","hobby"], "safe", 502],
			];
		}
		if(type=="updateUser")
		{
			var rule = [
				[["id","name","email","phone_number"], "required", 502],
				[["skillsets","hobby"], "safe", 502],
			];
		}
		if(type=="deleteUser")
		{
			var rule = [
				[["id"], "required", 502],
			];
		}
		else if(type=="pagination")
		{
			var rule = [
				[["page","per_page","start_date","end_date","status","id","username"], "safe", 502],
			];
			var check = v.validate(event, rule ,context ,"get");
			if(check)
				return next();
			else
				return next(502)
		}
		var check = v.validate(event, rule ,context ,"post");

		if(check)
			next();
		else
			next(502)
	}
}

function registerUser(event) {
	return new Promise(function(success,fail){
		var w = new Worker();
		w.do(validate(event,"registerUser"));
		w.do(users.veifyUsername());
		w.do(users.veifyEmail());
		w.do(users.registerUser());
		w.run(function (context, err) {
			let response = {};
			if (err) {
				if(err==502)
					response = {
						errorMessage : context.vresponse
					};
				else
					response = {
						errorMessage : {
							code : err,
							message : cd[err],
						}
					};
			}else{
				response = {
					data     : context.data,
				};
			}

			// console.log("done "+ new Date());
			success(response);
		});
	});
};

function getUser(event) {
	return new Promise(function(success,fail){
		var w = new Worker();
		w.do(validate(event,"pagination"));
		w.do(users.getUser());;
		w.run(function (context, err) {
			let response = {};
			if (err) {
				if(err==502)
					response = {
						errorMessage : context.vresponse
					};
				else
					response = {
						errorMessage : {
							code : err,
							message : cd[err],
						}
					};
			}else{
				response = {
					data     : context.data,
				};
			}

			// console.log("done "+ new Date());
			success(response);
		});
	});
};

function updateUser(event) {
	return new Promise(function(success,fail){
		var w = new Worker();
		w.do(validate(event,"updateUser"));
		w.do(users.updateUser());;
		w.run(function (context, err) {
			let response = {};
			if (err) {
				if(err==502)
					response = {
						errorMessage : context.vresponse
					};
				else
					response = {
						errorMessage : {
							code : err,
							message : cd[err],
						}
					};
			}else{
				response = {
					data     : context.data,
				};
			}

			// console.log("done "+ new Date());
			success(response);
		});
	});
};

function deleteUser(event) {
	return new Promise(function(success,fail){
		var w = new Worker();
		w.do(validate(event,"deleteUser"));
		w.do(users.deleteUser());;
		w.run(function (context, err) {
			let response = {};
			if (err) {
				if(err==502)
					response = {
						errorMessage : context.vresponse
					};
				else
					response = {
						errorMessage : {
							code : err,
							message : cd[err],
						}
					};
			}else{
				response = {
					data     : context.data,
				};
			}

			// console.log("done "+ new Date());
			success(response);
		});
	});
};


function run(type,event) {
	switch(type) {
		case "registerUser":
			return registerUser(event);
		case "getUser":
			return getUser(event);
		case "updateUser":
			return updateUser(event);
		case "deleteUser":
			return deleteUser(event);
		default:
			return new Promise(function(success,fail){
				return success({
					errorMessage : {
						code    : 503,
						message : cd[503],
					}
				});
			});
			break;
	}
}


