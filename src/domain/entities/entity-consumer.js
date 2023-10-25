const consumerSchema = (db) => {
  const consumerSchema = new db.Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      dni: { type: String, trim: true },
      CP: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      consumerGroup: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      KgByDefault: { type: Number, required: true, trim: true },
      weeklyLog: [{ type: db.Schema.Types.ObjectId, ref: 'FinalRecord' }],
      monthlyBills: [{ type: db.Schema.Types.ObjectId, ref: 'Bill' }],
      favorites: { type: String, trim: true },
      discarded: { type: String, trim: true },
      active: { type: Boolean, required: true, trim: true }
    },
    {
      timestamps: true
    }
  )
  return db.model('Consumer', consumerSchema)
}

export default consumerSchema
