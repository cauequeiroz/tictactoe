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
	var levelOfIntelligence = level,
	var game = {};

	function minimaxValue(state) {}

	function takeABlindMove(turn) {}

	function takeANoviceMove(turn) {}

	function takeAMasterMove(turn) {}

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