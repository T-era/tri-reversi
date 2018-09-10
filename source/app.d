import vibe.vibe : HTTPServerSettings, URLRouter, serveStaticFiles, listenHTTP
		, logInfo, runApplication, handleWebSockets;
import std.format : format;

import core.matching : Matcher;
import listeners.alive : alive;
import listeners.trs : trsListener;

const PORT = 8080;

void main() {
	auto settings = new HTTPServerSettings;
	settings.port = PORT;

	auto router = new URLRouter;

	auto matcher = new Matcher();
	scope(exit) matcher.stopAll();
	router.get("/tr", handleWebSockets(trsListener(matcher)));
	router.get("/", &alive);
//	router.get("/types", &getTypes);
	router.get("/*", serveStaticFiles("./public/"));

	listenHTTP(settings, router);

	logInfo(format("Please open http://127.0.0.1:%d/ in your browser.", PORT));
	runApplication();
	logInfo("Shutting down...");
}
