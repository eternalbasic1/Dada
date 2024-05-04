// We generally use app.get or app.post, But we don't do that instead we use express router in this we use router.get or router.post

const express = require('express');
const router = express.Router();
const { check , validationResult } = require('express-validator'); // https://express-validator.github.io/docs/

const {signout,signup,signin,isSignedIn, testingtest} = require("../controllers/auth");

router.post("/signup",[
    check("name","Name Should be atleast 3 characters").isLength({min:3}),
    check("email","Email is Required").isEmail(),
    check("password","Password should be atleast 3 char").isLength({min: 3}),
    ], 
    signup
);

router.post("/signin",[
    check("email","Email is Required").isEmail(),
    check("password","Password field is required").isLength({min: 1}),
    ],
    signin
);


router.get("signout" , signout);

router.get("testroute", isSignedIn , (req,res) => {
    res.json(req.auth); //In custom Middle ware We EveryTime writes next() keyword but here using express-jwt we never wrote it because expressJwt here already has next() method covered up for us
})

router.get('/test', testingtest)

module.exports = router;