const product = (db) => {
  const product = new db.Schema(
    {
      name: { type: String, required: true },
      likes: [{ type: db.Schema.Types.ObjectId, ref: 'Consumer' }],
      discarded: [{ type: db.Schema.Types.ObjectId, ref: 'Consumer' }],
      image: { type: String, required: true, trim: true },
      priceKg: { type: Number, required: true, trim: true },
      priceKgSuplements: { type: Number, required: true, trim: true },
      description: { type: String, required: true },
      availability: { type: Boolean, default: true }
    },
    {
      timestamps: true
    }
  )
  return db.model('Product', product)
}

export default product
