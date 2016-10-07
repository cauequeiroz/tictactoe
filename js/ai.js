var AIAction = function(pos) {
	this.movePosition = pos;
	this.minimaxVal = 0;

	this.applyTo = function(state) {
		var next = new State(state);
		next.board[this.movePosition] = state.turn;

		if ( state.turn === 'O' ) {
			next.oMovesCount++;
		}

		next.advanceTurn();
		return next;
	};
};
AIAction.ASCENDING = function(firstAction, secondAction) {
	if ( firstAction.minimaxVal < secondAction.minimaxVal ) {
		return -1;
	} else if ( firstAction.minimaxVal > secondAction.minimaxVal ) {
		return 1;
	} else {
		return 0;
	}
}
AIAction.DESCENDING = function(firstAction, secondAction) {
	if ( firstAction.minimaxVal > secondAction.minimaxVal ) {
		return -1;
	} else if ( firstAction.minimaxVal < secondAction.minimaxVal ) {
		return 1;
	} else {
		return 0;
	}
}

var AI = function(level) {
	var levelOfIntelligence = level;
	var game = {};

	function minimaxValue(state) {
		if ( state.isTerminal() ) {
			return Game.score(state);
		}
		else {
			var stateScore;

			if ( state.turn === 'X' ) {
				stateScore = -1000;
			} else {
				stateScore = 1000;
			}

			var avaliablePositions  = state.emptyCells();
			var avaliableNextStates = avaliablePositions.map(function(pos) {
				var action = new AIAction(pos);
				var nextState = action.applyTo(state);
				return nextState;
			});

			avaliableNextStates.forEach(function(nextState) {
				var nextScore = minimaxValue(nextState);

				if ( state.turn === 'X' ) {
					if ( nextScore > stateScore ) {
						stateScore = nextScore;
					}
				} else {
					if (nextScore < stateScore ) {
						stateScore = nextScore;
					}
				}
			});

			return stateScore;
		}
	}

	function takeABlindMove(turn) {
		var available = game.currentState.emptyCells();
	    var randomCell = available[Math.floor(Math.random() * available.length)];
	    var action = new AIAction(randomCell);

	    var next = action.applyTo(game.currentState);

	    tictactoe.insertAt(randomCell, turn);

	    game.advanceTo(next);
	};

	function takeANoviceMove(turn) {
		var available = game.currentState.emptyCells();

		var availableActions = available.map(function(pos) {
		    var action =  new AIAction(pos); //create the action object

		    var nextState = action.applyTo(game.currentState);

		    action.minimaxVal = minimaxValue(nextState);

		    return action;
		});

		if(turn === "X") {
		    availableActions.sort(AIAction.DESCENDING);
		}
		else {
		    availableActions.sort(AIAction.ASCENDING);
		}

		var chosenAction;
		if(Math.random()*100 <= 40) {
		    chosenAction = availableActions[0];
		}
		else {
		    if(availableActions.length >= 2) {
		        chosenAction = availableActions[1];
		    }
		    else {
		        chosenAction = availableActions[0];
		    }
		}
		var next = chosenAction.applyTo(game.currentState);

		tictactoe.insertAt(chosenAction.movePosition, turn);

		game.advanceTo(next);
	};

	function takeAMasterMove(turn) {
		var available = game.currentState.emptyCells();
   
	    var availableActions = available.map(function(pos) {
	        var action =  new AIAction(pos);

	        var next = action.applyTo(game.currentState);
	        action.minimaxVal = minimaxValue(next);

	        return action;
	    });

	    if(turn === "X") {
	        availableActions.sort(AIAction.DESCENDING);
	    }
	    else {
	        availableActions.sort(AIAction.ASCENDING);
	    }

	    var chosenAction = availableActions[0];
	    var next = chosenAction.applyTo(game.currentState);

	    tictactoe.insertAt(chosenAction.movePosition, turn);

	    game.advanceTo(next);
	};

	this.plays = function(_game) {
		game = _game;
	};

	this.notify = function(turn) {
		switch(levelOfIntelligence) {
			case "blind": takeABlindMove(turn); break;
			case "novice": takeANoviceMove(turn); break;
			case "master": takeAMasterMove(turn); break;
		}
	};
};