module.exports = (db) => {
    const consumerSchema = new db.Schema(
      {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        consumerGroup:  { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true }
      },
      {
        timestamps: true,
      },
    );
    return db.model('Consumer', consumerSchema);
  };