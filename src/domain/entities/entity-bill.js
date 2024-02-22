const billSchema = (db) => {
  const billSchema = new db.Schema(
    {
      date: { type: String, required: true, trim: true },
      consumerName: { type: String, required: true, trim: true },
      consumer: { type: db.Schema.Types.ObjectId, ref: 'Consumer' },
      total: { type: Number, required: true, trim: true },
      billStatus: { type: Boolean, required: true, trim: true, default: false },
      registers: [{ type: db.Schema.Types.ObjectId, ref: 'FinalRecord' }]
    },
    {
      timestamps: true
    }
  )
  return db.model('Bill', billSchema)
}

export default billSchema
