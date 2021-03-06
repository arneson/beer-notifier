const express = require("express");
const bodyParser = require("body-parser");
const querystring = require("querystring");
const debug = require("debug")("botkit:webserver");

module.exports = controller => {
  const webserver = express();
  webserver.use(bodyParser.json());
  webserver.use(bodyParser.urlencoded({ extended: true }));

  webserver.use(express.static("public"));
  webserver.set("port", process.env.PORT || 5000);
  webserver.set(
    "url",
    process.env.APP_URL || "localhost:" + webserver.get("port")
  );
  webserver.listen(webserver.get("port"), null, () => {
    debug(
      "Express webserver configured and listening at http://localhost:" +
        process.env.PORT || 5000
    );
  });

  // import all the pre-defined routes that are present in /components/routes
  const normalizedPath = require("path").join(__dirname, "routes");
  require("fs").readdirSync(normalizedPath).forEach(file => {
    require("./routes/" + file)(webserver, controller);
  });

  controller.webserver = webserver;

  return webserver;
};
