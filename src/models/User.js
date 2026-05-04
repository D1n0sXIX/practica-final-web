import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : { type: String, required: true, unique: true },
    password : { type: String, required: true },
    name : { type: String },
    lastName : { type: String},
    nif : { type: String},
    role : { type: String, required: true, enum: ['admin', 'guest'], default: 'admin', index: true },
    status : { type: String, required: true, enum: ['pending', 'verified'], default: 'pending' , index: true },
    verificationCode : { type: String, required: true },
    verificationAttempts : { type: Number, required: true, default: 0 },
    company : { type : mongoose.Schema.Types.ObjectId, ref: 'Company', index : true },
    address: {
        street: { type: String },
        number: { type: String },
        postal: { type: String },
        city: { type: String },
        province: { type: String }
        },
    deleted : { type: Boolean, required: true, default: false },
    }, { timestamps: true, toJSON: { virtuals: true } }
)

userSchema.virtual('fullName').get(function() {
    return `${this.name} ${this.lastName}`
});

const User = mongoose.model('User', userSchema);
export default User;