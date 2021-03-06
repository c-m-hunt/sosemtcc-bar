require("dotenv").config();

import express from "express";
import apiRouter from "./api/routes";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

const app = express();
const port = process.env.API_PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

const staticPath = __dirname + "/../client/build";

app.use(express.static(staticPath));

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
