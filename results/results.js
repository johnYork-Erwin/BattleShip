let results = JSON.parse(localStorage.getItem('results'));

constructBanner();
constructResults();

function constructBanner() {
  if (results['result'] === 'win') {
    $('#title').append($('<h1>').text('Glorious Victory!').addClass('center'));
  } else {
    $('#title').append($('<h1>').text('Disappointing Defeat...').addClass('center'));
  }
}

function constructResults() {
  let percentage = 'N/A';
  if (results['triviaAnsweredRight'] !== 0 || results['triviaAnsweredWrong'] !== 0) {
    percentage = (results['triviaAnsweredRight']/(results['triviaAnsweredWrong']+results['triviaAnsweredRight'])*100) + '%';
  }
  console.log(percentage)
  let target = $('#summary');
  let desiredData = ['boatsLost', 'Boats Lost', 'boatsSunk', 'Boats Sunk', 'shotsFired', 'Shots Fired', 'shotsHit', 'Shots Hit', percentage, 'Trivia Percentage'];
  for (let i = 0; i < desiredData.length; i = i+2) {
    let row = $('<div>').addClass('row resultsRow');
    if ((i+2) % 4 === 0) {
      row.addClass('evenRow');
    }
    let left = $('<p>').text(desiredData[i+1]);
    let right = $('<p>').text(results[desiredData[i]]);
    let rightCol = $('<div>').addClass('col l4 right').append(right);
    let leftCol = $('<div>').addClass('col l6 left').append(left);
    row.append(leftCol).append(rightCol);
    target.append(row);
  }
}

$('#newGame').on('click', function() {
  localStorage.clear();
  window.location.href = '../setup/setup.html';
});
