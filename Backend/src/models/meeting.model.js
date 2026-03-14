import mongoose from "mongoose";
import { type } from "os";
const { Schema } = mongoose;

const meetingSchema = new Schema(
    {
        user_id:{
            type:String,
                },
        meetingCode:{
            type: String,
            required: true,
        },
        date:{
            type: date ,
            default: Date.now(),
            required: true,
        }
    }
);

const Meeting = mongoose.model('Meeting' , meetingSchema );

export {Meeting};
