var io = require('socket.io-client');
var ss = require('socket.io-stream');
var Readable = require('stream').Readable;
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// var rs = new Readable;
// rs.push('beep ');
// rs.push('boop\n');
// rs.push(null);

var socket = io.connect('http://127.0.0.1:3000/chat');
var stream = ss.createStream();

// function getRoomsSelectionStream(socket){
//     ss(socket).on('rooms', function(s){
//         s.pipe(process.stdout);
//     });
// }

// ss(socket).on('begin-chat', function(stream){
//     stream.pipe(process.stdout);
//     var writeChatStream = ss.createStream();
//     ss(socket).emit('chat-to-server', writeChatStream);
//     process.stdin.pipe(writeChatStream);
// })
//
// ss(socket).on('chat-to-client', function(readChatStream){
//     readChatStream.pipe(stdout);
// })
//
//
// // rs.pipe(stream);
function configureSocketForChat(socket){
    console.log('Configuring');
    ss(socket).on('chat-to-client', function(chatStream){
        chatStream.pipe(process.stdout);
    });
    rl.on('line', function(chat){
        console.log('Line:', chat);
        var chatStream = ss.createStream();
        ss(socket).emit('chat-to-server', chatStream);
        var a = new Readable;
        a.push(chat);
        a.push(null);
        a.pipe(chatStream);
    });
}

ss(socket).on('rooms', function(nullStream, rooms){
    rl.question('What room do you want: ' + rooms.toString() + '?', function(chosen){
        ss(socket).emit('room-chosen', null, chosen);
        configureSocketForChat(socket);
    });
});
