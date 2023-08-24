module.exports = (db) => {
    const castSheets = new db.Schema(
      {
        monthCastSheets: { type: String, required: true, trim: true },
        consumerGroup: [{ type: db.Schema.Types.ObjectId, ref: 'ConsumerGroup' }],
        anualCastSheets: { type: String, required: true, trim: true }
      },
      {
        timestamps: true,
      },
    );
    return db.model('CastSheets', castSheets);
  };