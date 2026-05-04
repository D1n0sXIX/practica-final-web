import mongoose from "mongoose";

const deliveryNoteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },

    format: { type: String, enum: ['material', 'hours'], required: true },
    description: String,
    workDate: Date,

    material: String,
    quantity: Number,
    unit: String,

    hours: Number,
    workers: [{name: String, hours: Number}],

    signed: Boolean,
    signedAt: Date,
    signatureUrl: String,
    pdfUrl: String,
    deleted: { type: Boolean, default: false }
}, { timestamps: true, toJSON: { virtuals: true } });

const DeliveryNote = mongoose.model('DeliveryNote', deliveryNoteSchema);
export default DeliveryNote;