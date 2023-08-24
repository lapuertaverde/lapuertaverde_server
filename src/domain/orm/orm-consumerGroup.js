const conn = require('../repositories/mongo.repository');
const magic = require('../../utils/magic');

exports.GetAll = async () => {
  try {
    return await conn.db.connMongo.ConsumerGroup.find().populate('consumers');
  } catch (error) {
    magic.LogDanger('Cannot getAll consumer group', error);
    return await { err: { code: 123, message: error } };
  }
};

exports.Create = async (name, consumers, monthOrders, anualOrders) => {
  try {
    const data = await new conn.db.connMongo.ConsumerGroup({
      name,
      consumers,
      monthOrders,
      anualOrders,
    });

    data.save();
    return data;
  } catch (error) {
    magic.LogDanger('Cannot Create deck', error);
    return await { err: { code: 123, message: error } };
  }
};

exports.Delete = async (id) => {
  try {
    return await conn.db.connMongo.ConsumerGroup.findByIdAndDelete(id);
  } catch (error) {
    magic.LogDanger('Cannot Delete deck', error);
    return await { err: { code: 123, message: error } };
  }
};

exports.Update = async (id, consumerGroup) => {
  try {
    return await conn.db.connMongo.ConsumerGroup.findByIdAndUpdate(
      id,
      consumerGroup,
    );
  } catch (error) {
    magic.LogDanger('Cannot Update consumer group', error);
    return await { err: { code: 123, message: error } };
  }
};

exports.GetById = async (id) => {
  try {
    return await conn.db.connMongo.ConsumerGroup.findById(id).populate('consumers');
  } catch (error) {
    magic.LogDanger('Cannot get the consumer group by its ID', error);
    return await { err: { code: 123, message: error } };
  }
};
