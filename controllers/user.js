const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = async (req, res, next, id) => {
    try {
        const user = await User.findById(id).exec();
        if (!user) {
            return res.status(400).json({
                error: "No user was found in DB"
            });
        }
        req.profile = user;
        next();
    } catch (err) {
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};

exports.getUser = (req,res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile);
}


// StackOverflow approach somewhat didn't get that 
// exports.getAllUsers = (req,res) => {
//     User.find({}, function(err, users) {
//         var userMap = {};
    
//         users.forEach(function(user) {
//           userMap[user._id] = user;
//         });
    
//         res.send(userMap); 
//     }); 
// }

// Tutorial Approach Understood
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().exec();
        if (!users || users.length === 0) {
            return res.status(400).json({
                error: "No user found"
            });
        }
        res.json(users);
    } catch (err) {
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.profile._id,
            { $set: req.body },
            { new: true, useFindAndModify: false }
        ).exec();

        if (!updatedUser) {
            return res.status(400).json({
                error: "You are not authorized to update this user"
            });
        }

        // Clear sensitive fields
        updatedUser.salt = undefined;
        updatedUser.encry_password = undefined;
        updatedUser.createdAt = undefined;
        updatedUser.updatedAt = undefined;

        res.json(updatedUser);
    } catch (err) {
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};

//TODO: NEED TO UPDATE Logic
exports.userPurchaseList = (req,res) => {
    Order.find({user: req.profile._id})
    .populate("user","_id name")
    .exec((err,order) => {
        if(err){
            return res.status(400).json({
                error: "No order in this account"
            });
        }

        return res.json(order); 
    });
}

//TODO: NEED TO UPDATE Logic
exports.pushOrderInPurchaseList = (req,res,next) => {

    let purchases = []
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.transaction_id
        });
    }); 

    //Store this in DB.
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true},
        (err,purchases) => {
            if(err){
                return res.status(400).json({
                    error: "unable to save purchase list"
                })
            }
            next();
        }
    )


};

