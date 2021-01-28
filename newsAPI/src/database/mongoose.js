const mongoose = require("mongoose");
const db = "news-api";
const url = "mongodb://127.0.0.1:27017/";

mongoose.connect(url + db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
});
