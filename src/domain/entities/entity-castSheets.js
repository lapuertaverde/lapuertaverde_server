const castSheets = (db) => {
  const castSheets = new db.Schema(
    {
      date: { type: String, required: true, trim: true },
      consumerGroup: { type: db.Schema.Types.ObjectId, ref: 'ConsumerGroup' },
      consumers: [{ type: db.Schema.Types.ObjectId, ref: 'Consumer' }],
      deliveryAddress: { type: String, required: true, trim: true },
      bills: [{ type: db.Schema.Types.ObjectId, ref: 'Bill' }],
      castStatus: {
        type: String,
        enum: ['Previo', 'Repartido'],
        default: 'Previo',
        required: true,
        trim: true
      },
      records: [{ type: db.Schema.Types.ObjectId, ref: 'FinalRecord' }]
    },
    {
      timestamps: true
    }
  )
  return db.model('CastSheets', castSheets)
}

export default castSheets
