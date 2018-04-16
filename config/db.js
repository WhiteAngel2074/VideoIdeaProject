const mongoose = require("mongoose");

if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: "mongodb://root:root@ds239309.mlab.com:39309/videoprod"
  };
} else {
  module.exports = { mongoURI: "mongodb://127.0.0.1/vidjot-dev" };
}
