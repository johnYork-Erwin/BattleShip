let questionBlock = $('#question');
let answersDiv = $('#answers');
let submitButton = $('#submit');
let results = JSON.parse(localStorage.getItem('results'));
let currentQuestion = '';

getQuestion();

function getQuestion () {
  let $xhr = $.getJSON('https://opentdb.com/api.php?amount=1&category=23&difficulty=medium&type=multiple');


  $xhr.done(function(data) {
    if ($xhr.status !== 200) {
      return;
    }
    let response = JSON.parse($xhr['responseText'])['results'][0];
    currentQuestion = response['question'];
    questionBlock.append($('<h4>').text(currentQuestion).addClass('center'));
    let answer = response['correct_answer'];
    results['triviaQuestions'][currentQuestion] = [answer, ''];
    let lies = response['incorrect_answers'];
    let answerLocation = Math.floor(Math.random()*4);
    for (let i = 0; i < 4; i++) {
      let answerNumber = 'test' + i;
      let clickable = $('<div>').addClass('col l6 offset-l3');
      let input = $('<input>').attr({
        'name' : 'group1',
        'type' : 'radio',
        'id' : answerNumber
      });
      let label = $('<label>').attr({
        'for' : answerNumber
      });
      if (i === answerLocation) {
        label.text(answer);
        input.addClass('right left');
      } else {
        let whereLie = Math.floor(Math.random()*lies.length);
        let whichLie = lies[whereLie];
        lies.splice(whereLie, 1);
        label.text(whichLie);
        input.addClass('wrong left');
      }
      clickable.append(input).append(label);
      answersDiv.append(clickable);
    }
    console.log(answer)
  });
}



$(submit).on('click', function() {
  let selection = $(':checked')[0]['classList'][0];

  if (selection === 'right') {
    results['triviaAnsweredRight']++;
    results['trivia'] = 'right';
    results['triviaQuestions'][currentQuestion][1] = 'right';
    Materialize.toast('You got it right! The bombs are sure to hit.', 2000);
  } else {
    results['triviaAnsweredWrong']++;
    results['trivia'] = 'wrong';
    results['triviaQuestions'][currentQuestion][1] = 'wrong';
    Materialize.toast('You got it wrong... The bombs are sure to miss.', 2000);
  }
  localStorage.setItem('results', JSON.stringify(results));
  setTimeout(function() {
    window.location.href = '../battleRoom/battleRoom.html';
  }, 2000);
});
