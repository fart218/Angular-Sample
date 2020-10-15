const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 6969 });
var redis = require("redis");
var client = redis.createClient('redis://127.0.0.1:6379');

client.on("connect", function() {
	console.log("You are now connected2");
});

wss.on('connection', ws => {

	ws.on('message', message => {
		let obj = JSON.parse(message);
		if(obj.id != null) ws.id = obj.id;
		switch(obj.event){
			case "appStart":
				resetDocs();
			break;

			case "delDoc":
				client.hdel("documents", obj.id);
				resetDocs();
			break;

                        case "addDoc":
				client.hset("documents", obj.id, '');
				resetDocs();
			break;

			case "getDoc":
				client.hget('documents', obj.id, (err, res) => {
					ws.send(JSON.stringify({ event: "document", data: { id: obj.id, doc: res } }));
				});
			break;

                        case "editDoc":
				ws.id = obj.doc.id;
				client.hset("documents", obj.doc.id, obj.doc.doc);
				wss.clients.forEach( client => {
					if (client !== ws && client.readyState === WebSocket.OPEN && ws.id == client.id) {
						client.send(JSON.stringify({ event: "document", data: obj.doc }))
					}
				})
			break;
		}

		console.log('received: %s', message);
	});

        function resetDocs () {
		client.hkeys('documents', (err, result) => {
			wss.clients.forEach( client =>
				client.send(JSON.stringify({ event: "documents", data: result }))
			)
		});
	}

});
