var playerSea = JSON.parse(localStorage.getItem('playerSea'));
var computerSea = JSON.parse(localStorage.getItem('computerSea'));
var results = JSON.parse(localStorage.getItem('results'));
const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

$('#shootBanner').text('Fire your ' + (5-results['boatsLost']) + ' shots!');
constructFleet('player');
constructFleet('computer');
checkTriviaResults();

$('#quitGame').on('click', function() {
  localStorage.setItem('results', JSON.stringify(results));
  endGame('lose');
});
$('#endTurn').on('click', () => cleanShots($('#shots').val()));

//trivia handlers
$('#triviaCall').on('click', function() {
  setStorage();
  window.location.href = '../trivia/trivia.html';
});

function setStorage() {
  localStorage.setItem('playerSea', JSON.stringify(playerSea));
  localStorage.setItem('computerSea', JSON.stringify(computerSea));
  localStorage.setItem('results', JSON.stringify(results));
}

//functions on load
function checkTriviaResults() {
  if (results['trivia'] !== null) {
    for (let i = 0; i < 3; i++) {
      let shot = [Math.floor(Math.random()*10), Math.floor(Math.random()*10)];
      let target = computerSea[shot[0]][shot[1]];
      if (results['trivia'] === 'right') {
        while (target === 0 || target === null || target === 1) {
          shot = [Math.floor(Math.random()*10), Math.floor(Math.random()*10)];
          target = computerSea[shot[0]][shot[1]];
        }
        handleShots(shot, 'computer');
      } else {
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

function constructFleet (player) {
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
      if (sea[i][j] === null) {
        pixel[0].style.backgroundColor = 'red';
      } else if (sea[i][j] === 1) {
        pixel[0].style.backgroundColor = 'silver';
      } else {
        pixel[0].style.backgroundColor = 'white';
      }
      if (player === 'player') {
        if (typeof sea[i][j] === 'string') {
          pixel[0].style.backgroundColor = 'black';
          pixel[0].style.borderColor = 'white';
        }
      }
      row.append(pixel);
    }
    grid.append(row);
  }
}

function cleanShots(shots) {
  let array = shots.split(',');
  let usableArray = [];
  for (let i =0; i < array.length; i++) {
    let temp = array[i];
    let shot = array[i];
    shot = shot.trim();
    let column = shot[0];
    column = column.toUpperCase();
    column = alphabet.indexOf(column);
    let row = shot.slice(1);
    row = Number(row)-1;
    console.log(row);
    console.log(row > 9);
    console.log(typeof row);
    if (row > 9 || row < 0 || column === -1 || isNaN(row)) {
      Materialize.toast('Some or all of those coordinates are invalid, try again.', 3000);
      return;
    } else {
      usableArray.push([row, column]);
    }
  }
  let shotsAllowed = 5 - results['boatsLost'];
  if (array.length > shotsAllowed) {
    Materialize.toast('You only have ' + shotsAllowed + ' shots to take. Use only that many, each separated by a , .', 3000);
    return;
  }
  for (let i = 0; i < usableArray.length; i++) {
    results['shotsFired']++;
    handleShots(usableArray[i], 'computer');
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
    targetX.style.borderColor = 'black';
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
    targetX.style.backgroundColor = 'silver';
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
