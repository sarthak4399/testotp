const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const os = require("os");
const ipAddress = getIpAddress();

function getIpAddress() {
  const ifaces = os.networkInterfaces();
  let ipAddress = "localhost";
  Object.keys(ifaces).forEach((ifname) => {
    ifaces[ifname].forEach((iface) => {
      if (iface.family === "IPv4" && iface.internal === false) {
        ipAddress = iface.address;
      }
    });
  })
  return ipAddress;
}

mongoose.connect("mongodb+srv://taskstack_2023:Vp3okn4uoO4u06Xv@taskstack.gdfqzqj.mongodb.net/test");
mongoose.connection.on("error", (err) => {
  console.log("<<<<<<< FAILED CONNECTION >>>>>>>");
});
mongoose.connection.on("connected", (con) => {
  console.log("<<<<<<<< CONNECTED >>>>>>>>");
});

const app = express();
const port = process.env.PORT || 8888;

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

app.use(cors());
app.use(express.json());
app.get("/api", async (req, res) => {
  res.send("Endpoint hit 🎊 🎊 🎊 🎊");
});
app.use("/api/otpgenrator", require("../routes/otpgenrator"));
app.listen(port, () => {
  const ipAddress = getIpAddress();
  console.log(`Example app listening at http://${ipAddress}:${port}`);
});
