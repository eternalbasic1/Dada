const User = require("../models/user");
const { check , validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const {expressjwt} = require('express-jwt');

exports.signin = async (req,res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email});

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()[0].msg});
      }
    
    try {
        if (!user) {
            return res.status(400).json({
                error: "User email does not exist"
            });
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password do not match"
            });
        }
        
        // Create token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);

        // Put token in cookie
        res.cookie("token", token, { expire: new Date() + 9999 });

        // Send response to frontend
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, name, email, role } });
    } catch (error) {
        console.error("Error finding user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }

}


exports.signout = (req,res) => {
    res.clearCookie("token");
    res.json({
        message: "User Signout Successfull"
    });
}


// protected routes
exports.isSignedIn = expressjwt({
        secret: process.env.SECRET,
        algorithms: ['HS256'],
        userProperty: "auth"
    }); // It automatically checks the token generated was a logged in user or not 


//custom middleware

exports.isAuthenticated = (req,res,next) => {
    // console.log("Backend,controllers,auth,isAuthenticated");
    // console.log(req);
    let checker = req.profile && req.auth && req.profile._id == req.auth._id; // req.profile is being setup by frontend and req.auth is being setup by the top middleware(isSignedIn) and we are checking profile id === auth id;
    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED"
        })
    }
    next();
}

exports.isAdmin = (req,res,next) => {
    if (req.profile.role === 0){
        return res.status(403).json({
            error: "You are not ADMIN, Access Denied"
        });
    }
    next();
}

exports.testingtest = (req,res) => {
    console.log(req)
    return res.send("YOOO this working finee")
}