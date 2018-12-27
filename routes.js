const path = require('path');

const express = require('express');

const viewOverview = require('./controllers/viewOverview');
const viewDetail = require('./controllers/viewDetail');
const viewGetError = require('./controllers/viewGetError');
const viewPostError = require('./controllers/viewPostError');
const viewAddApp = require('./controllers/viewAddApp');
const addApp = require('./controllers/addApp');

const router = express.Router();


router.get('/', viewOverview);
router.get('/details/:id/getError/:errorIndex', viewGetError);
router.get('/details/:id/postError/:errorIndex', viewPostError);
router.get('/details/:id', viewDetail);
router.get('/add', viewAddApp);

router.post('/add', addApp)

module.exports = router;
