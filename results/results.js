$(document).ready(function() {
  $('.modal-trigger').leanModal();
})

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
    percentage = (results['triviaAnsweredRight']/(results['triviaAnsweredWrong']+results['triviaAnsweredRight'])*100).toFixed(2) + '%';
  }
  let target = $('#summary');
  results['percentage'] = percentage;
  let desiredData = ['boatsLost', 'Boats Lost', 'boatsSunk', 'Boats Sunk', 'shotsFired', 'Shots Fired', 'shotsHit', 'Shots Hit', 'percentage', 'Trivia Percentage'];
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
  target.append($('<div>').addClass('divider'));
  if (results['triviaQuestions'].length !== 0) {
    $('#triviaButtons').append($('<h4>').text('Review your trivia questions!'));
  }
  let i = 0;
  for (let key in results['triviaQuestions']) {
    i++;
    let button = $('<a>').addClass('waves-effect waves-light btn modal-trigger').attr('href', '#modal' + i).text('Question ' + i);
    let modal = $('<div>').attr('id', 'modal' + i).addClass('modal');
    let modalContent = $('<div>').addClass('modal-content').append($('<h4>').text('Question ' + i));
    modalContent.append($('<h6>').text(key)).append($('<h6>').text('Answer: ' + results['triviaQuestions'][key][0])).append($('<p>').text('You got this one ' + results['triviaQuestions'][key][1] + '!'));
    modal.append(modalContent);
    let modalFooter = $('<div>').addClass('modal-footer').attr('href', '#!').addClass('modal-action modal-close waves-effect waves-green btn-flat').text('Back to Results');
    modal.append(modalFooter);
    $('#triviaButtons').append(button).append(modal);
  }
}

$('#newGame').on('click', function() {
  localStorage.clear();
  window.location.href = '../setup/setup.html';
});
