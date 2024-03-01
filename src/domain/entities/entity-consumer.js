const consumerSchema = (db) => {
  const consumerSchema = new db.Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, unique: true },
      dni: { type: String, trim: true },
      CP: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      consumerGroup: { type: db.Schema.Types.ObjectId, ref: 'ConsumerGroup' },
      address: { type: String, required: true, trim: true },
      avatar: { type: String, trim: true },
      KgByDefault: { type: Number, required: true, trim: true },
      records: [{ type: db.Schema.Types.ObjectId, ref: 'FinalRecord' }],
      bills: [{ type: db.Schema.Types.ObjectId, ref: 'Bill' }],
      favorites: [{ type: db.Schema.Types.ObjectId, ref: 'Product' }],
      discarded: [{ type: db.Schema.Types.ObjectId, ref: 'Product' }],
      active: { type: Boolean, default: true, required: true, trim: true },
      orderInProgress: [{ type: db.Schema.Types.ObjectId, ref: 'FinalRecord' }],
      orderFavs: [{ type: db.Schema.Types.ObjectId, ref: 'FinalRecord' }]
    },
    {
      timestamps: true
    }
  )
  return db.model('Consumer', consumerSchema)
}

export default consumerSchema
