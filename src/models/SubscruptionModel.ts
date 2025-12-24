import mongoose, {Schema} from "mongoose";

const SubscriptionSchema = new Schema({
    subscriber: {
        type:Schema.Types.ObjectId, // one who is subscribing
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId,//✔ This is WHO is being followed
//✔ The owner of the channel / profile
        ref:"User"
    }
},
{timestamps:true})



export const Subscription = mongoose.model("Subscription",SubscriptionSchema)