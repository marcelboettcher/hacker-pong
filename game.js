// Spielfeldgröße
var FIELD_WIDTH = 480;
var FIELD_HEIGHT = 640;

// Ball Geschwindigkeit
var BALL_SPEED = 300;

// Spieler Geschwindigkeit
var PLAYER_SPEED = 6;

// Spieler Startpositon
var PLAYER1_POSITION = FIELD_HEIGHT - 16; // ganz unten
var PLAYER2_POSITION = 16; // ganz oben


// Spiel wird mit Spielfeldgröße erstellt
var game = new Phaser.Game(FIELD_WIDTH, FIELD_HEIGHT, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update});
// einige Variablen werden definiert, um sie später nutzen zu können
var player1, player2, ball;
var startKey;
var player1KeyLeft, player1KeyRight;
var player2KeyLeft, player2KeyRight;


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
	player1 = createPlayer(game.world.centerX, PLAYER1_POSITION, 'player1', Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT);
	// Spieler2 wird erstellt und ihm werden zwei Tasten zur Steuerung zugewiesen
	player2 = createPlayer(game.world.centerX, PLAYER2_POSITION, 'player2', Phaser.Keyboard.A, Phaser.Keyboard.D);
	// Der Ball wird erstellt und auf den Mittelpunkt gelegt
	ball = createBall(game.world.centerX, game.world.centerY);
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

// hier legen wir fest, was passiert, wenn zwei Objekte aufeinander prallen
function checkIfPlayerShootsBall () {
	// wenn Spieler1 den Ball trifft, wird die Funktion playerShootsBall aufgerufen
	game.physics.arcade.collide(player1, ball, playerShootsBall, null, this);
	// wenn Spieler2 den Ball trifft, wird die Funktion playerShootsBall aufgerufen
	game.physics.arcade.collide(player2, ball, playerShootsBall, null, this);
}

// Ein Spieler schießt den Ball zurück
function playerShootsBall(player, ball) {
	if (ball.x > player.x) {
		var diff = ball.x - player.x;
		ball.body.velocity.x = (10 * diff);
	} else {
		ball.body.velocity.x = 2 + Math.random() * 8;
	}
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