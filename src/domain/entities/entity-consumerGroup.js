module.exports = (db) => {
  const consumerGroupSchema = new db.Schema(
    {
      name: { type: String, required: true, trim: true },
      consumers: [{ type: db.Schema.Types.ObjectId, ref: 'Consumer' }],
      monthOrders: { type: String, required: true, trim: true },
      anualOrders: { type: String, required: true, trim: true },
    },
    {
      timestamps: true,
    },
  );
  return db.model('ConsumerGroup', consumerGroupSchema);
};
