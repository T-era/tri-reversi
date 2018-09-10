/// コアスレッド: マッチング
module core.matching;

import std.concurrency : spawn, send, receive, Tid, thisTid;
import std.uuid : randomUUID;
import vibe.vibe : logInfo;
import std.string : format;

import core.game_srv : gServer;
import core.dto.common : ShuttingDown, Finished, Player;

enum Keyword { Entry, Retire }

const struct Retire {
	string uid;
}
struct Trio {
	string gid;
	string nameA;
	string nameB;
	string nameC;
	Player assign;
}
class Matcher {
	private Tid tid;

	this() {
		tid = spawn(&run);
	}
	void entry(string name, string uid) {
		logInfo(name);
		send(tid, thisTid, name, uid);
	}
	void retire(string uid) {
		send(tid, uid);
	}
	void stopAll() {
		send(tid, ShuttingDown());
	}
}
struct EntryItem {
	Tid tid;
	string name;
}
void run() {
	logInfo("Matching thread started.");
	EntryItem[string] waiting;
	bool[Tid] gServerList;
	for (bool running = true; running;) {
		receive(
			(Tid tid, string name, string uid) {
				// entry
				waiting[uid] = EntryItem(tid, name);

				while (waiting.length >= 3) {
					auto uid1 = waiting.keys[0];
					auto uid2 = waiting.keys[1];
					auto uid3 = waiting.keys[2];
					auto item1 = waiting[uid1];
					auto item2 = waiting[uid2];
					auto item3 = waiting[uid3];
					waiting.remove(uid1);
					waiting.remove(uid2);
					waiting.remove(uid3);
					string gid = randomUUID().toString;

					Tid gsTid = spawn(&gServer, item1.tid, item2.tid, item3.tid, thisTid());
					gServerList[gsTid] = true;

					send(item1.tid, gsTid, Trio(gid, item1.name, item2.name, item3.name, Player.A));
					send(item2.tid, gsTid, Trio(gid, item1.name, item2.name, item3.name, Player.B));
					send(item3.tid, gsTid, Trio(gid, item1.name, item2.name, item3.name, Player.C));
				}
			},
			(string uid) {
				// retire
				waiting.remove(uid);
			},
			(ShuttingDown _) {
				running = false;
			},
			(Finished _, Tid gsTid) {
				gServerList.remove(gsTid);
			}
		);
	}
	foreach (tid; gServerList.keys()) {
		logInfo("Server stopping...", tid);
		send(tid, ShuttingDown());
	}
	logInfo("Matching thread finished normally");
}
