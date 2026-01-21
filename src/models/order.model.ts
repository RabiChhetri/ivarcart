// import mongoose from "mongoose";

// interface IOrder{
//     _id?:mongoose.Types.ObjectId,
//     user:mongoose.Types.ObjectId,
//     items:[
//         {
//             grocery:mongoose.Types.ObjectId,
//             name:String,
//             price:String,
//             unit:String,
//             image:String,
//             quanity:number,
//         }
//     ],
//     isPaid?:Boolean,
//     totalAmount:number,
//     paymentMethod:'cod' | 'online'
//     address:{
//         fullName:String,
//         mobile:String,
//         city:String,
//         state:String,
//         pincode:String,
//         fullAddress:String,
//         latitude:number,
//         longitude:number,
//     }
//     status:"pending"|"out of delivery"|"delivered",
//     createdAt?:Date,
//     updateAt?:Date,

// }
// const orderSchema=new mongoose.Schema<IOrder>({
//     user:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User",
//         required:true
//     },
//     items:[
//         {
//             grocery:{
//             type:mongoose.Schema.Types.ObjectId,
//             ref:"Grocery",
//             required:true},
//         name:String,
//         price:String,
//         unit:String,
//         image:String,
//         quantity:Number
//         },
//     ],
//     paymentMethod:{
//         type:String,
//         enum:["cod","online"],
//         default:"cod",
//     },
//     isPaid:{
//         type:Boolean,
//         default:false,
//     },
//     totalAmount:{
//         type:Number,
//     },
//     address:{
//         fullName:String,
//         mobile:String,
//         city:String,
//         state:String,
//         pincode:String,
//         fullAddress:String,
//         latitude:Number,
//         longitude:Number,
//     },
//     status:{
//         type:String,
//         enum:["pending","out of delivery","delivered"],
//         default:"pending"
//     }
// },{timestamps:true})

// const Order=mongoose.models.Order || mongoose.model("Order",orderSchema)
// export default Order



import mongoose from "mongoose";

interface IOrder {
  user: mongoose.Types.ObjectId;
  items: {
    grocery: mongoose.Types.ObjectId;
    name: string;
    price: string;
    unit: string;
    image: string;
    quantity: number;
  }[];
  paymentMethod: "cod" | "online";
  isPaid: boolean;
  totalAmount: number;
  address: {
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  status: "pending" | "out of delivery" | "delivered";
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        grocery: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Grocery",
          required: true,
        },
        name: String,
        price: String,
        unit: String,
        image: String,
        quantity: Number,
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    totalAmount: Number,
    address: {
      fullName: String,
      mobile: String,
      city: String,
      state: String,
      pincode: String,
      fullAddress: String,
      latitude: Number,
      longitude: Number,
    },
    status: {
      type: String,
      enum: ["pending", "out of delivery", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;
