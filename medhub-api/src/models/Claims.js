import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    claimID: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
      unique: false
    },
    claimDate : { type: Date, required: true },
    status : { type: String, required: false },       
    carrier : { type: String, required: true }
  }
,  { timestamps: true }
);


export default mongoose.model("Claims", schema);