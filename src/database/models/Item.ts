import { Schema, model } from "mongoose";
import type { InferSchemaType } from "mongoose";

const itemSchema = new Schema({
  madeIn: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  picture: {
    type: String,
  },
});

export const Item = model("Item", itemSchema, "items");

export type ItemStructure = InferSchemaType<typeof itemSchema>;
