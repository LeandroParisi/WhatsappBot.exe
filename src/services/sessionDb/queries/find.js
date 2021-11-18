const find = async (db, query) => {
  let output = [];
  await db.find(query, (err, docs) => {
    console.log({ docs });
    output = docs;
  });

  return output;
};

module.exports = find;
