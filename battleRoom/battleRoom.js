var playerSea = JSON.parse(localStorage.getItem('playerSea'));
var computerSea = JSON.parse(localStorage.getItem('computerSea'));
var results = JSON.parse(localStorage.getItem('results'));

constructFleet('player');
constructFleet('computer');
checkTriviaResults();

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];


$('#quitGame').on('click', function() {
  localStorage.setItem('results', JSON.stringify(results));
  window.location.href = '../results/results.html';
});
$('#endTurn').on('click', () => cleanShots($('#shots').val()));
$('#triviaCall').on('click', function() {
  setStorage();
  window.location.href = '../trivia/trivia.html';
});

function checkTriviaResults() {
  let trivia = results['trivia'];
  if (trivia !== null) {
    for (let i = 0; i < 3; i++) {
      let shot = [Math.floor(Math.random()*10), Math.floor(Math.random()*10)];
      if (trivia === 'right') {
      //score 3 hits
        while (computerSea[shot[0]][shot[1]] === 0 || computerSea[shot[0]][shot[1]] === null) {
          shot = [Math.floor(Math.random()*10), Math.floor(Math.random()*10)];
        }
        handleShots(shot, 'computer');
      } else {
      //score 3 misses
        while (computerSea[shot[0]][shot[1]] !== 0) {
          shot = [Math.floor(Math.random()*10), Math.floor(Math.random()*10)];
        }
        handleShots(shot, 'computer');
      }
    }
    results['trivia'] = null;
  }
}

function setStorage() {
  localStorage.setItem('playerSea', JSON.stringify(playerSea));
  localStorage.setItem('computerSea', JSON.stringify(computerSea));
  localStorage.setItem('results', JSON.stringify(results));
}

function cleanShots(shots) {
  results['shotsFired']++;
  shots = shots.trim();
  let column = shots[0];
  column = column.toUpperCase();
  column = alphabet.indexOf(column);
  let row = shots.slice(1);
  row = Number(row)-1;
  handleShots([row, column], 'computer');
  setTimeout(fireBack, 2000);
}

function fireBack() {
  let row = Math.floor(Math.random()*10);
  let column = Math.floor(Math.random()*10);
  handleShots([row, column], 'player');
}


function handleShots(coordinates, target) {
  var grid;
  var fleet;
  var map;
  if (target === 'computer') {
    grid = computerSea;
    fleet = 'computerFleet';
    map = $('#enemyFleet');
  } else {
    grid = playerSea;
    fleet = 'playerFleet';
    map = $('#yourFleet');
  }
  let row = coordinates[0];
  let column = coordinates[1];
  let boatType = grid[row][column];
  let targetX = map.children()[row];
  targetX = $(targetX).children()[column];
  if (typeof boatType === 'string') {
    if (target === 'computer') {
      Materialize.toast('You scored a hit!', 2000);
      results['shotsHit']++;
      computerSea[row][column] = null;
    } else {
      Materialize.toast('They scored a hit on your' + boatType + '!', 2000);
      playerSea[row][column] = null;
    }
    results[fleet][boatType]--;
    targetX.style.backgroundColor = 'red';
    if (results[fleet][boatType] === 0) {
      if (target === 'computer') {
        results['boatsSunk']++;
        Materialize.toast('You sank their ' + boatType + '!', 4000);
        if (results['boatsSunk'] === 5) {
          Materialize.toast('You won the game!', 3000);
          setTimeout(endGame('win'), 3000);
        }
      } else {
        results['boatsLost']++;
        Materialize.toast('They sank your ' + boatType + '!', 4000);
        if (results['boatsLost'] === 5) {
          Materialize.toast('You lost the game...', 4000);
          setTimeout(endGame('lose'), 3000);
        }
      }
    }
  } else if (boatType === 0) {
    targetX.style.backgroundColor = 'grey';
    if (target === 'computer') {
      computerSea[row][column] = 1;
    } else {
      playerSea[row][column] = 1;
    }
  }
}

function endGame(result) {
  results['result'] = result;
  localStorage.setItem('results', JSON.stringify(results));
  window.location.href = '../results/results.html';
}

function constructFleet (player) {
  //constructs rows
  let grid;
  let sea;
  if (player === 'player') {
    grid = $('#yourFleet')
    sea = playerSea;
  } else {
    grid = $('#enemyFleet');
    sea = computerSea;
  }
  for (let i = 0; i < 10; i++) {
    let row = $('<div>').addClass('gridRow');
    for (let j =0; j < 10; j++) {
      let pixel = $('<div>').addClass('pixel');
      //Set background color depending on fleet config for player
      if (player === 'player') {
        if (typeof sea[i][j] === 'string') {
          pixel[0].style.backgroundColor = 'black';
          pixel[0].style.borderColor = 'white';
        }
      }
      if (sea[i][j] === null) {
        pixel[0].style.backgroundColor = 'red';
      } else if (sea[i][j] === 1) {
        pixel[0].style.backgroundColor = 'grey';
      }
      row.append(pixel);
    }
    grid.append(row);
  }
}
