// logique de routine
const express = require('express');

const router = express.Router();


const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauces');
const ownerSauce = require('../middleware/ownerSauce');

router.get('/', auth, sauceCtrl.getAllSauce);

router.post('/', auth, multer, sauceCtrl.createSauce);

router.get('/:id', auth, sauceCtrl.getOneSauce);

router.put('/:id', auth, ownerSauce, multer, sauceCtrl.modifySauce);

router.delete('/:id', auth, ownerSauce, sauceCtrl.deleteSauce);

router.post('/:id/like', auth, sauceCtrl.likeDislike);
module.exports = router;