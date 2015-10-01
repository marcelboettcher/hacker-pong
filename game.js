// Spielfeldgröße
var FIELD_WIDTH = 480;
var FIELD_HEIGHT = 640;

// Ball Geschwindigkeit
var BALL_SPEED = 300;

// Spieler Geschwindigkeit
var PLAYER_SPEED = 15;

// Spieler Startpositon
var PLAYER1_POSITION = FIELD_HEIGHT - 16; // ganz unten
var PLAYER2_POSITION = 10; // ganz oben


// Spiel wird mit Spielfeldgröße erstellt
var game = new Phaser.Game(FIELD_WIDTH, FIELD_HEIGHT, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update});
// einige Variablen werden definiert, um sie später nutzen zu können
var player1, player2, ball;
var startKey;
var player1KeyLeft, player1KeyRight;
var player2KeyLeft, player2KeyRight;
var scorePlayer1 = 1;
var scorePlayer2 = 1;


// diese Funktion wird als aller erstes aufgerufen
function preload () {
	// läd die Grafik für spieler1
	game.load.image('player1', 'images/football_player1.png');
	game.load.image('player2', 'images/football_player2.png');
	game.load.image('ball', 'images/football_ball.png');
	game.load.image('ball99', 'images/football_ball.png');
	game.load.image('background', 'images/football_field.jpg');
}

// diese Funktion wird als zweites aufgerufen und erzeugt das Spiel, die Spieler und den Ball
function create () {
	// Spiel wird erstellt
	game.physics.startSystem(Phaser.Physics.ARCADE);
	// Spielfeld wird erstellt und die Grafik 'background' als Hintergrund genutzt
	game.add.tileSprite(0,0,FIELD_WIDTH, FIELD_HEIGHT, 'background');
	// Spieler1 wird erstellt und ihm werden zwei Tasten zur Steuerung zugewiesen
	player1 = createPlayer(game.world.centerX, PLAYER1_POSITION, 'player1', Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT);
	// Spieler2 wird erstellt und ihm werden zwei Tasten zur Steuerung zugewiesen
	player2 = createPlayer(game.world.centerX, PLAYER2_POSITION, 'player2', Phaser.Keyboard.A, Phaser.Keyboard.D);
	// Der Ball wird erstellt und auf den Mittelpunkt gelegt
	ball = createBall(game.world.centerX, game.world.centerY);
	ball2 = createBall99(0,0);
	ball6 = createBall99(0,0);
	ball7 = createBall99(0,0);
	ball8 = createBall99(0,0);
	ball9 = createBall99(0,0);
	ball3 = createBall99(0,0);
	ball4 = createBall99(0,0);
	ball5 = createBall99(0,0);
	// Anlegen der Spielstandsanzeige
	createScores();
	// Festlegen der Taste zum Spielstart
	startKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	startKey.onDown.add(startGame, this);
}

// Anlegen eines Spielers mit Position, Bild und zwei Tasten zur Steuerung
function createPlayer(x, y, image, keyLeft, keyRight) {
	var player = game.add.sprite(x, y, image);
	// vergrößert/verkleinert den Spieler
	player.scale.setTo(1, 1);
	game.physics.enable(player, Phaser.Physics.ARCADE);
	player.anchor.setTo(0.5, 0.5);
	player.enableBody = true;
	player.body.collideWorldBounds = true;
	player.body.bounce.setTo(1, 1);
	player.body.immovable = true;

	// immer wenn die Taste 'keyLeft' gedrückt wird, wird der Spieler nach links bewegt
	game.input.keyboard.addKey(keyLeft).onHoldCallback = function() {
		movePlayer(player, -PLAYER_SPEED);
	};
	// immer wenn die Taste 'keyRight' gedrückt wird, wird der Spieler nach rechts bewegt
	game.input.keyboard.addKey(keyRight).onHoldCallback = function() {
		movePlayer(player, PLAYER_SPEED);
	};

	return player;
}

// Anlegen des Balles an einer gegebenen Position
function createBall(x, y) {
	var ball = game.add.sprite(x, y, 'ball');
	// vergrößert/verkleinert den Ball
	ball.scale.setTo(1, 1);
	game.physics.enable(ball, Phaser.Physics.ARCADE);
	ball.anchor.setTo(0.5, 0.5);
	ball.body.collideWorldBounds = true;
	// wie stark soll der Ball am Spieler und an den Wänden abprallen? x = links/rechts, y = oben/unten
	ball.body.bounce.setTo(1, 1);
	return ball;
}

function createBall99(x, y) {
	var ball = game.add.sprite(x, y, 'ball99');
	// vergrößert/verkleinert den Ball
	ball.scale.setTo(1, 1);
	game.physics.enable(ball, Phaser.Physics.ARCADE);
	ball.anchor.setTo(0.5, 0.5);
	ball.body.collideWorldBounds = true;
	// wie stark soll der Ball am Spieler und an den Wänden abprallen? x = links/rechts, y = oben/unten
	ball.body.bounce.setTo(1, 1);
	return ball;
}

