const _         = require('lodash');
const moment    = require("moment-timezone");
const m         = require('../../models');
const Sequelize = require('sequelize');
const crypto    = require('crypto');
const Op        = Sequelize.Op;
const validator = require("email-validator");;


exports = module.exports = {};
exports.veifyUsername    = veifyUsername;
exports.veifyEmail       = veifyEmail;
exports.registerUser       = registerUser;
exports.updateUser       = updateUser;
exports.deleteUser       = deleteUser;
exports.getUser          = getUser;


function getUser() {
	return function (context, next){
		var page = context.page || 0;
		var per_page = _.toNumber(context.per_page) || 20;
		page = page - 1 < 0 ? 0 : page - 1;
		var offset = page * per_page;

		var query = {deleted_at   : null };

		if(!_.isNull(context.id) && context.id != '' && !_.isUndefined(context.id)){
			item = {id   : context.id};
			query = Object.assign(query,item);
		}

		if(!_.isNull(context.username) && context.username != '' && !_.isUndefined(context.username)){
			item = {username   : context.username};
			query = Object.assign(query,item);
		}

		m.user.findAndCountAll({
			where   : query,
			offset  : offset,
			limit   : per_page,
			order: [
				['id', 'DESC'],
			],
		})
		.then(function(obj) {

			let item = [];
			_.each(obj.rows,function (o, key){
				o.skillsets = JSON.parse(o.skillsets);
				o.hobby     = JSON.parse(o.hobby);
				item.push(o);
			});


			var meta =  {
				page        : page + 1,
				per_page    : per_page,
				total_items : obj.count,
				total_pages : Math.ceil(obj.count / per_page)
			}
			context.meta   = meta ;
			context.data   = item;
			next();
		});
	}
}

function registerUser() {
	return function (context, next){

		if(typeof(context.skillsets) != 'object'){
			context.vresponse = {
				code    : 502,
				message : "skillsets must be object.",
			};
			return next(502);
		}

		if(typeof(context.hobby) != 'object'){
			context.vresponse = {
				code    : 502,
				message : "hobby must be object.",
			};
			return next(502);
		}

		m.user.create({
			name         : context.name,
			username     : context.username,
			email        : context.email,
			phone_number : context.phone_number,
			skillsets    : JSON.stringify(context.skillsets),
			hobby        : JSON.stringify(context.hobby),
			status       : 'active',
			created_at   : new Date(),
		}).then(async function(obj) {

			obj.skillsets = JSON.parse(obj.skillsets);
			obj.hobby     = JSON.parse(obj.hobby);

			context.data  = obj;
			next();
		}).catch(function (err) {
			next(1502);
		})
	};
};

function veifyUsername() {
	return function (context, next){

		m.user.findOne({
			where: {
				username       : context.username,
				deleted_at     : null
			}
		})
		.then(function(item) {
			if(!_.isEmpty(item))
				return next(1505);
			return next();
		}).catch(function (err) {
			console.log(err)
			next(1505);
		});
	}
};

function veifyEmail() {
	return function (context, next){

		var v_email = validator.validate(context.email);
		if(v_email==false)
			return next(1507);

		return next();
		// m.user.findOne({
		// 	where: {
		// 		email       : context.email,
		// 		deleted_at  : null
		// 	}
		// })
		// .then(function(item) {
		// 	if(!_.isEmpty(item))
		// 		return next(1506);
		// 	return next();
		// }).catch(function (err) {
		// 	console.log(err)
		// 	next(1506);
		// });
	}
};

function updateUser() {
	return function (context, next){

		if(typeof(context.skillsets) != 'object'){
			context.vresponse = {
				code    : 502,
				message : "skillsets must be object.",
			};
			return next(502);
		}

		if(typeof(context.hobby) != 'object'){
			context.vresponse = {
				code    : 502,
				message : "hobby must be object.",
			};
			return next(502);
		}

		m.user.findOne({
			where: {
				id          : context.id,
			}
		})
		.then(function(item) {
			item.update({
				name         : context.name,
				email        : context.email,
				phone_number : context.phone_number,
				skillsets    : JSON.stringify(context.skillsets),
				hobby        : JSON.stringify(context.hobby),
				updated_at           : new Date()
			}).then(function(obj) {

				obj.skillsets = JSON.parse(obj.skillsets);
				obj.hobby     = JSON.parse(obj.hobby);

				context.data  = obj;
				next();
			}).catch(function (err) {
				console.log(err)
				next(1503);
			});
		}).catch(function (err) {
			console.log(err)
			next(1503);
		});
	}
};

function deleteUser() {
	return function (context, next){

		m.user.findOne({
			where: {
				id          : context.id,
			}
		})
		.then(function(item) {

			item.update({
				deleted_at           : new Date()
			}).then(function(obj) {
				context.data = obj;
				next();
			}).catch(function (err) {
				console.log(err)
				next(1504);
			});
		}).catch(function (err) {
			console.log(err)
			next(1504);
		});
	}
};