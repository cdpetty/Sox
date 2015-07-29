var io = require('socket.io').listen(3000);
var ss = require('socket.io-stream');
var path = require('path');
var Readable = require('stream').Readable;


function Rooms(){
    var rooms = {
        'Room1': {
            name: 'Room1',
            capacity: 50,
            numSockets: 0,
            sockets: []
        }
    };
    this.getRoomNames = function(){
        return Object.keys(rooms);
    }
    this.getRooms = function(){
        return rooms;
    }
    this.setRooms = function(rooms){
        rooms = rooms;
    }
    this.addRoom = function(roomName){
        if (!rooms[roomName]){
            rooms[roomName] = {
                name: roomName,
                capacity: 50,
                numSockets: 0,
                sockets: []
            }
        } else {
            throw 'Room already exists';
        }
    }
    this.removeRoom = function(roomName){
        if (room[roomName]){
            delete rooms[roomName];
        } else{
            throw 'Room does not exist';
        }
    }
    this.getRoom = function(roomName){
        return rooms[roomName];
    }
    this.addSocket = function(roomName, socket){
        console.log('Chosen roomNAme:', roomName)
        if (rooms[roomName]){
            rooms[roomName].sockets.push(socket);
        } else {
            this.addRoom(roomName);
            rooms[roomName].sockets.push(socket);
        }
    }
}


var rooms = new Rooms;
// var rooms = ['room 1', 'room 2'];
function sendRooms(socket){
    ss(socket).emit('rooms', null, rooms.getRoomNames());
}

function configureSocketForChat(socket, roomName){

    rooms.addSocket(roomName, socket);
    ss(socket).on('chat-to-server', function(chatStream){
        rooms.getRoom(roomName).sockets.forEach(function(sock){
            var senderToRoomStream = ss.createStream();
            ss(sock).emit('chat-to-client', senderToRoomStream);
            chatStream.pipe(senderToRoomStream);
        });
    });
}
var selectedRoom = '';
io.of('/chat').on('connection', function(socket) {

    // Send available rooms
    sendRooms(socket);
    ss(socket).on('room-chosen', function(nullStream, chosenRoom){
        configureSocketForChat(socket, chosenRoom);
    });

    // ss(socket).on('selectedRoom', function(selectedRoomStream){
    //     selectedRoomStream.on('data', function(chunk){
    //         var chosenRoom = chunk.toString().trim();
    //         configureSocketForChat(socket, chosenRoom);
    //         rooms.addSocket(chosenRoom, socket);
    //     });
    //     selectedRoomStream.on('end', function(){
    //         console.log('Stream ended');
    //         var tmp_stream = ss.createStream();
    //         ss(socket).emit('begin-chat', tmp_stream);
    //         var a = new Readable;
    //         a.push('apple');
    //         a.push(null);
    //         a.pipe(tmp_stream);
    //     });
    // });
    //
    // ss(socket).on('chat-to-server', function(chatStream){
    //     chatStream.pipe(process.stdout);
    // });

});
// var readRoomsStream = new Readable;
// rooms.forEach(function(room){
//     readRoomsStream.push(room);
// });
// readRoomsStream.push('string');
// readRoomsStream.push(null);
// readRoomsStream.pipe(process.stdout);