// Anlegen der Spielstandanzeige
function createScores() {
	// wie soll die Anzeige aussehen?
	// - 30px ist die Textgröße
	// - 'fill' ist eine Farbe (red, blue, green, ...)
	var style = { font: "30px Arial", fill: "black", align: "left" };
	// Der Spielstand für Spieler1 wird positioniert (x, y)
    var score1x = 10;
	var score1y = game.world.height / 2;
	scorePlayer1 = game.add.text(score1x, score1y, 0, style);
	// Der Spielstand für Spieler2 wird positioniert (x, y)
	var score2x = game.world.width - 20;
	var score2y = game.world.height / 2;
	scorePlayer2 = game.add.text(score2x, score2y, 0, style);
}



// diese Funktion wird mehrmals in der Sekunde aufgerufen
function update () {
	// hier wird geprüft, ob ein Spieler den Ball getroffen hat
	checkIfPlayerShootsBall();
	// hier wird geprüft, ob ein Tor gefallen ist
	checkIfGoal();
}

// wird aufgerufen, wenn ein Spieler ein Tor erzielt hat
function goalShotBy(player) {
	// der Ball wird wieder auf den Mittelpunkt gelegt
	positionBallAtCenter();
	// der Spieler, der getroffen hat bekommt einen Punkt
	addPointTo(player);
}

// der Spieler, der getroffen hat bekommt einen Punkt
function addPointTo(player) {
	// wenn der Spieler der getroffen hat Spieler1 ist,
	// dann zähle seine Punktestand hoch
	if(player === player1) {
		scorePlayer1.text = parseInt(scorePlayer1.text) + 1;
	} else {
		// ansonsten hat Spieler2 getroffen und er bekommt einen Punkt dazu
		scorePlayer2.text = parseInt(scorePlayer2.text) + 1;
	}
}

// der Ball wird auf den Mittelpunkt gelegt
function positionBallAtCenter () {
	// die Position des Balles wird gesetzt
	ball.x = game.world.centerX;
	ball.y = game.world.centerY;
	// der Ball soll sich nicht bewegen
	ball.body.velocity.x = 0;
	ball.body.velocity.y = 0;
}

// startet das Spiel indem der Ball nach rechts oben geschossen wird
function startGame() {
	ball.body.velocity.x = BALL_SPEED;
	ball.body.velocity.y = -BALL_SPEED;
	ball2.body.velocity.y = -BALL_SPEED+100;
	ball2.body.velocity.x = BALL_SPEED+100;
	ball6.body.velocity.y = -BALL_SPEED-10;
	ball6.body.velocity.x = BALL_SPEED-10;
	ball7.body.velocity.y = -BALL_SPEED+10;
	ball7.body.velocity.x = BALL_SPEED+10;
	ball8.body.velocity.y = -BALL_SPEED+20;
	ball8.body.velocity.x = BALL_SPEED+20;
	ball9.body.velocity.y = -BALL_SPEED+900;
	ball9.body.velocity.x = BALL_SPEED+900;
	ball5.body.velocity.y = -BALL_SPEED+1000;
	ball5.body.velocity.x = BALL_SPEED+1000;
	ball4.body.velocity.y = -BALL_SPEED+200;
	ball4.body.velocity.x = BALL_SPEED+200;
	ball3.body.velocity.y = -BALL_SPEED+9000;
	ball3.body.velocity.x = BALL_SPEED+9000;
}

// hier legen wir fest, was passiert, wenn zwei Objekte aufeinander prallen
function checkIfPlayerShootsBall () {
	// wenn Spieler1 den Ball trifft, wird die Funktion playerShootsBall aufgerufen
	game.physics.arcade.collide(player1, ball, playerShootsBall, null, this);
	// wenn Spieler2 den Ball trifft, wird die Funktion playerShootsBall aufgerufen
	game.physics.arcade.collide(player2, ball, playerShootsBall, null, this);
}

// Ein Spieler schießt den Ball zurück
function playerShootsBall(player, ball) {
	var diff = ball.x - player.x;
	ball.body.velocity.x = (10 * diff);
}

// hier wird geprüft, ob und für wen ein Tor gefallen ist
// wenn ein Tor gefallen ist, wird die Funktion 'goalShotBy(player)' aufgerufen
function checkIfGoal () {
	// hat Speiler 1 (unten) ein Tor erzielt?
	if (ball.y < ball.height / 2 + 1) {
		goalShotBy(player1);
	// hat Speiler 2 (oben) ein Tor erzielt?
	} else if (ball.y > FIELD_HEIGHT - ball.height / 2 - 1) {
		goalShotBy(player2);
	}
}

// bewege den Spieler um die Anzahl Schritte (steps)
function movePlayer(player, steps) {
	var playerHalfWidth = player.width / 2;
	player.x = player.x + steps;
	if (player.x < playerHalfWidth) {
		player.x = playerHalfWidth;
	} else if (player.x > game.width - playerHalfWidth) {
		player.x = game.width - playerHalfWidth;
	}
}