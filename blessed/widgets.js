var blessed = require('blessed');

var screen = blessed.screen({
  title:"5lack",
  autoPadding: true,
  smartCSR: true,
  tabSize: 2,
  dockBorders: true,
  resizeTimeout: 30,
  debug: true
});

// container for all stuffs
var mainContainerBox = blessed.box({
  parent: screen,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
  style: {
    bg: '#2d2d2d'
  }
});

// container for users, channels, groups
var infoContainerBox = blessed.box({
  parent: mainContainerBox,
  top: 1,
  left: 0,
  bottom: 2,
  width: '16%', // hmm. 16%? it looks right.
  height: 'shrink',
  style: {
    // bg: '#2d2d2d'
    bg: 'red'
  }
});

// container for chat history
var chatContainerBox = blessed.box({
  parent: mainContainerBox,
  top: 1,
  right: 0,
  bottom: 2,
  width: '85%',
  height: 'shrink', // 'shrink' is the right one.
  style: {
    // bg: '#2d2d2d'
    bg: 'green'
  }
});



// header text
var headerText = blessed.text({
  parent: mainContainerBox,
  top: 0,
  left: 0,
  right: 0,
  width: '100%',
  height: 1,
  content: "",
  style: {
    // bg: '#515151',
    bg: 'blue',
    fg: '#cccccc'
  }
});

// footer text
var footerText = blessed.text({
  parent: mainContainerBox,
  left: 0,
  bottom: 1,
  right: 0,
  height: 1,
  width: '100%',
  content: '',
  style: {
    // bg: '#515151',
    bg: 'yellow',
    fg: '#cccccc'
  }
});
//
// input
var inputTextBox = blessed.textbox({
  parent: mainContainerBox,
  tags: true, // @TODO -25: markdown support
  left: 0,
  bottom: 0,
  height: 1, // @TODO 5: \n support (and text snippets?)
  width: '100%',
  mouse: true,
  keys: true,
  style: { // @TODO: focus
    // bg: '#2d2d2d'
    bg: 'blue'
  }
});

inputTextBox.on('focus', function() {
    inputTextBox.readInput();
});

// chat log. well, why not to use a list? cuz list doesn't support multi-line items.
var chatLogBox = blessed.box({
  parent: chatContainerBox,
  tags: true,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
  style: {
    // bg: '#2d2d2d',
    bg: 'gray',
    selected: {
      bg: 'lightblack'
    }
  },
  mouse: true,
  keys: true,
  scrollable: true,
  scrollbar: {
    bg: 'white'
  }
});


var roomsList = blessed.list({
  parent: infoContainerBox,
  tags: true,
  top: 0,
  left: 0,
  right: 2,
  width: 'shrink',
  height: '40%',
  style: {
    // bg: '#2d2d2d',
    bg: 'blue',
    selected: {
      bg: '#424242',
      fg: '#cccccc'
    }
  },
  mouse: true,
  keys: true,
  scrollable: true
});

// //
// // users
// var usersList = blessed.list({
//   parent: infoContainerBox,
//   tags: true,
//   top: '40%',
//   left: 1,
//   right: 0,
//   width: 'shrink',
//   height: '32%',
//   style: {
//     // bg: '#2d2d2d',
//     bg: 'black',
//     selected: {
//       bg: '#424242',
//       fg: '#cccccc'
//     }
//   },
//   mouse: true,
//   keys: true,
//   scrollable: true
// });
//
// // groups
// var groupsList = blessed.list({
//   parent: infoContainerBox,
//   tags: true,
//   top: '72%',
//   bottom: 0,
//   left: 1,
//   right: 0,
//   width: 'shrink',
//   height: 'shrink',
//   style: {
//     // bg: '#2d2d2d',
//     bg: 'gray',
//     selected: {
//       bg: '#424242',
//       fg: '#cccccc'
//     }
//   },
//   mouse: true,
//   keys: true,
//   scrollable: true
// });
var chatLogMethods = {
    focus: function() {
        chatLogBox.focus();
        screen.render();
    },
    insertLine: function(i, lines) {
        chatLogBox.insertLine(i, lines);
        screen.render();
    },
    deleteLine: function(i) {
        chatLogBox.deleteLine(i);
        screen.render();
    },
    getLine: function(i) {
        return chatLogBox.getLine(i);
    },
    getBaseLine: function(i) { // visible top
        return chatLogBox.getBaseLine(i);
    },
    setLine: function(i, line) {
        chatLogBox.setLine(i, line);
        screen.render();
    },
    setBaseLine: function(i, line) { // visible top
        chatLogBox.setBaseLine(i, line);
        screen.render();
    },
    clearLine: function(i) {
        chatLogBox.clearLine(i);
        screen.render();
    },
    clearBaseLine: function(i) { // visible top
        chatLogBox.clearBaseLine(i);
        screen.render();
    },
    unshiftLine: function(lines) {
        chatLogBox.unshiftLine(lines);
        screen.render();
    },
    shiftLine: function(i) {
        chatLogBox.shiftLine(i);
        screen.render();
    },
    pushLine: function(lines) {
        chatLogBox.pushLine(lines);
        screen.render();
    },
    popLine: function(i) {
        chatLogBox.popLine(i);
        screen.render();
    },
    getLines: function() {
        return chatLogBox.getLines();
    },
    getScreenLines: function() {
        return chatLogBox.getScreenLines();
    },
    setScrollPerc: function(n) {
        chatLogBox.setScrollPerc(n); // arg type: number
        screen.render();
    },
    clearAll: function() {
        chatLogBox.setContent('');
        screen.render();
    }
};


function genListMethods(target) {
    return {
        focus: function() {
            target.focus();
            screen.render();
        },
        addItem: function(text) {
            target.addItem(text);
            screen.render();
        },
        getItemIndex: function(child) {
            return target.getItemIndex(child);
        },
        getItem: function(child) {
            return target.getItem(child);
        },
        removeItem: function(child) {
            target.removeItem(child);
            screen.render();
        },
        clearItems: function() {
            target.clearItems();
            screen.render();
        },
        setItems: function(array) {
            target.setItems(array);
            screen.render();
        },
        select: function(i) {
            target.select(i);
            screen.render();
        }
    };
}

module.exports = {
    screen: screen,
    headerText: headerText,
    footerText: footerText,
    inputText: inputTextBox,
    chatLog: chatLogBox,
    roomsList: roomsList,
    rl: genListMethods(roomsList),
    cl: chatLogMethods
};
