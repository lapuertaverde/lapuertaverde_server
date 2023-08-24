const conn = require('../repositories/mongo.repository');
const magic = require('../../utils/magic');

exports.GetAll = async () => {
  try {
    return await conn.db.connMongo.Consumer.find().populate('consumerGroup');
  } catch (error) {
    magic.LogDanger('Cannot get All consumers', error);
  }
};

exports.Create = async (name, email, phone, consumerGroup, address) => {
  try {
    const data = await new conn.db.connMongo.Consumer({
      name,
      email,
      phone,
      consumerGroup,
      address,
    });
    data.save();
    if (consumerGroup) {
      const consumerGroupToUpdate = await conn.db.connMongo.ConsumerGroup.find({
        name: consumerGroup,
      });
      //Suponiendo que un consumidor no pueda estar en dos grupos a la vez
      const { _id, consumers } = await consumerGroupToUpdate[0];
      await conn.db.connMongo.ConsumerGroup.findByIdAndUpdate(_id, {
        ...consumerGroupToUpdate,
        consumers: [...consumers, data._id],
      });
    }
    return data;
  } catch (error) {
    magic.LogDanger('Cannot Create consumer', error);
    return { err: { code: 123, message: error } };
  }
};

exports.Delete = async (id) => {
  try {
    return await conn.db.connMongo.Consumer.deleteOne({ _id: id });
  } catch (error) {
    magic.LogDanger('Cannot Delete consumer', error);
    return { err: { code: 123, message: error } };
  }
};

exports.Update = async (id, updatedUser) => {
  try {
    return await conn.db.connMongo.Consumer.findByIdAndUpdate(id, updatedUser);
  } catch (error) {
    magic.LogDanger('Cannot Update consumer', error);
    return await { err: { code: 123, message: error } };
  }
};

exports.GetById = async (id) => {
  try {
    return await conn.db.connMongo.Consumer.findById(id);
  } catch (error) {
    magic.LogDanger('Cannot get the consumer by its ID', error);
    return await { err: { code: 123, message: error } };
  }
};

exports.GetByName = async (name) => {
  try {
    return await conn.db.connMongo.Consumer.find({ name });
  } catch (error) {
    magic.LogDanger('Cannot get the consumer by its name', error);
    return await { err: { code: 123, message: error } };
  }
};
