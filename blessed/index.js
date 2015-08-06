var blessed = require('blessed'),
    widgets = require('./widgets.js'),
    events = require('events'),
    ss = require('socket.io-stream')
    Readable = require('stream').Readable;



function chat(username, socket, room){
    this.username = username || 'New User';
    this.socket = socket;
    this.activeRoom = room || null;
    this.availableRooms = null;
    this.stream = null;
    this.prototype = new events.EventEmitter;

    function init() {
       configureSocketForChat(socket);
    }
    init();

    /**** Chat methods ****/
    // Configure the socket event listeners
    function configureSocketForChat(socket){
        // Configure chat listeners
        ss(socket).on('chat-to-client', function(chatStream, user){
            this.setStream(chatStream);
            this.emit('chat-recieved', user);
        });

        ss(socket).on('update-rooms', function(nullStream, rooms){
            this.setStream(null);
            this.emit('rooms-received', rooms);
        });
    }
    // Emit a chat sent by the client
    this.emitChat = function(eventName, chat){
        //Socket.emit chat
        var chatStream = ss.createStream();
        ss(socket).emit('chat-to-server', chatStream, this.getUsername());
        var chatToStream = new Readable;
        chatToStream.push(chat);
        chatToStream.push(null);
        chatToStream.pipe(chatStream);
    }

    this.emitFile = function(fileName){

    }

    this.emitImage = function(imageName){

    }
    /**** Getters/Setters ****/
    this.setUsername = function(username){
        this.username = username;
    }
    this.getUsername = function(){
        return this.username;
    }
    this.getSocket = function(){
        return this.socket;
    }
    this.setSocket = function(socket){
        this.socket = socket;
    }
    this.setRoom = function(room){
        this.room = room;
    }
    this.getRoom = function(){
       return this.room;
    }
    this.setStream = function(stream){
        this.stream = stream;
    }
    this.getStream = function(stream){
        return this.stream;
    }
}

var socket = io.connect('http://127.0.0.1:3000/chat');
var chat = new chat('Username 1', socket, 'Room 1');
ss(socket).on()
ss(socket).emit('')


    widgets.rl.setItems(['Room 1', 'Room 2', 'Room 3', 'Room 4']);
    widgets.inputText.focus();
    widgets.screen.render();


function configureEventListeners(widgets){

    widgets.inputText.on('submit', function(data) {
        if (data && data.length !== 0) {
            widgets.chatLog.pushLine(data);
            widgets.chatLog.setScrollPerc(100);
            widgets.inputText.clearInput();
            // widgets.chatLog.focus();
            widgets.inputText.focus();
            widgets.screen.render();
        }
    });

    // widgets.inputText.on('cancel', function(){
    //     widgets.screen.render();
    // })

    widgets.screen.key(['C-c'], function(ch, key) {
        process.exit(0);
    });
    widgets.screen.key(['tab'], function(ch, key) {
        return widgets.screen.focusNext();
    });
    widgets.screen.key(['S-tab'], function(ch, key) {
        return widgets.screen.focusPrevious();
    });
}
