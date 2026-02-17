import mongoose, { Schema, model, models } from 'mongoose';

const TestSchema = new Schema({
    name: String,
    timestamp: { type: Date, default: Date.now },
});

// Important: Next.js needs the "models.Test ||" check because of hot-reloading
const Test = models.Test || model('Test', TestSchema);

export default Test;