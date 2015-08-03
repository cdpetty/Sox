var blessed = require('blessed');

// Create a screen object.
var screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    // fastCSR: true,
    cursor: {
        artificial: true,
        blink: true,
        shape: 'line',
        color: null
    },
    // dockBorders: true,
    debug: true,
});
screen.title = 'Sox';

// Create a box perfectly centered horizontally and vertically.
var box = blessed.list({
    selectedBg: 'green',
    top: 'left',
    left: 'top',
    width: '20%',
    height: '100%',
    // content: 'Room 1\nRoom 2\nRoom 3\n',
    tags: true,
    border: {
        type: 'line'
    },
    keys: true,
    vi: true
});
box.setItems([
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten'
]);

// Allow scrolling with the mousewheel (manually).
box.on('wheeldown', function() {
  list.up();
});

box.on('wheelup', function() {
  list.down();
});

// Select the first item.
box.select(0);

// Append our box to the screen.
screen.append(box);

// Create a box perfectly centered horizontally and vertically.
var box2 = blessed.text({
    // align:'right',
    left: '20%',
    width: '80%',
    height: '93%',
    content: 'asdf 1\nRsdfoom 2\nasdf 3\n',
    // tags: true,
    border: {
        type: 'line'
    },
    scrollable: true,
    mouse: true,
    scrollbar: {
        bg: 'blue'
    }
});

var box3 = blessed.textarea({
    top: '93%',
    left: '20%',
    width: '80%',
    height: '7%',
    content: 'asdf 1\nRsdfoom 2\nasdf 3\nlkajsdflkjasdlfkja',

    // tags: true,
    inputOnFocus: true,
    border: {
        type: 'line',
        // bg: 'red'
    }
});

// Append our box to the screen.
screen.append(box3);
// If box is focused, handle `enter`/`return` and give us some more content.
box.key('enter', function(ch, key) {
    box.setContent('{right}Even different {black-fg}content{/black-fg}.{/right}\n');
    box.setLine(1, 'bar');
    box.insertLine(1, 'foo');
    screen.render();
});

// });
box3.key(['enter'], function(){
    // box2.pushLine("" + box2.getScrollPerc());//ubox3.getValue());
    box2.pushLine(box3.getValue());
    box3.setScrollPerc(100);
    box3.clearValue();
    box2.setScrollPerc(100);
    // box2.setText('apple');
});
// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

// Focus our element.
box3.focus();

// Render the screen.
screen.render();
