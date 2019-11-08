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
  cardsdisplay: 0,
  timerDisplay: null,
  scoreDisplay: null,
  levelDisplay: null,
  timerInterval: null,
  startButton: null,
  cardClasses: [],
  card: '<div class="card"><div class="card__face card__face--front"></div><div class="card__face card__face--back"></div></div>',
  gridDispalyClass:null,
  // and much more
};

setGame();

/*******************************************
/     game process
/******************************************/
function setGame() {
  // register any element in your game object
  switch(game.level){
    case 1:
        game.cardsdisplay = 4;
        game.gridDispalyClass = "game-board__level1";
        break;
    case 2:
        game.cardsdisplay = 16;
        game.gridDispalyClass = "game-board__level2";
        break;
    case 3:
        game.cardsdisplay = 36;
        game.gridDispalyClass = "game-board__level3";
        break;
  }
  bindStartButton();
  bindCardClick();
}

function setCardsDispaly(){
  game.cardClasses = [];
  for(let i = 0; i < game.cardsdisplay; i++){
  game.cardClasses.push([]);
  game.cardClasses[i][0] = Math.random();
  game.cardClasses[i][1] = CARD_TECHS[Math.floor((i%20)/2)];
  game.cardClasses.sort((a,b) => a[0] - b[0]);
  }
}

function startGame() {
  setCardsDispaly();
  console.log(game.cardClasses);                                                                   
    if(game.level = 1){
      for(let i = 0; i < game.cardsdisplay; i++){
        $(game.card).prependTo($('div.game-board'));                         //add cards' div into html
        $('.card:first-child').addClass(game.cardClasses[i][1]);             //add card-tech for new div apended to html
      }
      $('div.game-board').addClass(game.gridDispalyClass);                    //set grid for cards
    }
    game.startButton = 'endgame'; 
    $('div.game-instruction').addClass('game-instruction__disappear');      //hide instruction
}

function handleCardFlip() {
  console.log('object');
}

function nextLevel() {}

function handleGameOver() {
  alert('Congratulations, your score is ' + game.score);
  clearInterval(game.interval);
}

/*******************************************
/     UI update
/******************************************/
function updateScore() {}

function updateTimerDisplay() {
    game.interval = setInterval(() => {
    game.timer--;
    if(!game.timer){
      handleGameOver();
    }
    game.timerDisplay = game.timer + 's';
    $('.game-timer__bar').text(game.timerDisplay);
    $('.game-timer__bar').width((game.timer/60) * 550);
  }, 1000);
}

/*******************************************
/     bindings
/******************************************/
function bindStartButton() {
  $('.game-stats__button').click(function(event){
    if(game.startButton === null){                              // click start button first time
          startGame();
          $(this).text('End Game');                             //change text for button
          updateTimerDisplay();
    }                 
  })
}

function unBindCardClick(card) {}

function bindCardClick() {
  $(document).on('click','.card',function(event){
    $(this).addClass('card--flipped');                          //flip the card
    handleCardFlip();
  })
}
