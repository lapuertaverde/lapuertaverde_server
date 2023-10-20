const consumerGroupSchema = (db) => {
  const consumerGroupSchema = new db.Schema(
    {
      name: { type: String, required: true, trim: true },
      consumers: [{ type: db.Schema.Types.ObjectId, ref: 'Consumer' }],
      castSheets: [{ type: db.Schema.Types.ObjectId, ref: 'CastSheets' }]
    },
    {
      timestamps: true
    }
  )
  return db.model('ConsumerGroup', consumerGroupSchema)
}

export default consumerGroupSchema
