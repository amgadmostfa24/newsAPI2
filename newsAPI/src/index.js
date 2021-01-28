const express = require("express");
require("./db/mongoose");
const newsRouter = require("./router/nRouter");
const reportersRouter = require("./router/reporters");

const app = express();
const port = 3000;

app.use(express.json());
app.use(newsRouter);
app.use(reportersRouter);

app.use((req, res, next) => {
  next();
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
