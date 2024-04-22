const mongoose = require("mongoose");
const { Schema } = mongoose;
const {ObjectId} = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required:true,
        maxlength: 32
    },
    description: {
        type: String,
        trime: true,
        required: true,
        maxlength: 2000
    },
    price: {
        type: Number,
        required: true,
        maxlength: 32,
        trim: true
    },
    category: { // It is called as Mongoose ObjectId schema. It is used in situation we need to associate one schema to another schema as shown below 
        type: ObjectId,
        ref: "Category",
        required: true
    },
    stock: {
        type: Number
    },
    sold: {
        type: Number,
        default:0
    },
    photo:{
        data: Buffer,
        contentType: String
    }
},{timestamps: true});

module.exports = mongoose.model("Product", productSchema);
