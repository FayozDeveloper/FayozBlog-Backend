import mongoose from "mongoose";

 const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            isRequired: true,
        },
        text: {
            type: String,
            isRequired: true,
        },
        tags: {
            type: Array,
            default: [],
        },
        views: {
            type: Number,
            default: 0
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        imageUrl: String
    },
    {
        timestamps: true,
    }
)

export default mongoose.model('Post', PostSchema);