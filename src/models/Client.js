import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    name: { type: String, required: true },
    cif: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
        street: String,
        number: String,
        postal: String,
        city: String,
        province: String
    },
    deleted: { type: Boolean, default: false }

}, { timestamps: true, toJSON: { virtuals: true } });

const Client = mongoose.model('Client', clientSchema);
export default Client;

