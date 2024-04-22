const mongoose = require("mongoose");
// const crypto = require('node:crypto');
// const createHmac = crypto.createHmac;
const { createHmac } = require('crypto');// Instead of above too we can write this way in ES6
//const { createHmac } = await import('node:crypto'); // SyntaxError: await is only valid in async functions and the top level bodies of modules
//import { v4 as uuidv4 } from 'uuid'; // SyntaxError: Cannot use import statement outside a module
const { v4: uuidv4 } = require('uuid');


const { Schema } = mongoose; // elegant mongodb object modeling for node.js


const userSchema = new Schema({
  name : {
    type : String,
    required :true,
    maxlength: 32,
    trim: true
  },
  lastname: {
    type : String,
    maxlength: 32,
    trim: true
  },
  userinfo:{
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique:true
  },
  encry_password: {
    type:String,
    required: true,
  },
  salt: String, // Generates a random number which furthur helps in encrypting password
  role: {
    type: Number,
    default:0,
  },
  purchases: {
    type: Array,
    default:[]
  }

},{timestamps: true});

userSchema.virtual("password")
    .set(function(password){
      this._password = password;
      this.salt = uuidv4();     //Simple and faster way of generating RFC4122 UUIDs(Simply it generates a longer string for hashing password etc..)
      this.encry_password = this.securePassword(password); //If we directly use securePassword instead of this.securePassword then it's throwing a error as Reference error such as ReferenceError: securePassword is not defined 
    })
    .get(function(){
      return this._password
    })

userSchema.methods = {

  authenticate: function(plainpassword){
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword : function(plainpassword){
    if(!plainpassword) return "";
    try{
      return createHmac('sha256', this.salt)
      .update(plainpassword)
      .digest('hex');
      
    }catch(err){
      return "";
    }

  }

};

module.exports = mongoose.model("User",userSchema);
