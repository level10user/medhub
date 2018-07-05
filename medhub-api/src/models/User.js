import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";

// TODO: add uniqueness and email validations to email field
const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
      unique: true
    },
    passwordHash: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    confirmationToken: { type: String, default: "" },
    name : {
       firstname : { type: String, required: true },
       lastname : { type: String, required: true }
    },
    address : {
      address1 : { type: String, required: true },
      address2 : { type: String, required: false },
      state : { type: String, required: true },
      zip : { type: String, required: true }
    },
    contactMethod : {
      preferredContactMethod : { type: String, required: true },
      cellphone : { type: String, required: true },       
      homephone : { type: String, required: true }
    }
  },
  { timestamps: true }
);

schema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

schema.methods.setPassword = function setPassword(password) {
  this.passwordHash = bcrypt.hashSync(password, 10);
};

schema.methods.setConfirmationToken = function setConfirmationToken() {
  this.confirmationToken = this.generateJWT();
};

schema.methods.generateConfirmationUrl = function generateConfirmationUrl() {
  return `${process.env.HOST}/confirmation/${this.confirmationToken}`;
};

schema.methods.generateResetPasswordLink = function generateResetPasswordLink() {
  return `${process.env
    .HOST}/reset_password/${this.generateResetPasswordToken()}`;
};

schema.methods.generateJWT = function generateJWT() {
  return jwt.sign(
    {
      email: this.email,
      confirmed: this.confirmed
    },
    process.env.JWT_SECRET
  );
};

schema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    email: this.email,
    firstname: this.name.firstname,
    lastname: this.name.lastname,
    address1: this.address.address1,
    address2 : this.address.address2,
    st :  this.address.state,  
    zip : this.address.zip,
    preferredContactMethod : this.preferredContactMethod,
    cellphone : this.contactMethod.cellphone,       
    homephone : this.contactMethod.homephone,
    confirmed: this.contactMethod.confirmed,
    token: this.generateJWT()
  };
};

schema.methods.toCurrentUser = function toCurrentUser() {
//  console.log ("in toCurrentUser");        
  return {
    email: this.email,
    firstname: this.name.firstname,
    lastname: this.name.lastname,
    address1: this.address.address1,
    address2 : this.address.address2,
    st :  this.address.state,  
    zip : this.address.zip,
    preferredContactMethod : this.preferredContactMethod,
    cellphone : this.contactMethod.cellphone,       
    homephone : this.contactMethod.homephone,
    confirmed: this.contactMethod.confirmed,
    message: {global: "Profile Successfully Updated"}
  };
};

schema.plugin(uniqueValidator, { message: "This email is already taken" });

export default mongoose.model("User", schema);