const express = require("express");
const { ping } = require("tcp-ping-node");
const cors = require("cors");
const app = express();
const port = 3000;

const asyncHandler = (fun) => (req, res, next) => {
  Promise.resolve(fun(req, res, next)).catch(next);
};

// TODO: Swap origin to domain where I host my frontend
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/getip", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log(ip);
  res.send(ip);
});

// A properly formatted request will look like the following:
// Method: GET
// URL: {serverurl}/ping/{ip}/{port} (pingport.info/ping/69.69.69.69/69)
app.get(
  "/ping/:ip/:port",
  asyncHandler(async (req, res) => {
    const result = await sendPing(req.params.ip, req.params.port);
    res.send(result);
  })
);

async function sendPing(ip, port) {
  const options = { host: ip, port: port, timeout: 5000 };
  const result = await ping(options);
  return result;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
