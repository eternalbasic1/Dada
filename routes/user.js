const express = require("express");
const router = express.Router();


const {getUserById, getUser,getAllUsers,updateUser,userPurchaseList} = require("../controllers/user");
const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth");

router.param("userId",getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.put("/user/:userId",isSignedIn, isAuthenticated,updateUser);


router.get("/orders/user/:userId",isSignedIn, isAuthenticated,userPurchaseList);

router.get("/users" , getAllUsers ) // if you want to use this try to import getAllUsers from above 

module.exports = router;