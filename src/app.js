const express = require("express");
const router = require("./routes");
const { notFound, sequelizeErrorHandler, errorHandler } = require("./middlewares/errorHandlers.mw");

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Internet shop API", docs: "/api" }));
app.use("/api", router);

app.use(notFound);
app.use(sequelizeErrorHandler);
app.use(errorHandler);

module.exports = app;
