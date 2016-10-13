var liveServer = require("live-server");

var params = {
    port: 8181, // Set the server port. Defaults to 8080.
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    open: true, // When false, it won't load your browser by default.
};
liveServer.start(params);
