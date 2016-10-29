///////////////////////////////////////////////////////////////////////////////////
// Created By : Mitali Naik                                                      // 
// Assignment 4 - Boot Camp                                                      // 
//                                                                               // 
// Description: This is a version of Star Wars RPG game                         //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////



// Javascript function that wraps everything
$(document).ready(function(){

	var rpgGame = {
		
		textField: $("#text"),
		attackButton: $("#attack"),
		restartButton: $("#restart"),
		health_points_text: $(".health-points"),
		ch_divs: $(".characters"),
		selected_characters: 4,
		active_enemies: 0,
		currentPlayer: {},
		currentEnemy: {},
		characters: [{
			name: "Padme",
			base_health_points: 200,
			health_points: 200,
			base_attack_power: 10,
			attack_power: 10,
			counter_attack_power: 10,
			ch_number: 0,
			}, {
			name: "Vader",
			base_health_points: 460,
			health_points: 460,
			base_attack_power: 50,
			attack_power: 50,
			counter_attack_power: 50,
			ch_number: 1,
			}, {
			name: "Ghost Obi-Wan",
			base_health_points: 999,
			health_points: 999,
			base_attack_power: 1,
			attack_power: 1,
			counter_attack_power: 1,
			ch_number: 2,
			}, {
			name: "Yoda",
			base_health_points: 300,
			health_points: 300,
			base_attack_power: 20,
			attack_power: 20,
			counter_attack_power: 20,
			ch_number: 3,
			}],
		characters_length: 4,
		playMusic: new Audio("assets/sounds/Game-Menu.mp3"),

		// starts the game on load and 
		//Also it is called when Restart button is pressed
		playGame: function () {

			// restart the theme song
			this.playMusic.pause();
    		this.playMusic.play();

			//when restart is pressed - brings all the images back to the screen
			$(this.ch_divs).fadeIn(0);

			$(this.textField).html("Choose one of the characters above as your character.");
			$(this.attackButton).prop('disabled', true);
			$(this.restartButton).prop('disabled', true);

			// health points
			// hardcoded as 4 as that is the max amount of players on screen at one time
			for (var i = 0; i < 4; i++) {

				// reseting the health points to the base health points and displaying on screen
				this.characters[i].health_points = this.characters[i].base_health_points;
				$(this.health_points_text[i]).html(this.characters[i].base_health_points);

		
				// reseting attack power to base attack power
				this.characters[i].attack_power = this.characters[i].base_attack_power;

				// remove the .dead-character class from all the images
				$(this.ch_divs[i]).find("img").removeClass("dead-character");
				
			} // end for loop

			// reset position of character divs
			$(this.ch_divs[0]).css({
				"top": "0",
				"right": "75%"
			});
			$(this.ch_divs[1]).css({
				"top": "0",
				"right": "50%"
			});
			$(this.ch_divs[2]).css({
				"top": "0",
				"right": "25%"
			});
			$(this.ch_divs[3]).css({
				"top": "0",
				"right": "0px"
			});

			// reset selected_characters to 4 so the initial character selected moves to the player's position
			this.selected_characters = 4;

			// reset active enemies to 0
			this.active_enemies = 0;

			// set the active player and active enemy to empty strings
			this.currentPlayer = {};
			this.currentEnemy = {};
		},
		
		// player choses a character function. This repoisitons the selected character on the gameSection and displays text asking the player to select the first enemy to engage.
		selectPlayer: function (player) {

			// set the currentPlayer to the character the player chose
			// loop through the characters array until the name of the character matches the one selected
			for (var i = 0; i < this.characters_length; i++) {
				
				// if there's a match
				if (this.characters[i].name === $(player).find(".name").text()) {

					// set the active player to the one selected
					this.currentPlayer = this.characters[i];
				} // end if
			} // end for loop

			// reduce number of selected characters by 1
			this.selected_characters--;
			player.animate({top: "250px",right: "60%"
			}, 500); //500 is to move a bit slowly  

			// display text asking the player to chose an enemy to attack
			$(this.textField).html("Select an enemy to attack.");
		},

		// chose the enemy
		selectEnemy: function (enemy) {

			// determine if there are active enemies so that only one enemy is positioned if the player mistakenly clicks a second enemy before the first enemy has been defeated
			if (this.active_enemies === 0) {

				// set the currentEnemy to the character the enemy chose
				// loop through the characters array until the name of the character matches the one selected
				for (var i = 0; i < this.characters_length; i++) {
					
					// if there's a match
					if (this.characters[i].name === $(enemy).find(".name").text()) {

						// set the active enemy to the one selected
						this.currentEnemy = this.characters[i];
					} // end if
				} // end for loop

				// reduce number of selected characters by 1
				this.selected_characters--;

				// move the enemy character to the left of the screen
				enemy.animate({
					top: "250px",
					right: "20%"
				}, 500); // 500 is to move the img a bit slowly

				// set the active enemies to 1. This will be set to 0 once the enemy has been defeated.
				this.active_enemies = 1;

				// activate the attack button
				$(this.attackButton).prop('disabled', false);
				$(this.textField).html("");
				$(this.textField).html("You have selected "+this.currentEnemy.name+"<br/> Now Hit attack button");


			}
		},

		// once the attack button is clicked
		attack: function () {

			// Attack Section			
			// decrease the health points of the attacked enemy
			this.currentEnemy.health_points = this.currentEnemy.health_points - this.currentPlayer.attack_power;

			// increase the attack power of the active player
			this.currentPlayer.attack_power = this.currentPlayer.attack_power + this.currentPlayer.base_attack_power;

			// displays to the screen
			// update the active enemy's health points
			$(this.health_points_text[this.currentEnemy.ch_number]).html(this.currentEnemy.health_points);

			// Dead Enemy Character Section
			// if the active enemy's health points are 0 or below
			if (this.currentEnemy.health_points <= 0) {

				// if there are more enemies to fight
				if (this.selected_characters !== 0) {

					// display the name of the dead character to the screen with
					$(this.textField).html("You have killed " + this.currentEnemy.name + "<br /><br />Select another character to fight.");

				} else {

					// you have won the game so display a congratulatory message
					$(this.textField).html("You have killed " + this.currentEnemy.name + "<br /><br />Congratulations! You are the winner!!!"+"<br/> Hit Restart to Play again");

					// activate the Restart button
					$(this.restartButton).prop('disabled', false);

				} // end if else

				// set the health points to 0 so no negative numbers show
				$(this.health_points_text[this.currentEnemy.ch_number]).html("0");

				// move the active enemy to the right of the screen, add the .dead-character class to the image and fade that character out
				$(this.ch_divs[this.currentEnemy.ch_number]).animate({right: "0%"}, 500).fadeOut("slow");
				$(this.ch_divs[this.currentEnemy.ch_number]).find("img").addClass("dead-character");
				//$(this.ch_divs[this.currentEnemy.ch_number]).fadeOut(1000 * 5);

				// set the active enemy to an empty object and set the active number of enemies to 0
				this.currentEnemy = {};
				this.active_enemies = 0;

				// deactivate the attack button
				$(this.attackButton).prop('disabled', true);

			} // end if


			// Counter Attack Section
			// if active enemy's character number is not undefined (meaning there is an active enemy)
			if (this.currentEnemy.ch_number !== undefined) {

				// decrease the health points of the player by the counter attack power of the active enemy
				this.currentPlayer.health_points = this.currentPlayer.health_points - this.currentEnemy.counter_attack_power;

				// displays to the screen
				// update the active player's health points
				$(this.health_points_text[this.currentPlayer.ch_number]).html(this.currentPlayer.health_points);

				// display the amount of damage done by each character on the screen
				$(this.textField).html(this.currentEnemy.name + " received " + this.currentPlayer.attack_power + " points in damage. <br />" + this.currentPlayer.name + " received " + this.currentEnemy.counter_attack_power + " points in damage.");

			}

			// Dead Player Character Section
			if (this.currentPlayer.health_points <= 0) {

				// set the health points to 0 so no negative numbers show
				$(this.health_points_text[this.currentPlayer.ch_number]).html("0");

				// add the .dead-character class to the active player image
				$(this.ch_divs[this.currentPlayer.ch_number]).find("img").addClass("dead-character");

				// display game over on the screen
				// you have won the game so display a congratulatory message
				$(this.textField).html("You have been killed by " + this.currentEnemy.name + "<br /><br />GAME OVER");
				$(this.ch_divs[this.currentPlayer.ch_number]).animate({right: "20%"}, 500).fadeOut("slow");
				$(this.ch_divs[this.currentPlayer.ch_number]).find("img").addClass("dead-character");
				

				// deactivate the attack button
				$(this.attackButton).prop('disabled', true);

				// activate the Restart button
				$(this.restartButton).prop('disabled', false);

			}
		}
	}


	// starter functions and event handlers
	// removes title screen and will only display when the page is reloaded so the player can quickly play again
	

	rpgGame.playGame();

	$(rpgGame.ch_divs).on("click", function (e) {

		if (rpgGame.selected_characters === 4) {

			rpgGame.selectPlayer($(this));

		} else {

			rpgGame.selectEnemy($(this));

		} // end if else for character select

	}); // end character click event

	$(rpgGame.attackButton).on("click", function () {

		rpgGame.attack();

	});

//this acts as a Restart Function too (playGame() ) - this will reset everything allows to play again
	
	$(rpgGame.restartButton).on("click", function () {

		rpgGame.playGame();

	})

});