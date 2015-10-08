// Spielfeldgröße
var FIELD_WIDTH = 480;
var FIELD_HEIGHT = 640;

// Ball Geschwindigkeit
var BALL_SPEED = 250;

var BALLegg_HEIGHT = 4
var BALLegg_HEIGHT = 6

var BALL_HEIGHT = 100
var BALL_WIDTH = 100

// Spieler Geschwindigkeit
var PLAYER_SPEED = 6;

// Spieler Startpositon
var PLAYER1_POSITION = FIELD_HEIGHT - 40; // ganz unten
var PLAYER2_POSITION = 40; // ganz oben

// Spiel wird mit Spielfeldgröße erstellt
var game = new Phaser.Game(FIELD_WIDTH, FIELD_HEIGHT, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update});
// einige Variablen werden definiert, um sie später nutzen zu können
var player1, goal1;
var player2, goal2;
var ball;
var items = [];
var startKey;
var player1KeyLeft, player1KeyRight;
var player2KeyLeft, player2KeyRight;
var scorePlayer1 = 0;
var scorePlayer2 = 0;


// diese Funktion wird als aller erstes aufgerufen
function preload () {
	// Grafik für spieler1 wird geladen
	game.load.image('player1', 'images/football_player1.png');
	game.load.image('player2', 'images/football_player2.png');
	game.load.image('ball', 'images/football_ball.png');
	game.load.image('goal', 'images/goal.png');
	game.load.image('background', 'images/football_field.jpg');
	game.load.image('item', 'images/diamant_red.png');
}

// diese Funktion wird als zweites aufgerufen und erzeugt das Spiel, die Spieler und den Ball
function create () {
	// Spiel wird erstellt
	game.physics.startSystem(Phaser.Physics.ARCADE);
	// Spielfeld wird erstellt und die Grafik 'background' als Hintergrund genutzt
	game.add.tileSprite(0,0,FIELD_WIDTH, FIELD_HEIGHT, 'background');
	// Spieler1 wird erstellt und ihm werden zwei Tasten zur Steuerung zugewiesen
	player1 = createPlayer(game.world.centerX, PLAYER1_POSITION, 78, 37, 'player1',
		Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN);
	// Spieler2 wird erstellt und ihm werden zwei Tasten zur Steuerung zugewiesen
	player2 = createPlayer(game.world.centerX, PLAYER2_POSITION, 78, 37, 'player2',
		Phaser.Keyboard.A, Phaser.Keyboard.D, Phaser.Keyboard.W, Phaser.Keyboard.S);
	// Der Ball wird erstellt und auf den Mittelpunkt gelegt
	ball = createBall(game.world.centerX, game.world.centerY, 16, 16);
	// Tore werden erstellt
	goal1 = createGoal(FIELD_WIDTH / 2, FIELD_HEIGHT - 15, 150, 10);
	goal2 = createGoal(FIELD_WIDTH / 2, 10, 150, 10);
	// Anlegen der Spielstandsanzeige
	createScores();
	// Festlegen der Taste zum Spielstart
	startKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	startKey.onDown.add(startGame, this);

	createItem();
	//hier wird ein Gegenstand erzeugt
	//createItem();
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

function createItem() {
	var itemX = Math.random() * FIELD_WIDTH;
	var itemY = Math.random() * FIELD_HEIGHT;
	var item = game.add.sprite(itemX, itemY, 'item');
	var minSize = 30;
	item.width = Math.random() * 100 + minSize;
	item.height = Math.random() * 100 + minSize;
	game.physics.enable(item, Phaser.Physics.ARCADE);
	item.anchor.setTo(0.5, 0.5);
	item.body.collideWorldBounds = true;
	item.body.immovable = false;
	item.body.velocity.y = 200;
	items.push(item);
	return item;
}

function createGoal(x, y, width, height) {
	var goal = game.add.sprite(x, y, 'goal');
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
    var score1x = 15;
	var score1y = game.world.height / 2;
	scorePlayer1 = game.add.text(score1x, score1y, 0, style);
	// Der Spielstand für Spieler2 wird positioniert (x, y)
	var score2x = game.world.width - 30;
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

	game.physics.arcade.collide(items, ball, hitItem);
	game.physics.arcade.collide(player1, items, hitPlayer);
	game.physics.arcade.collide(player2, items, hitPlayer);
}
function hitPlayer(player, item) {
	//if(player === player2) {
		growPlayer2();
	//if(player === player1) {
		growPlayer1();
//	}
	item.kill();
	createItem();
} 
function hitItem(item, ball) {
	
	var actions = [speedUpBall, growBall, shrinkBall,growPlayer1,shrinkPlayer1,growPlayer2,shrinkPlayer2,eggBall,reeggBall];
	//var actions = [];
	var random = Math.floor(Math.random() * actions.length);
	var action = actions[random];
	action();
	item.kill();
	createItem();
}

function speedUpBall() {
	ball.body.velocity.x = 2 * ball.body.velocity.x;
	ball.body.velocity.y = 2 * ball.body.velocity.y;
}

function growBall() {
	ball.width = ball.width + 10;
	ball.height = ball.height + 10;
}
function shrinkBall() {
	ball.width = ball.width - 10;
	ball.height = ball.height - 10;
}
function shrinkPlayer1() {
	player1.width = player1.width - 10;
	player1.height = player1.height - 10;
}
function growPlayer1() {
	player1.width = player1.width + 10;
	player1.height = player1.height + 10;
}
function shrinkPlayer2() {
	player2.width = player2.width - 10;
	player2.height = player2.height - 10;
}
function growPlayer2(){
	player2.width = player2.width + 10;
	player2.height = player2.height + 10;
}
function eggBall(){
	ball.height = ball.height + 5;
}
function reeggBall(){
	ball.height = ball.height - 5;
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