const userSchema = (db) => {
  const userSchema = new db.Schema(
    {
      name: { type: String, required: true, trim: true },
      password: { type: String, required: true, trim: true },
      avatar: { type: String, trim: true }
    },
    {
      timestamps: true
    }
  )
  return db.model('User', userSchema)
}

export default userSchema
