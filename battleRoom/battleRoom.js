var playerSea = JSON.parse(localStorage.getItem('playerSea'));
var computerSea = JSON.parse(localStorage.getItem('playerSea'));
constructFleet('yourFleet');
constructFleet('enemyFleet');
var playerFleet = {'battleship':4, 'cruiser':3, 'carrier':5, 'destroyer':2, 'sub':3};
var computerFleet = {'battleship':4, 'cruiser':3, 'carrier':5, 'destroyer':2, 'sub':3};
var shipsRemaining = {'player':5, 'computer':5};
const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
var shotsFired = 0;
var shotsHit = 0;



$('#endTurn').on('click', () => cleanShots($('#shots').val()));


function cleanShots(shots) {
  shotsFired++;
  console.log('firing on ' + shots);
  shots = shots.trim();
  let column = shots[0];
  column = column.toUpperCase();
  column = alphabet.indexOf(column);
  let row = shots.slice(1);
  row = Number(row)-1;
  handleShots([row, column], 'computer');
}

function handleShots(coordinates, target) {
  var grid;
  var fleet;
  var map;
  if (target === 'computer') {
    grid = computerSea;
    fleet = computerFleet;
    map = $('#enemyFleet');
  } else {
    grid = playerSea;
    fleet = playerFleet;
    map = $('#yourFleet');
  }
  let row = coordinates[0];
  let column = coordinates[1];
  let boatType = grid[row][column];
  let targetX = map.children()[row];
  targetX = $(targetX).children()[column];
  if (boatType !== 0 && boatType !== null) {
    if (target === 'computer') {
      Materialize.toast('You scored a hit!', 2000);
      shotsHit++;
    } else {
      Materialize.toast('They scored a hit on your' + boatType + '!', 2000);
    }
    fleet[boatType]--;
    grid[row][column] === null;
    targetX.style.backgroundColor = 'red';
    if (fleet[boatType] === 0) {
      if (target === 'computer') {
        shipsRemaining['computer']--;
        if (shipsRemaining['computer'] === 0) {
          endGame('win');
        }
        Materialize.toast('You sank their ' + boatType + '!', 4000);
      } else {
        shipsRemaining['player']--;
        if (shipsRemaining['player'] === 0) {
          endGame('lose');
        }
        Materialize.toast('They sank your ' + boatType + '!', 4000);
      }
    }
  } else {
    targetX.style.backgroundColor = 'grey';
  }
}

function endGame(result) {
  let results = {};
  results['result'] = result;
  results['shotsFired'] = shotsFired;
  results['shotsHit'] = shotsHit;
  results['boatsSunk'] = 5-shipsRemaining['computer'];
  results['boatsLost'] = 5-shipsRemaining['player'];
  localStorage.setItem('results', JSON.stringify(results));
  window.location.href = '../results/results.html';
}

function constructFleet (player) {
  //constructs rows
  player = '#' + player;
  let grid = $(player);
  for (let i = 0; i < 10; i++) {
    let row = $('<div>').addClass('gridRow');
    for (let j =0; j < 10; j++) {
      let pixel = $('<div>').addClass('pixel');
      //Set background color depending on fleet config for player
      if (player === '#yourFleet') {
        if (playerSea[i][j] !== 0) {
          pixel[0].style.backgroundColor = 'black';
          pixel[0].style.borderColor = 'white';
        }
      }
      row.append(pixel);
    }
    grid.append(row);
  }
}
