// css class for different card image
const CARD_TECHS = [
  "html5",
  "css3",
  "js",
  "sass",
  "nodejs",
  "react",
  "linkedin",
  "heroku",
  "github",
  "aws"
];

// only list out some of the properties,
// add more when needed
const game = {
  score: 0,
  level: 1,
  timer: 60,
  interval: null, // interval's number,uses for clear it
  cardsDisplay: 0, //display how many cards
  timerDisplay: null,
  scoreDisplay: null,
  levelDisplay: null,
  timerInterval: null,
  startButton: null,
  selectedCard: null,
  selectingCard: null,
  cardClasses: [], //an array for storing selected card
  card:
    '<div class="card"><div class="card__face card__face--front"></div><div class="card__face card__face--back"></div></div>',
  gridDisplayClass: null //which grid class should be selected
  // and much more
};

setGame();

/*******************************************
/     resets
/******************************************/
function gameReset() {
  game.score = 0;
  game.level = 1;
  game.timer = 60;
  game.cardsDisplay = 0; //display how many cards
  game.timerDisplay = null;
  game.scoreDisplay = null;
  game.levelDisplay = null;
  game.timerInterval = null;
  game.startButton = null;
  game.selectedCard = null;
  game.selectingCard = null;
  game.cardClasses = [];
  game.card =
    '<div class="card"><div class="card__face card__face--front"></div><div class="card__face card__face--back"></div></div>';
  game.gridDisplayClass = null;
}

/*******************************************
/     game process
/******************************************/
function setGame() {
  // register any element in your game object
  selectLevel(game.level);
  if (game.level === 1) {
    bindStartButton();
  } else {
    game.timerDisplay = game.timer;
    startGame();
  }
}

function selectLevel(level) {
  game.levelDisplay = level;
  $(".game-stats__level--value").text(game.levelDisplay); //displayLevel
  switch (level) {
    case 1:
      game.cardsDisplay = 4;
      game.gridDisplayClass = "game-board__level1";
      break;
    case 2:
      game.cardsDisplay = 16;
      game.gridDisplayClass = "game-board__level2";
      break;
    case 3:
      game.cardsDisplay = 36;
      game.gridDisplayClass = "game-board__level3";
      break;
  } //chose cards' accounts and girdClass
}

function setCardsDisplayArray() {
  //make an array:cardClasses
  game.cardClasses = [];
  for (let i = 0; i < game.cardsDisplay; i++) {
    game.cardClasses.push([]);
    game.cardClasses[i][0] = Math.random();
    game.cardClasses[i][1] = CARD_TECHS[Math.floor((i % 20) / 2)];
    game.cardClasses.sort((a, b) => a[0] - b[0]);
  }
}

function setCardsDisplay() {
  for (let i = 0; i < game.cardsDisplay; i++) {
    $(game.card).appendTo($("div.game-board")); //add cards' div into html
    $(".card:last-child").addClass(game.cardClasses[i][1]); //add card-tech for new div apended to html
    bindCardClick($(".card:last-child"));
  }
  $("div.game-board").addClass(game.gridDisplayClass); //set grid for cards
  $("div.game-instruction").addClass("game-instruction__disappear"); //hide instruction
}

function startGame() {
  setCardsDisplayArray();
  setCardsDisplay();
  game.startButton = "End Game"; //change text for button
  updateTimerDisplay();
}

function restartGame() {
  clearGame();
  gameReset();
  $(".game-stats__score--value").text(game.score);
  selectLevel(game.level);
  startGame();
}

function clearGame() {
  $(".game-board").empty();
  $("div.game-board").removeClass(game.gridDisplayClass);
}

function handleCardFlip() {
  if (game.selectingCard !== null) {
    if (
      $(".card:eq(" + game.selectedCard + ")").attr("class") ===
        $(".card:eq(" + game.selectingCard + ")").attr("class") &&
      game.selectedCard !== game.selectingCard
    ) {
      unBindCardClick(game.selectedCard, game.selectingCard);
      updateScore();
      if (!game.cardsDisplay) {
        clearInterval(game.interval);
        setTimeout(() => nextLevel(), 1200);
      }
      clearSelectedCard();
    } else {
      $(".card").off("click touchstart");
      if (game.selectedCard !== game.selectingCard) {
        setTimeout(() => {
          flipBack();
        }, 1500);
      } else {
        flipBack();
      }
    }
  }
}

function clearSelectedCard() {
  game.selectingCard = null;
  game.selectedCard = null;
}

function flipBack() {
  $(".card:eq(" + game.selectedCard + ")").removeClass("card--flipped");
  $(".card:eq(" + game.selectingCard + ")").removeClass("card--flipped");
  bindCardClick($(".card"));
  clearSelectedCard();
}

function nextLevel() {
  game.level++;
  if (game.level === 4) {
    handleGameOver();
    restartGame();
    game.startButton = "End Game";
    $(".game-stats__button").text(game.startButton);
  } else {
    clearGame();
    setGame();
  }
}

function handleGameOver() {
  game.startButton = "Start Game";
  $(".game-stats__button").text(game.startButton);
  alert("Congratulations, your score is " + game.score);
  clearInterval(game.interval);
}

/*******************************************
/     UI update
/******************************************/
function updateScore() {
  game.cardsDisplay -= 2;
  game.score += game.level * game.timerDisplay;
  game.scoreDisplay = game.score;
  $(".game-stats__score--value").text(game.scoreDisplay);
}

function updateTimerDisplay() {
  game.timerDisplay = game.timer;
  $(".game-timer__bar")
    .text(game.timerDisplay + "s")
    .width((game.timerDisplay / game.timer) * 550);
  game.interval = setInterval(() => {
    game.timerDisplay--;
    $(".game-timer__bar")
      .text(game.timerDisplay + "s")
      .width((game.timerDisplay / game.timer) * 550);
    if (!game.timerDisplay) {
      handleGameOver();
    }
  }, 1000);
}

/*******************************************
/     bindings
/******************************************/
function bindStartButton() {
  $(".game-stats__button").click(event => {
    if (game.startButton === null) {
      // click start button first time
      startGame();
    } else if (game.startButton === "End Game") {
      handleGameOver();
    } else if (game.startButton === "Start Game") {
      restartGame();
    }
    $(".game-stats__button").text(game.startButton);
  });
  $(".game-stats__button").touchstart(event => {
    if (game.startButton === null) {
      // click start button first time
      startGame();
    } else if (game.startButton === "End Game") {
      handleGameOver();
    } else if (game.startButton === "Start Game") {
      restartGame();
    }
    $(".game-stats__button").text(game.startButton);
  });
}

function unBindCardClick(card1, card2) {
  $(".card:eq(" + card1 + ")").off("click touchstart");
  $(".card:eq(" + card2 + ")").off("click touchstart");
}

function bindCardClick(cardClick) {
  cardClick.on("click touchstart", function(event) {
    $(this).addClass("card--flipped"); //flip the card
    game.selectedCard == null
      ? (game.selectedCard = $(".card").index(this))
      : (game.selectingCard = $(".card").index(this));
    handleCardFlip();
  });
}
