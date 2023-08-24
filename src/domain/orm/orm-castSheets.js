const conn = require('../repositories/mongo.repository');
const magic = require('../../utils/magic');
const { deleteFile } = require('../../middlewares/delete-file');

exports.GetAll = async (limit = 0, skip = 0) => {
  try {
    return await conn.db.connMongo.Card.find()
      .populate('difficulty')
      .skip(skip)
      .limit(limit);
  } catch (error) {
    magic.LogDanger('Cannot getAll cards', error);
    return await { err: { code: 123, message: error } };
  }
};

exports.Create = async (question, answer, resources, difficulty, idDeck, req) => {
  try {
    const data = await new conn.db.connMongo.Card({
      question: question,
      answer: answer,
      resources: resources,
      difficulty: difficulty,
      idDeck: idDeck,
    });
    if (req.file) {
      data.questionFile = req.file.path;
    } else {
      data.questionFile = 'no image question';
    }
    const deck = await conn.db.connMongo.Deck.findById(idDeck);
    if (deck) {
      data.idDeck = deck._id;
      deck.cards = deck.cards.concat(data._id);
      await deck.save();
    }
    data.save();
    return data;
  } catch (error) {
    magic.LogDanger('Cannot Create Card', error);
    return await { err: { code: 123, message: error } };
  }
};

exports.Delete = async (id) => {
  try {
    const cardToDelete = await conn.db.connMongo.Card.findById(id);
    const deck = await conn.db.connMongo.Deck.findById(cardToDelete.idDeck);

    if (deck) {
      if (cardToDelete.questionFile) {
        await deleteFile(cardToDelete.questionFile);
      }
      for (const card of deck.cards) {
        if (card == id) {
          const position = deck.cards.indexOf(card);
          deck.cards.splice(position, 1);
        }
      }
      await deck.save();
      return await conn.db.connMongo.Card.findByIdAndDelete(id);
    } else {
      return magic.LogDanger(
        'Cannot Delete Card because the deck it belongs does not exist',
      );
    }
  } catch (error) {
    magic.LogDanger('Cannot Delete Card', error);
    return await { err: { code: 123, message: error } };
  }
};

exports.Update = async (id, updatedCard, req) => {
  try {
    const olderCard = await conn.db.connMongo.Card.findById(id);
    olderCard.image && deleteFile(olderCard.image);
    req.file
      ? (updatedCard.image = req.file.path)
      : (updatedCard.image = 'image did not change');
    return await conn.db.connMongo.Card.findByIdAndUpdate(id, updatedCard);
  } catch (error) {
    magic.LogDanger('Cannot Update Card', error);
    return await { err: { code: 123, message: error } };
  }
};

exports.GetById = async (id) => {
  try {
    return await conn.db.connMongo.Card.findById(id).populate('difficulty');
  } catch (error) {
    magic.LogDanger('Cannot get the Card by its ID', error);
    return await { err: { code: 123, message: error } };
  }
};