module.exports = (db) => {
  const castSheets = new db.Schema(
    {
      date: { type: String, required: true, trim: true },
      consumerGroup: { type: String, required: true, trim: true },
      consumers: [{ type: db.Schema.Types.ObjectId, ref: 'Consumer' }],
      deliveryAddress: { type: String, required: true, trim: true },
      status: { type: Boolean, required: true, trim: true }
    },
    {
      timestamps: true
    }
  )
  return db.model('CastSheets', castSheets)
}
