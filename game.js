// Spielfeldgröße
var FIELD_WIDTH = 480;
var FIELD_HEIGHT = 640;

// Ball Geschwindigkeit
var BALL_SPEED = 250;

// Spieler Geschwindigkeit
var PLAYER_SPEED = 6;

// Spieler Startpositon
var PLAYER1_POSITION = FIELD_HEIGHT - 16; // ganz unten
var PLAYER2_POSITION = 40; // ganz oben


// Spiel wird mit Spielfeldgröße erstellt
var game = new Phaser.Game(FIELD_WIDTH, FIELD_HEIGHT, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update});
// einige Variablen werden definiert, um sie später nutzen zu können
var player1, goal1;
var player2, goal2;
var ball;
var startKey;
var player1KeyLeft, player1KeyRight;
var player2KeyLeft, player2KeyRight;
var scorePlayer1 = 0;
var scorePlayer2 = 0;


// diese Funktion wird als aller erstes aufgerufen
function preload () {
	// läd die Grafik für spieler1
	game.load.image('player1', 'images/player1.png');
	game.load.image('player2', 'images/player2.png');
	game.load.image('ball', 'images/ball.png');
	game.load.image('background', 'images/starfield.png');
}

// diese Funktion wird als zweites aufgerufen und erzeugt das Spiel, die Spieler und den Ball
function create () {
	// Spiel wird erstellt
	game.physics.startSystem(Phaser.Physics.ARCADE);
	// Spielfeld wird erstellt und die Grafik 'background' als Hintergrund genutzt
	game.add.tileSprite(0,0,FIELD_WIDTH, FIELD_HEIGHT, 'background');
	// Spieler1 wird erstellt und ihm werden zwei Tasten zur Steuerung zugewiesen
	player1 = createPlayer(game.world.centerX, PLAYER1_POSITION, 100, 10, 'player1',
		Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN);
	// Spieler2 wird erstellt und ihm werden zwei Tasten zur Steuerung zugewiesen
	player2 = createPlayer(game.world.centerX, PLAYER2_POSITION, 100, 10, 'player2',
		Phaser.Keyboard.A, Phaser.Keyboard.D, Phaser.Keyboard.W, Phaser.Keyboard.S);
	// Der Ball wird erstellt und auf den Mittelpunkt gelegt
	ball = createBall(game.world.centerX, game.world.centerY, 16, 16);
	// Tore werden erstellt
	goal1 = createGoal(FIELD_WIDTH / 2, FIELD_HEIGHT - 10, 200, 10);
	goal2 = createGoal(FIELD_WIDTH / 2, 10, 200, 10);
	// Anlegen der Spielstandsanzeige
	createScores();
	// Festlegen der Taste zum Spielstart
	startKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	startKey.onDown.add(startGame, this);
}

// Anlegen eines Spielers mit Position, Bild und zwei Tasten zur Steuerung
function createPlayer(x, y, width, height, image, keyLeft, keyRight, keyUp, keyDown) {
	var player = game.add.sprite(x, y, image);
	// vergrößert/verkleinert den Spieler
	player.width = width;
	player.height = height;
	game.physics.enable(player, Phaser.Physics.ARCADE);
	player.anchor.setTo(0.5, 0.5);
	player.enableBody = true;
	player.body.collideWorldBounds = true;
	player.body.bounce.setTo(1, 1);
	player.body.immovable = true;

	// immer wenn die Taste 'keyLeft' gedrückt wird, wird der Spieler nach links bewegt
	game.input.keyboard.addKey(keyLeft).onHoldCallback = function() {
		player.x = player.x - PLAYER_SPEED;
	};
	// immer wenn die Taste 'keyRight' gedrückt wird, wird der Spieler nach rechts bewegt
	game.input.keyboard.addKey(keyRight).onHoldCallback = function() {
		player.x = player.x + PLAYER_SPEED;
	};

	// immer wenn die Taste 'keyUp' gedrückt wird, wird der Spieler nach oben bewegt
	game.input.keyboard.addKey(keyUp).onHoldCallback = function() {
		player.y = player.y - PLAYER_SPEED;
	};
	// immer wenn die Taste 'keyDown' gedrückt wird, wird der Spieler nach unten bewegt
	game.input.keyboard.addKey(keyDown).onHoldCallback = function() {
		player.y = player.y + PLAYER_SPEED;
	};

	return player;
}

// Anlegen des Balles an einer gegebenen Position
function createBall(x, y, width, height) {
	var ball = game.add.sprite(x, y, 'ball');
	ball.width = width;
	ball.height = height;
	game.physics.enable(ball, Phaser.Physics.ARCADE);
	ball.anchor.setTo(0.5, 0.5);
	ball.body.collideWorldBounds = true;
	// wie stark soll der Ball am Spieler und an den Wänden abprallen? x = links/rechts, y = oben/unten
	ball.body.bounce.setTo(1, 1);
	return ball;
}

function createGoal(x, y, width, height) {
	var goal = game.add.sprite(x, y, 'player1');
	goal.width = width;
	goal.height = height;
	game.physics.enable(goal, Phaser.Physics.ARCADE);
	goal.anchor.setTo(0.5, 0.5);
	goal.body.collideWorldBounds = true;
	goal.body.immovable = true;
	return goal;
}

// Anlegen der Spielstandanzeige
function createScores() {
	// wie soll die Anzeige aussehen?
	// - 30px ist die Textgröße
	// - 'fill' ist eine Farbe (red, blue, green, ...)
	var style = { font: "30px Arial", fill: "red", align: "left" };
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
	// wenn Spieler1 den Ball trifft, wird die Funktion playerShootsBall aufgerufen
	game.physics.arcade.collide(player1, ball, playerShootsBall);
	// wenn Spieler2 den Ball trifft, wird die Funktion playerShootsBall aufgerufen
	game.physics.arcade.collide(player2, ball, playerShootsBall);
	// Tor gefallen?
	game.physics.arcade.collide(goal1, ball, goalShotBy(player2));
	game.physics.arcade.collide(goal2, ball, goalShotBy(player1));
}

// wird aufgerufen, wenn ein Spieler ein Tor erzielt hat
function goalShotBy(player) {
	return function() {
		// der Ball wird wieder auf den Mittelpunkt gelegt
		positionBallAtCenter();
		// der Spieler, der getroffen hat bekommt einen Punkt
		addPointTo(player);
	}
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
}

// Ein Spieler schießt den Ball zurück
function playerShootsBall(player, ball) {
	var diff = ball.x - player.x;
	ball.body.velocity.x = (10 * diff);
}