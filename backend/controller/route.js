var express     = require('express');
var router      = express.Router();
const _         = require('lodash');
const u         = require('../form/users');


router.post('/api/user/register', async function(req, response, next) {
	let a = await  u.run('registerUser',req);
	return response.json(a);
});

router.put('/api/user/update', async function(req, response, next) {
	let a = await  u.run('updateUser',req);
	return response.json(a);
});

router.delete('/api/user/delete', async function(req, response, next) {
	let a = await  u.run('deleteUser',req);
	return response.json(a);
});

router.get('/api/user/get', async function(req, response, next) {
	let a = await  u.run('getUser',req);
	return response.json(a);
});


module.exports = router;