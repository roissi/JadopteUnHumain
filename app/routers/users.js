const express = require('express');
const { usersController } = require('../controllers');
const router = express.Router();
const validationModule = require("../service/validation");
const schemaUserBody = require("../schemas/userBody");
const auth = require("../service/security");



/**
 * GET /api/users
 * @summary Récupère tous les users
 * @tags USER
 * @return {string} 200 - all users
 * @return {object} 500 - Unexpected error
 */

router.get('/users', auth.checkToken, usersController.getAll);



/**
 * GET /api/user/:id
 * @summary Récupère un user
 * @tags USER
 * @return {string} 200 - one user
 * @return {object} 500 - Unexpected error
 */

router.get('/user/:id', auth.checkToken, usersController.getUser);

/**
 * PATCH /api/user/:id
 * @summary Modifie un user
 * @tags USER
 * @return {string} 200 - update user
 * @return {object} 500 - Unexpected error
 */

router.patch('/user/:id', auth.checkToken, validationModule.check(schemaUserBody,"body"), usersController.updateUser);

/**
 * DELETE /api/user/:id
 * @summary Supprime un user
 * @tags USER
 * @return {string} 200 - delete user
 * @return {object} 500 - Unexpected error
 */

router.delete('/user/:id', auth.checkToken, usersController.deleteUser);


module.exports = router;
