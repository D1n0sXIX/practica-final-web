import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    name :String,
    projectCode: String,
    address: {
        street: String,
        number: String,
        postal: String,
        city: String,
        province: String
    },
    email: String,
    notes: String,
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false }

}, { timestamps: true, toJSON: { virtuals: true } });

const Project = mongoose.model('Project', projectSchema);
export default Project;
