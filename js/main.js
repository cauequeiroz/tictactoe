var globals;
var aiPlayer;

var tictactoe = {
	level: '',

	init: function() {
		// Player: select level
		var level_list = document.querySelectorAll('.level a'),
			len = level_list.length;

		for ( var i=0; i<len; i++ ) {
			level_list[i].addEventListener('click', tictactoe.selectLevel, false);
		}

		// Player: click on grid
		var elem_list = document.querySelectorAll('.box'),
			len = elem_list.length;

		for ( var i=0; i<len; i++ ) {
			elem_list[i].addEventListener('click', tictactoe.selectPos, false);
		}

		// Select level 1 to start the game
		level_list[0].click();
	},

	selectLevel: function() {
		if ( !this.classList.contains('selected') ) {
			if ( this.parentNode.parentNode.querySelectorAll('.selected').length ) {
				document.querySelector('.selected').classList.remove('selected');
			}
			this.classList.add('selected');

			tictactoe.level = this.getAttribute('data-level');
			tictactoe.start();
		}		
	},

	selectPos: function() {
		if ( globals.game.status === "running" && globals.game.currentState.turn === "X" && !this.classList.contains('turn')) {
			var indx = this.getAttribute('data-ref');

			var next = new State(globals.game.currentState);
			next.board[indx] = "X";

			tictactoe.insertAt(indx, "X");

			next.advanceTurn();

			globals.game.advanceTo(next);
		}
	},

	start: function() {
		tictactoe.resetBoard();
		globals = {};
		aiPlayer = new AI(tictactoe.level);
		globals.game = new Game(aiPlayer);
		aiPlayer.plays(globals.game);

		// Start game :)
		globals.game.start();
	},

	resetBoard: function() {
		var elem = document.querySelectorAll('.box'),
			len  = elem.length;

		for ( var i=0; i<len; i++ ) {
			elem[i].setAttribute('class', 'box');
		}
	},

	insertAt: function(indx, symbol) {
		var elem = document.querySelectorAll('.box')[indx];
			elem.classList.add('turn');
			elem.classList.add(symbol.toLowerCase());
	},

	switchViewTo: function(turn) {
		if ( turn !== 'human' && turn !== 'robot' ) {
			var elem = document.querySelector('.display'),
				msg = {
				'won': 'You win! :)',
				'lost': 'You lose :(',
				'draw': "It's a draw."
			}

			elem.innerHTML = msg[turn];
			elem.style.opacity = 1;

			setTimeout(function() {
				elem.style.opacity = 0;
				tictactoe.start();
			}, 1000);
		}
	}
}

tictactoe.init();