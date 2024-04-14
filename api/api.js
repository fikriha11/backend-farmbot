const router = require("./routes/route.js");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { format } = require("date-fns");

const port = 8000;
const app = express();

app.use(
  morgan((tokens, req, res) => {
    const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS");
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const status = tokens.status(req, res);
    const responseTime = tokens["response-time"](req, res);

    return `[${timestamp}] ${method} ${url} (${responseTime} ms) ${status}`;
  })
);
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port, () =>
  console.log(`Aplikasi Express.js Berjalan pada port ${port}`)
);
