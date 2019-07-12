const mongoose = require("mongoose");
const MONGO_PASS = process.env.SECRET;
const MONGO_URI = `mongodb://notesystem:${MONGO_PASS}@ds151007.mlab.com:51007/notesystem`;
mongoose
  .connect(MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(db => {
    console.log("DB is connected");
  })
  .catch(err => {
    console.error(err);
  });
