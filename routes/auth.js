const express= require('express');
const router= express.Router();
const authController=require('../controllers/authController');


router.post('/',authController.handleLogin);
router.get('/',authController.getUsersDetails);

router.route('/:id')
.put(authController.updateRoles);

module.exports=router;