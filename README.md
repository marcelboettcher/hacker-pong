# HackerSchool Hamburg - Pong

## Links
- [HackerSchool](http://www.hacker-school.de)
- [Phaser Dokumentation](http://phaser.io/docs)

## Ergebnisse
Team 1
- Session 2: https://rawgit.com/marcelboettcher/hacker-pong/team1_session2/index.html
- Session 3: https://rawgit.com/marcelboettcher/hacker-pong/team1_session3/index.html

Team 2
- Session 2: https://rawgit.com/marcelboettcher/hacker-pong/team2_session2/index.html
- Session 3: https://rawgit.com/marcelboettcher/hacker-pong/team2_session3/index.html

Team 3
- Session 2: https://rawgit.com/marcelboettcher/hacker-pong/team3_session2/index.html
- Session 3: https://rawgit.com/marcelboettcher/hacker-pong/team3_session3/index.html

Team 4
- Session 2: https://rawgit.com/marcelboettcher/hacker-pong/team4_session2/index.html
- Session 3: https://rawgit.com/marcelboettcher/hacker-pong/team4_session3/index.html

Team 5
- Session 2: https://rawgit.com/marcelboettcher/hacker-pong/team5_session2/index.html
- Session 3: https://rawgit.com/marcelboettcher/hacker-pong/team5_session3/index.html


## Grundlagen	von JavaScript

### Variablen
Einer Variable kann ein Wert (z.B. eine Zahl, ein Text) zugewiesen werden. Diesen kann man dann später nutzen.

Eine Variable wird ohne einen Wert definiert.
```
var alter;
```

Oder der Anfangswert kann gleich angegeben werden:
```
var alter = 32;
```

Anstelle der 32 kann ein beliebiger Ausdruck stehen. Das Schema lautet also:
```
var Bezeichner = Ausdruck;
```



### Bedingungen / Verzweigungen
Die Anweisungen in einer Verzweigung werden nur ausgeführt, wenn eine Bedingung zutrifft. Das Englische "if" heißt passenderweise "wenn".

```
if (alter >= 18) {
   alert("Volljährig!");
} else {
   alert("Noch nicht volljährig.");
}
```
In Deutsch ließt sich das ganze etwa so: 
```
Wenn alter größer oder gleich 18 ist, dann
  rufe "Volljährig"
sonst
  rufe "Noch nicht volljährig."
```
Die obere Anweisung wird nur ausgeführt, wenn der Variable `alter` ein Wert 18 größer oder gleich 18 zugewiesen wurde.


### Funktionen
Eine Funktion sammelt ein paar Anweisungen.

```
function happyBirthday() {
  alter = alter + 1;
}
```
Ausgeführt werden die Anweisungen in diese Funktion erst, wenn sie aufgerufen wird:
```
happyBirthday()
```

Einer Funktion können auch Werte übergeben werden:
```
function summiere(zahl1, zahl2) {
  var summe = zahl1 + zahl2;
  return summe;
}
```

Wenn die Funktion aufgerufen wird, gibt sie die Summe zurück. Diese kann in einer Variablen gespeichert werden.
```
var summe = summiere(1, 2);
```


### Kommentar

```
// Das ist ein Kommentar. Der wird nicht ausgeführt.
var alter = 1;
```
