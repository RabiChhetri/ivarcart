// import mongoose from "mongoose";

// interface IUser{
//     _id?:mongoose.Types.ObjectId,
//     name:string,
//     email:string,
//     password?:string,
//     mobile?:string,
//     role:"user"|"deliveryBoy"|"admin",
//     image?:string,
//     location: {
//     type: {
//         type: StringConstructor;
//         enum: string[];
//         default: string;
//     };
//     cordinates: {
//         type: NumberConstructor[];
//         default: number[];
//     };
// }   
// }
// const userSchema=new mongoose.Schema<IUser>({
//     name:{
//         type:String,
//         required:true
//     },
//     email:{
//         type:String,
//         unique:true,
//         required:true
//     },
//     password:{
//         type:String,
//         required:false
//     },
//     mobile:{
//         type:String,
//         required:false
//     },
//     role:{
//         type:String,
//         enum:["user","deliveryBoy","admin"],
//         default:"user"
//     },
//     image:{
//         type:String
//     },
//     location:{
//         type:{
//             type:String,
//             enum:["Point"],
//             default:"Point"
//         },
//         cordinates:{
//             type:[Number],
//             default:[0,0],
//         }
//     }
// },{timestamps:true})
// userSchema.index({location:"2dsphere"})
// const User=mongoose.models.User||mongoose.model("User",userSchema)
// export default User



import mongoose from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;

  socketId?: string;      // ✅ added
  isOnline?: boolean;     // ✅ added

  location: {
    type: "Point";
    cordinates: number[];
  };
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
    },

    mobile: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "deliveryBoy", "admin"],
      default: "user",
    },

    image: {
      type: String,
    },

    // ✅ SOCKET FIELDS
    socketId: {
      type: String,
      default: null,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    // 📍 GEO LOCATION
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      cordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  },
  { timestamps: true }
);

// ✅ required for geo queries
userSchema.index({ location: "2dsphere" });

const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
