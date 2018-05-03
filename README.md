## title

This is Trivia Battleship where you can play battleship against a computer opponent with limited artificial
intelligence. It uses the "SALVO" variation where you get one shot per remaining ship in your fleet.
Also you can practice your general trivia knowledge of military history and when you get questions
right you get in game rewards like scoring hits against the opponents' fleet.

## Trivia

To obtain random trivia questions to post I am using a free trivia API called "Open Trivia Database". It is completely
free and allows you to choose a few options in your search like question and topic type. I chose military to try to
stay within a theme.

## Technologies

This site spans a few different pages each built with the Materialize framework and added to with only a little extra
CSS code. It is written in HTML and what JavaScript is run accesses the HTML using jQuery. To call on the API I used AJAX
and (because the user travels between four different pages for each game played) I extensively making use of
localStorage to set and retrieve data about the game state.

## Greatest Difficulty

My greatest difficulty had to do with how to store the data of each players ships. Someone suggested that each sea could
be an array of arrays where each array represented one row of the sea and the element of the array represented the column in
that row. Once that was in place it became much easier to standardize the users shots as pairs of rows and columns and simply check the sea at those coordinates to decide if it was a hit or a miss. Similarly, retrieving that element from the DOM in
order to display the hit/miss to the user was also easier. It was an important lesson for me in that it showed me the value
of thinking through your project before beginning. When I made the switch to this data it involved rewriting much of my code.
After rewriting, it was much more semantic. Next time I'll think through how I want to do things better before beginning as it limits the amount of housecleaning work after the fact.

## Improve

Something I would like to improve is to make the setup page more intuitive. Rather than having it be 'click here then there' to place a piece I would like it to be drag and drop. Or at least change the cursor to reflect what ship is currently being carried. Another aspect I would like to improve is to add sounds that play when a hit or a sink is scored. I think that would help bring it to life a bit. Finally, I would like to improve the AI implemented by the computer. That is a never ending project and interests me greatly.
