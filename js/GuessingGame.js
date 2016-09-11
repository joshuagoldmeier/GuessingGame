function generateWinningNumber(){
	return Math.ceil(Math.random()*100);
}

function shuffle(array) {
  var cardstoShuffle = array.length, t, i;

  // While there remain elements to shuffle…
  while (cardstoShuffle) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * cardstoShuffle--);

    // And swap it with the current element.
    t = array[cardstoShuffle];
    array[cardstoShuffle] = array[i];
    array[i] = t;
  }


  return array;
}

function Game(){
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
	this.alreadyGotHint = false;

}

Game.prototype.difference = function() {
	return Math.abs(this.winningNumber-this.playersGuess);
};

Game.prototype.isLower = function() {
	return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function(num) {
	if (typeof num !== 'number' || num > 100 || num < 1){
		throw "That is an invalid guess.";
	}
	this.playersGuess = num;
	return this.checkGuess();
};

Game.prototype.checkGuess = function() {
	if (this.winningNumber === this. playersGuess){
		$("#title").html("You Win!");
		$("#subtitle").html("Click Reset to Play Again!");
		return "You Win!";
	} 
	else if(this.pastGuesses.includes(this.playersGuess)){
		$("#title").html("Please Guess Again!");
		return "You have already guessed that number.";

	}else {
		this.pastGuesses.push(this.playersGuess);
		$('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
		if(this.pastGuesses.length === 5) {
				$("#title").html("You Lose.");
				$('#subtitle').text("Press the Reset button to play again!")
				return 'You Lose.';
		}
	}
	if (this.difference() < 10){
		return "You're burning up!"
	}
	else if(this.difference() < 25){
		return "You're lukewarm."
	}
	else if(this.difference() < 50){
		return "You're a bit chilly."
	}
	else {
		return "You're ice cold!"
	}

	
};

Game.prototype.provideHint = function() {
	hintArray = [];
	if (!this.alreadyGotHint){
		fakeNumber1 = generateWinningNumber();
		fakeNumber2 = generateWinningNumber();
		this.alreadyGotHint = true;
	}
	hintArray.push(this.winningNumber);
	hintArray.push(fakeNumber1);
	hintArray.push(fakeNumber2);
	hintArray = shuffle(hintArray);
	return hintArray;
	
};

function newGame(){
	return new Game();
}

$(document).ready(function() {

	theGame = new Game();

	function enterOrClick(game){
		var playerInput =  $('#player-input').val();
    	$('#player-input').val('');
    	guessResponse = game.playersGuessSubmission(parseInt(playerInput));
			$("#title").html(guessResponse);
			if (guessResponse === "You Win!" || guessResponse === "You Lose."){
				$('#hint, #submit').prop("disabled",true);
			}
	}


    $('#submit').click(function(e) {
  		enterOrClick(theGame);
    })

    $('#player-input').keydown(function(e){
	    if (e.keyCode == 13) {
	    	enterOrClick(theGame);
	    }
	});

	$('#reset').click(function(e) {
  		theGame = new Game();
  		$("#title").html("Guessing Game!");
  		$("#subtitle").html("Guess a number between 1-100!");
  		$('#hint, #submit').prop("disabled",false);
  		for (var i = 1; i <= 5; i++) {
  			$('#guess-list li:nth-child('+ i +')').text('-');
  		}
    })

    $('#hint').click(function(e) {
  		theNumber = theGame.provideHint().join(", ");
  		str = "The winning number is one of these: "
  		$("#title").html(str + theNumber);
    })


})
