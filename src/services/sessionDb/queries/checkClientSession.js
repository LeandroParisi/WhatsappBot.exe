const db = require('../config');

const checkClientSession = (clientId) => {
  let result = [];

  // const callbackWrapper = (clientId, result) => (err, docs) => {
  //   result = docs;
  // };

  db.find({ _id: clientId }, (function () {
    return function (erro, docs) {
      result = docs;
    };
  }()));

  console.log({ result });

  return result;
};

module.exports = checkClientSession;
