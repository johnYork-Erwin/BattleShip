constructGrid();

let playerSea = constructSea();
let computerSea = constructSea();

let carrying = true;
let boatInHand = 'carrier';
let boatInHandLength = 5;
let horizontal = false;

let battleship = $('#battleship');
let carrier = $('#carrier');
let cruiser = $('#cruiser');
let destroyer = $('#destroyer');
let sub = $('#sub');
let numberPlaced = 0;

$('#grid').on('click', placePiece);
$(window).keypress(function (e) {
  if (e.keyCode === 0 || e.keyCode === 32) {
    e.preventDefault();
    horizontal = !horizontal;
    let direction;
    if (horizontal) {
      direction = 'horizontally';
    } else {
      direction = 'vertically';
    }
    Materialize.toast('You are now placing ' + direction + '!', 4000);
  }
});
$('#setState').on('click', function() {
  if (numberPlaced === 5) {
    localStorage.setItem('playerSea', JSON.stringify(playerSea));
    localStorage.setItem('computerSea', JSON.stringify(computerSea));
    window.location.href = '../battleRoom/battleRoom.html';
  } else {
    Materialize.toast('Finish placing your ships first!', 4000);
  }
});

carrier.on('click', () => pickUpPiece(5, 'carrier'));
battleship.on('click', () => pickUpPiece(4, 'battleship'));
sub.on('click', () => pickUpPiece(3, 'sub'));
cruiser.on('click', () => pickUpPiece(3, 'cruiser'));
destroyer.on('click', () => pickUpPiece(2, 'destroyer'));

function constructSea() {
  let retVal = [];
  for (let i = 0; i < 10; i++) {
    let row = [];
    for (let j = 0; j < 10; j++) {
      row.push(0);
    }
    retVal.push(row);
  }
  return retVal;
}

function pickUpPiece(length, boat) {
  carrying = true;
  boatInHandLength = length;
  boatInHand = boat;
}

function placePiece(event) {
  if (carrying && $(event.target).hasClass('pixel') && !$(event.target).hasClass('label')) {
    //place piece here
    let current = event.target;
    //false means it didn't pass the test, invalid is falsey ;)
    if (inspectPlacement(current) === false) {
      return;
    }
    numberPlaced++;
    place(current);
    dropPiece();
  }
}

function inspectPlacement (startPixel) {
  let boxNumber = $('div').index(startPixel);
  //checking if it goes off the edges
  if (
    (horizontal && (((boxNumber % 11) < 5) && (boatInHandLength + (boxNumber % 11)) > 4)) ||
    (!horizontal && (Math.floor(boxNumber/11) + boatInHandLength > 11))
  ){
    return false;
  }
  //checks if it will overlap w/ anything
  for (let i = 0; i < boatInHandLength; i++) {
    boxNumber = $('div').index(startPixel);
    let row = Math.floor(boxNumber/11);
    let column = (boxNumber - 16) % 11;
    if (playerSea[row-1][column] !== 0) {
      return false;
    }
    if (horizontal) {
      startPixel = $(startPixel).next()[0];
    } else {
      // if vertical alignemnt
      let nextRow = $($(startPixel).parent()).next();
      startPixel = nextRow.children()[column];
    }
  }
}

function place(startPixel) {
  for (let i = 0; i < boatInHandLength; i++) {
    let location = $('div').index(startPixel);
    let row = Math.floor(location/11)-1;
    let column = (location - 16) % 11;
    startPixel.style.backgroundColor = 'black';
    startPixel.style.borderColor = 'white';
    playerSea[row-1][column] = boatInHand;
    if (horizontal) {
      startPixel = $(startPixel).next()[0];
    } else {
      // if vertical alignemnt
      let row = $($(startPixel).parent()).next();
      startPixel = row.children()[column];
    }
  }
}

function dropPiece() {
  let shipTitle = '#' + boatInHand;
  let ship = $(shipTitle);
  let shipShape = ship.next();
  shipShape.remove();
  ship.remove();
  carrying = false;
  boatInHandLength = null;
  boatInHand = null;
}

function constructGrid() {
  let grid = $('#grid');
  for (let i = 0; i < 10; i++) {
    let row = $('<div>').addClass('gridRow');
    for (let j = 0; j <10; j++) {
      row.append($('<div>').addClass('pixel'));
    }
    grid.append(row);
  }
}
