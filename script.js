// css class for different card image
const CARD_TECHS = [
  'html5',
  'css3',
  'js',
  'sass',
  'nodejs',
  'react',
  'linkedin',
  'heroku',
  'github',
  'aws'
];

// only list out some of the properties,
// add more when needed
const game = {
  score: 0,
  level: 1,
  timer: 60,
  interval: null,                                                   // interval's number,uses for clear it
  cardsDisplay: 0,                                                  //display how many cards
  timerDisplay: null,
  scoreDisplay: null,
  levelDisplay: null,
  timerInterval: null,
  startButton: null,
  selectedCard: null,
  selectingCard: null,                                               
  cardClasses: [],                                                  //an array for storing selected card
  card: '<div class="card"><div class="card__face card__face--front"></div><div class="card__face card__face--back"></div></div>',
  gridDisplayClass: null,                                          //which grid class should be selected
  // and much more
};

setGame();

/*******************************************
/     resets
/******************************************/
function gameReset(){
  game.score = 0;
  game.level = 1;
  game.timer = 60;
  game.cardsDisplay = 0;                                                  //display how many cards
  game.timerDisplay = null;
  game.scoreDisplay = null;
  game.levelDisplay = null;
  game.timerInterval = null;
  game.startButton = null;
  game.selectedCard = null;
  game.selectingCard = null;                                               
  game.cardClasses = [];
  game.card = '<div class="card"><div class="card__face card__face--front"></div><div class="card__face card__face--back"></div></div>';
  game.gridDisplayClass = null;  
}

/*******************************************
/     game process
/******************************************/
function setGame() {
  // register any element in your game object
  selectLevel(game.level);
  if(game.level === 1){
    console.log('setgame',game);
      bindStartButton();
  }
  else {
    //clear
    $('.game-board').empty();
    //reset time
    game.timer = 60;
    //restart
    startGame();
  }

}

function selectLevel(level){
  game.levelDisplay = level;
  $('.game-stats__level--value').text(game.levelDisplay);
  switch(level){
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
  }
}

function setCardsDisplay(){                                                //make an array:cardClasses
  game.cardClasses = [];
  for(let i = 0; i < game.cardsDisplay; i++){
  game.cardClasses.push([]);
  game.cardClasses[i][0] = Math.random();
  game.cardClasses[i][1] = CARD_TECHS[Math.floor((i%20)/2)];
  game.cardClasses.sort((a,b) => a[0] - b[0]);
  }
}

function startGame() {
  setCardsDisplay();                                                                 
  for(let i = 0; i < game.cardsDisplay; i++){
    $(game.card).appendTo($('div.game-board'));                         //add cards' div into html
    $('.card:last-child').addClass(game.cardClasses[i][1]);             //add card-tech for new div apended to html
    bindCardClick($('.card:last-child'));
    }
  game.timer = 60;
  $('div.game-board').addClass(game.gridDisplayClass);                    //set grid for cards
  $('div.game-instruction').addClass('game-instruction__disappear');      //hide instruction
  updateTimerDisplay();
}

function handleCardFlip() {
  if(game.selectingCard !== null){
    if($('.card:eq(' + game.selectedCard + ')').attr('class') === $('.card:eq(' + game.selectingCard + ')').attr('class')){
      // console.log(game.selectedCard,$('.card:eq(' + game.selectedCard + ')').attr('class'));
      unBindCardClick(game.selectedCard,game.selectingCard);
      updateScore();
      game.cardsDisplay -= 2;
      if(!game.cardsDisplay){
        nextLevel();
      }
    } else {
      $('.card:eq(' + game.selectedCard + ')').removeClass('card--flipped');
      $('.card:eq(' + game.selectingCard + ')').removeClass('card--flipped');
    }
    game.selectingCard = null;
    game.selectedCard = null;
    // console.log(game.selectedCard,game.selectingCard);
  }
}

function nextLevel() {
  game.level++;
  if(game.level === 4){
    handleGameOver();
  } else {
    clearInterval(game.interval);
    setGame();
  }
}

function handleGameOver() {
  alert('Congratulations, your score is ' + game.score);
  clearInterval(game.interval);
}

/*******************************************
/     UI update
/******************************************/
function updateScore() {
  game.score += (game.level * game.timer);
  game.scoreDisplay = game.score;
  $('.game-stats__score--value').text(game.scoreDisplay);
}

function updateTimerDisplay() {
  game.interval = setInterval(() => {
    game.timer--;
    if(!game.timer){
      handleGameOver();
    }
    game.timerDisplay = game.timer + 's';
    $('.game-timer__bar').text(game.timerDisplay).width((game.timer/60) * 550);
  }, 1000);
}

/*******************************************
/     bindings
/******************************************/
function bindStartButton() {
  $('.game-stats__button').click(function(event){
    console.log('startbutton',game);
    if(game.startButton === null){                              // click start button first time
      console.log("start null");
      startGame();
      game.startButton = 'End Game'; 
      $(this).text(game.startButton);                             //change text for button
      // updateTimerDisplay();
    } else if (game.startButton === 'End Game'){
      handleGameOver()
      game.startButton = 'Start Game'; 
      $(this).text(game.startButton); 
    } else if (game.startButton === 'Start Game'){
      $('.game-board').empty();
      $('div.game-board').removeClass(game.gridDisplayClass); 
      gameReset();
      game.startButton = 'End Game'; 
      $(this).text(game.startButton); 
      selectLevel(game.level);
      $('.game-stats__score--value').text(game.score);
      $('.game-timer__bar').text(game.timer).width((game.timer/60) * 550);
      startGame();
    }    
  })
}

function unBindCardClick(card1,card2) {
  console.log($('.card:eq(' + card1 + ')'));
  $('.card:eq(' + card1 + ')').off("click");
  $('.card:eq(' + card2 + ')').off("click");
}

function bindCardClick(cardClick) {
  cardClick.on('click',function(event){
    $(this).addClass('card--flipped');                         //flip the card
    setTimeout(() => {
      (game.selectedCard == null) ? game.selectedCard = $('.card').index(this) : game.selectingCard = $('.card').index(this);
      // console.log("1",game.selectedCard,game.selectingCard);
      handleCardFlip();
    },500)
  })
}

