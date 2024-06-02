import { Schema, model } from 'mongoose'

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
  },
})

const Category = model('Category', categorySchema)

export default Category
