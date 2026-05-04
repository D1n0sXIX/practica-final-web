import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    owner : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    cif: { type: String, required: true, unique: true },
    address: {
        street: { type: String },
        number: { type: String },
        postal: { type: String },
        city: { type: String },
        province: { type: String }},
    logo : { type: String },
    isFreelance: { type: Boolean },
    deleted : { type: Boolean, default: false }
    },{ timestamps: true, toJSON: { virtuals: true } });

const Company = mongoose.model('Company', companySchema);
export default Company;
