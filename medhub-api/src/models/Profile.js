import mongoose from "mongoose";


const schema = new mongoose.Schema(
  {
		"email" : "",
		"user" : {
	     	"name" : {
	     		"firstname" : "",
	     		"lastname" : ""
	     	},
	     	"address" : {
				"address1" : "",
				"address2" : "",
				"state" : "",
				"zip" : ""
		 	},
	    	"contactMethod" : {
				"preferredContactMethod" : "",
				"cellphone" : "",	  		
				"voice" : ""
			}
		}
  }
 );

schema.methods.getProfile = function getProfile(){
	return {
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      address1: this.address1
	}
};

schema.methods.setData = function setData(email, firstname, lastname, address1) {
	return {
		email: this.email,
		firstname: this.firstname,
		lastname: this.lastname,
		address1: this.address1
	}
};

schema.methods.createProfiles = function createProfiles() {
  const profileDetail =  setData("firstuser@me.com", "first", "user" , "1 test dr");
       
  profile.save(function (err) {
    if (err) {
      console.log('Error creating New Profile: ' + err);
      return
    }
    console.log('New Profile: ' + profile);
  });
}

export default mongoose.model("Profile", schema);
