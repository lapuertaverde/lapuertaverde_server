const finalRecord = (db) => {
  const finalRecord = new db.Schema(
    {
      date: { type: String, required: true, trim: true },
      consumer: { type: db.Schema.Types.ObjectId, ref: 'Consumer' },
      deliveredKgs: { type: Number, required: true, trim: true },
      supplementsKgs: { type: Number, required: true, trim: true },
      priceKg: { type: Number, required: true, trim: true },
      priceKgSuplements: { type: Number, required: true, trim: true },
      totalEuros: { type: Number, required: true, trim: true },
      bill: { type: db.Schema.Types.ObjectId, ref: 'Bill' },
      like: { type: Boolean, default: false }
    },
    {
      timestamps: true
    }
  )
  return db.model('FinalRecord', finalRecord)
}

export default finalRecord
