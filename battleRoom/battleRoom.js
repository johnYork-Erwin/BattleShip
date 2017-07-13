var playerSea = JSON.parse(localStorage.getItem('playerSea'));
var computerSea = JSON.parse(localStorage.getItem('computerSea'));
var results = JSON.parse(localStorage.getItem('results'));

$('#shootBanner').text('Fire your ' + (5-results['boatsLost']) + ' shots!');
constructFleet('player');
constructFleet('computer');
checkTriviaResults();

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];


$('#quitGame').on('click', function() {
  localStorage.setItem('results', JSON.stringify(results));
  endGame('lose');
});
$('#endTurn').on('click', () => cleanShots($('#shots').val()));
$('#triviaCall').on('click', function() {
  setStorage();
  window.location.href = '../trivia/trivia.html';
});


function checkTriviaResults() {
  if (results['trivia'] !== null) {
    for (let i = 0; i < 3; i++) {
      let shot = [Math.floor(Math.random()*10), Math.floor(Math.random()*10)];
      let target = computerSea[shot[0]][shot[1]];
      if (results['trivia'] === 'right') {
      //score 3 hits
        while (target === 0 || target === null || target === 1) {
          shot = [Math.floor(Math.random()*10), Math.floor(Math.random()*10)];
          target = computerSea[shot[0]][shot[1]];
        }
        handleShots(shot, 'computer');
      } else {
      //score 3 misses
        while (target !== 0) {
          shot = [Math.floor(Math.random()*10), Math.floor(Math.random()*10)];
          target = computerSea[shot[0]][shot[1]];
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
  let array = shots.split(',');
  let shotsAllowed = 5 - results['boatsLost'];
  if (array.length !== shotsAllowed) {
    Materialize.toast('You have a total of ' + shotsAllowed + ' shots to take. Use them all, each separated by a , .', 3000);
    return;
  }
  for (let i = 0; i < shotsAllowed; i++) {
    results['shotsFired']++;
    let shot = array[i];
    shot = shot.trim();
    let column = shot[0];
    column = column.toUpperCase();
    column = alphabet.indexOf(column);
    let row = shot.slice(1);
    row = Number(row)-1;
    handleShots([row, column], 'computer');
  }
  //switches shotsAllowed to be the number the computer's currently allowed to take.
  shotsAllowed = 5 - results['boatsSunk'];
  for (let i = 0; i < shotsAllowed; i++) {
    setTimeout(fireBack, 2000);
  }
}

function fireBack() {
  let alreadyShot = true;
  let row;
  let column;
  let checkAgainst = results['computerShotsTaken'];
  while (alreadyShot) {
    row = Math.floor(Math.random()*10);
    column = Math.floor(Math.random()*10);
    alreadyShot = false;
    for (let i = 0; i < checkAgainst.length; i++) {
      if (row === checkAgainst[i][0] && column === checkAgainst[i][1]) {
        alreadyShot = true;
      }
    }
  }
  results['computerShotsTaken'].push([row, column]);
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
      Materialize.toast('They scored a hit on your ' + boatType + '!', 2000);
      playerSea[row][column] = null;
    }
    results[fleet][boatType]--;
    targetX.style.backgroundColor = 'red';
    if (results[fleet][boatType] === 0) {
      if (target === 'computer') {
        results['boatsSunk']++;
        Materialize.toast('You sank their ' + boatType + '! They now have only ' + (5-results['boatsSunk']) + ' shots per round.', 4000);
        if (results['boatsSunk'] === 5) {
          Materialize.toast('You won the game!', 3000);
          endGame('win');
        }
      } else {
        results['boatsLost']++;
        Materialize.toast('They sank your ' + boatType + '! You now have only ' + (5-results['boatsLost']) + ' shots per round.', 4000);
        $('#shootBanner').text('Fire your ' + (5-results['boatsLost']) + ' shots!');
        if (results['boatsLost'] === 5) {
          Materialize.toast('You lost the game...', 4000);
          endGame('lose');
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
  setTimeout(moveScreen, 1000);
}

function moveScreen() {
  window.location.href = '../results/results.html'
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
