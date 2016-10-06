var State = function(old) {
	this.turn = '';
	this.oMovesCount = 0;
	this.result = 'still running';
	this.board = [];

	// Copy old state config
	if ( typeof old !== 'undefined' ) {
		var length = old.board.length;

		this.board = new Array(length);
		for (var i=0; i<length; i++) {
			this.board[i] = old.board[i]
		}

		this.turn = old.turn;
		this.oMovesCount = old.oMovesCount;
		this.result = old.result;
	}

	this.advanceTurn = function() {
		this.turn = this.turn === 'X' ? 'O' : 'X';
	};

	this.emptyCells = function() {
		var index_list = [];
		for ( var i=0; i<9; i++ ) {
			if ( this.board[i] === 'E' ) {
				index_list.push(i);
			}
		}
		return index_list;
	};

	this.isTerminal = function() {
		var b = this.board;

		// check rows
		for ( var i=0; i<=6; i+=3 ) {
			if ( b[i] !== 'E' && b[i] === b[i+1] && b[i+1] === b[i+2] ) {
				this.result = b[i] + '-won';
				return true;
			}
		}

		// check columns
		for ( var i=0; i<=2; i++ ) {
			if ( b[i] !== 'E' && b[i] === b[i+3] && b[i+3] === b[i+6] ) {
				this.result = b[i] + '-won';
				return true;
			}
		}

		// check diagonals
		for ( var i=0, j=4; i<=2; i+=2, j-=2 ) {
			if ( b[i] !== 'E' && b[i] === b[i+j] && b[i+j] === b[i+2*j] ) {
				this.result = b[i] + '-won';
				return true;
			}
		}

		var avaliable = this.emptyCells();
		if ( avaliable.length === 0 ) {
			this.result = 'draw';
			return true;
		} else {
			return false;
		}
	};
};

var Game = function(autoPlayer) {
	this.ai = autoPlayer;
	this.status = 'beginning';

	this.currentState = new State();
	this.currentState.turn = 'X';
	this.currentState.board = ['E','E','E',
							   'E','E','E',
							   'E','E','E'];
	
	this.advanceTo = function(_state) {
		this.currentState = _state;

		if ( _state.isTerminal() ) {
			this.status = 'ended';

			if ( _state.result === 'X-won' ) {
				ui.switchViewTo('won');
			}
			else if ( _state.result === 'O-won' ) {
				ui.switchViewTo('lost');
			}
			else {
				ui.switchViewTo('draw');
			}
		}
		else {
			if ( this.currentState.turn === 'X' ) {
				ui.switchViewTo('human');
			}
			else {
				ui.switchViewTo('robot');
				this.ai.notify('O');
			}
		}
	};

	this.start = function() {
		if ( this.status === 'beginning' ) {
			this.advanceTo(this.currentState);
			this.status = 'running';
		}
	};
};