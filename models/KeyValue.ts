import mongoose, { Schema, model, models } from 'mongoose';

const KVSchema = new Schema({
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now }
});

const KeyValue = models.KeyValue || model('KeyValue', KVSchema);
export default KeyValue;