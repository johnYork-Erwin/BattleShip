constructGrid();

let results = {'trivia':null, 'result': null, 'shotsFired': 0, 'shotsHit': 0, 'boatsSunk':0, 'boatsLost':0,
  'playerFleet':{'battleship':4, 'cruiser':3, 'carrier':5, 'destroyer':2, 'sub':3},
  'computerFleet':{'battleship':4, 'cruiser':3, 'carrier':5, 'destroyer':2, 'sub':3},
  'triviaAnsweredRight':0, 'triviaAnsweredWrong':0, 'triviaQuestions':{}, 'computerShotsTaken':[]
};

let carrying = false;
let boatInHand = null;
let boatInHandLength = 0;
let horizontal = true;

let battleship = $('#battleship');
let carrier = $('#carrier');
let cruiser = $('#cruiser');
let destroyer = $('#destroyer');
let sub = $('#sub');
let numberPlaced = 0;
let playerSea = constructSea();
let computerSea = constructSea();
computerPlace();

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
    localStorage.clear();
    localStorage.setItem('playerSea', JSON.stringify(playerSea));
    localStorage.setItem('computerSea', JSON.stringify(computerSea));
    localStorage.setItem('results', JSON.stringify(results));
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

function computerPlace() {
  let ships = {'carrier':5, 'battleship':4, 'sub':3, 'cruiser':3, 'destroyer':2};
  for (let key in ships) {
    let row = Math.floor(Math.random()*10);
    let column = Math.floor(Math.random()*10);
    let alignment = Math.round(Math.random());
    if (alignment === 1) {
      horizontal = !horizontal;
    }
    while (inspectPlacement([row,column], 'computer', ships[key]) === false) {
      row = Math.floor(Math.random()*10);
      column = Math.floor(Math.random()*10);
    }
    computerSeaPlace(row, column, key, ships[key]);
  }
}

function computerSeaPlace(row, column, ship, length) {
  for (let i = 0; i < length; i++) {
    computerSea[row][column] = ship;
    if (horizontal) {
      column++;
    } else {
      row++;
    }
  }
}

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
    let boxNumber = $('div').index(current);
    boxNumber = boxNumber - 16;
    let row = Math.floor(boxNumber/11);
    let column = boxNumber % 11 -1;
    if (inspectPlacement([row, column], 'player', boatInHandLength) === false) {
      return;
    }
    console.log(current);
    place([row, column]);
    dropPiece();
    numberPlaced++;
  }
}

function allowDrop(ev) {
    ev.preventDefault();
    console.log(ev.path[0] + 'allow drop')
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log('dropping')
    console.log(data)
    console.log(ev.path[0])
    let string = '#' + data
    let boat = $(string)
    $(ev.path[0]).append(boat)
}

function inspectPlacement (coordinates, player, length) {
  let fleet;
  if (player === 'player') {
    fleet = playerSea;
  } else {
    fleet = computerSea;
  }
  let row = coordinates[0];
  let column = coordinates[1];
  //checking if it goes off the edges
  if ((horizontal && (column + length > 10)) || (!horizontal && row + length > 10)) {
    if (player === 'player') {
      Materialize.toast('That would go off the grid! Try again.', 3000);
    }
    return false;
  }
  //checks if it will overlap w/ anything
  for (let i = 0; i < length; i++) {
    if (fleet[row][column] !== 0) {
      if (player === 'player') {
        Materialize.toast('That would land on top of another ship! Try again.', 3000);
      }
      return false;
    }
    if (horizontal) {
      column++;
    } else {
      // if vertical alignemnt
      row++;
    }
  }
}

function place(coordinates) {
  let row = coordinates[0];
  let column = coordinates[1];
  for (let i = 0; i < boatInHandLength; i++) {
    let startPixel = $($('#grid').children()[row]).children()[column];
    startPixel.style.backgroundColor = 'black';
    startPixel.style.borderColor = 'white';
    playerSea[row][column] = boatInHand;
    if (horizontal) {
      column++;
    } else {
      // if vertical alignemnt
      row++;
    }
  }
}

function dropPiece() {
  let shipTitle = '#' + boatInHand;
  let ship = $(shipTitle);
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
      row.append($('<div>').addClass('pixel').css('background-color', 'white'));
    }
    grid.append(row);
  }
}
