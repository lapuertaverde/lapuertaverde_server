const userSchema = (db) => {
  const userSchema = new db.Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, unique: true },
      password: { type: String, required: true, trim: true },
      avatar: { type: String, trim: true },
      role: { type: String, enum: ['Admin', 'Consumer'], trim: true, default: 'Consumer' },
      priceKg: { type: Number, default: 3 },
      priceFuel: { type: Number, default: 2 }
    },
    {
      timestamps: true
    }
  )
  return db.model('User', userSchema)
}

export default userSchema
