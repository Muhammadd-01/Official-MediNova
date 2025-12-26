import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        role: { type: String, required: true }, // e.g., "Chief Medical Officer", "Senior Nurse"
        specialty: { type: String, required: true },
        experience: { type: String },
        image: { type: String }, // URL to image
        type: {
            type: String,
            enum: ["doctor", "nurse", "staff"],
            default: "doctor"
        },
    },
    { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
