/******************************************************
 Class: Shot
 Holds the basic data for a shot at the pins, or a
 bowling ball knocking over pins.
 pins: the number of pins hit (unchanged)
 frame: the frame in which this shot was taken
   (unchanged).
 points: the number of points recived for this shot
   (dynamic).
 ******************************************************/
class Shot {
   constructor(pins, frame){
      // pins will be the number of pins hit by the player
      // points will store how many points the user recives
      console.assert(pins <= 10, "Error: Cannot have more than 10 pins in a single shot")

      this.pins = Number(pins);
      this.frame = Number(frame);
      this.points = Number(pins);
   }

   isStrike(){
      return this.pins == 10;
   }

   static isSpare(shot1, shot2) {
      console.assert(shot1.frame == shot2.frame, "Error: Cannot compaire shots from two different frames")
      return shot1.pins + shot2.pins == 10;
   }

   static sameFrame(shot1, shot2){
      return shot1.frame == shot2.frame;
   }
}

/******************************************************
 Class: Game
 Data for a game being played. Mostly used to hold the
 array of shots taken in a game and apply appropriate
 logic.
 rounds: How many frames are in the game
 shots: array of shots taken durrring the game up to
  the current point.
 frame: the current frame of play
 ******************************************************/
class Game {
   constructor(rounds){
      this.rounds = rounds; // How many frames to play the game
      this.shots = [];
      this.frame = 1;
   }

   /**************************************
    game.getShotsByFrame( f )
    returns the shots in a given frame 'f'
    **************************************/
   getShotsByFrame(f){
      return this.shots.filter(s=>s.frame == f);
   }


   /**************************************
    game.addShot(pins)
    adds a new shot to the array of shots
    with the given number of 'pins'
    **************************************/
   addShot(pins){
      // Create a new shot
      var shot = new Shot(pins, this.frame)
      //Determin if the frame number needs to increase
      if(this.rounds != this.frame){
         if(shot.isStrike())
            this.frame++
         else if (this.shots.length > 0 && (this.shots[this.shots.length-1]).frame == this.frame)
            this.frame++
      }
      //add the shot to the array
      this.shots.push(shot);
      //Update the points on all shots
      this.updatePoints();
   }


   /**************************************
    game.updatePoints()
    Go through each shot and determin how
    many points are given. Bonus points
    are stored in the first shot of a
    frame.
    **************************************/
   updatePoints(){
      for(var i = 0; i < this.shots.length; i++){
         var shot = this.shots[i]
         //first take care of Strikes
         if(shot.isStrike()){
            shot.points = shot.pins;
            //add next shot
            shot.points += this.shots[i + 1] ? this.shots[i + 1].pins : 0;
            //add second next shot
            shot.points += this.shots[i + 2] ? this.shots[i + 2].pins : 0;
         } else if (i < this.shots.length - 1 && Shot.sameFrame(shot, this.shots[i + 1]) && Shot.isSpare(shot, this.shots[i + 1])) {
            //Bonus points on spares are stored in the first shot of the frame
            shot.points = shot.pins;
            shot.points += this.shots[i + 2] ? this.shots[i + 2].pins : 0;
         } else {
            shot.points = shot.pins;
         }
      }
   }

   /**************************************
    game.isGameOver()
    determin if the game is still being
    played or if it is over.
    **************************************/
   isGameOver(){
      if(this.frame < this.rounds)
         return false

      //Determin if we are still playing the last round
      if(this.isLastRound()){
         var shots = this.getShotsByFrame(this.rounds);
         var round = shots.length + 1; // 1 2 or 3
         switch(round) {
            case 1:
            case 2:
               return false;
            case 3:
               if(shots[0].isStrike() || Shot.isSpare(shots[0], shots[1]))
                  return false
               return true
            default:
               return true
         }
      }
      return true; //this should never be used but in case it does.
   }

   /**************************************
    game.isLastRound()
    if the current frame is the last one
    **************************************/
   isLastRound(){
      return this.rounds === this.frame
   }

   /**************************************
   game.getMaxPins()
   get the number of pins left on the
   alley.
   **************************************/
   getMaxPins(){
      if(this.isLastRound()){
         var shots = this.getShotsByFrame(this.rounds);
         var round = shots.length + 1; // 1 2 or 3
         switch(round) {
            case 1:
               return 10;
            case 2:
               if(shots[0].isStrike())
                  return 10;
               return 10 - shots[0].pins;
            case 3:
               if(shots[0].isStrike() && !shots[1].isStrike())
                  return 10 - shots[1].pins;
               return 10
            default:
               return 10
         }

      }


      var shots = this.getShotsByFrame(this.frame)
      return shots[0] ? 10 - shots[0].pins : 10;
   }

}


/******************************************************
 loadGame()
 add the frames to the webpage, and set up the 'game'
 variable. 'game' is used as a global variable, this
 helps make it easier than passing it arround everwhere.
 ******************************************************/
var game;
function loadGame(){
   //Initalize the game
   const rounds = 10
   game = new Game(rounds)

   //set up the various frames
   for(var i = 1; i < rounds; i++){
      $("#frame-holder").append("<div class='card card-frame col-lg-2 col-md-3 col-sm-6 col-12' ><div class='card-body'><h5 class='card-title text-center'>Frame #" + i + "</h5><div class='row'><div class='form-group col-md-6'><label>Shot 1</label><p type='text' class='form-control shot-output' min='0' max='10' data-frame-id=" + i + "></div><div class='form-group col-md-6'><label>Shot 2</label><p type='text' class='form-control shot-output' min='0' max='10' data-frame-id=" + i + "></div></div><div class='form-group'><label class='score'>Score: </label></div></div></div>")
   }

   //add the last frame
   $("#frame-holder").append("<div class='card card-frame col-lg-2 col-md-3 col-sm-6 col-12' ><div class='card-body'><h5 class='card-title text-center'>Frame #" + rounds + "</h5><div class='row'><div class='form-group col-md-6'><label>Shot 1</label><p type='text' class='form-control final-shot-output' min='0' max='10' data-frame-id=" + rounds + "></div><div class='form-group col-md-6'><label>Shot 2</label><p type='text' class='form-control final-shot-output' min='0' max='10' data-frame-id=" + rounds + "></div><div class='form-group col-md-6'><label>Shot 3</label><p type='text' class='form-control final-shot-output' min='0' max='10' data-frame-id=" + rounds + "></div><div class='form-group col-md-6'><label class='score'>Score: </label></div></div></div>")

   $(document).on('keypress',function(e) {
       if(e.which == 13) {
           addNewShot();
       }
   });

}


/******************************************************
 addWarningPopup(message)
 displays the 'message' in the warning pop up dialog.
 ******************************************************/
function addWarningPopup(message){
   var alert = $('#alert')
   alert.text(message)
   alert.slideDown("slow").delay(2000).slideUp("slow")
}


/******************************************************
 addNewShot(message)
 Adds a shot to the game from the input field. The
 varification is done at this step and not deeper in
 the data since all of the code is running client side,
 and further checks would have been redundant.
 ******************************************************/
function addNewShot(){
   //get the pins and max amount
   var pins = Number(document.getElementById('number-of-pins').value);
   var max = game.getMaxPins();
   //determin if it is a legal operation
   if(pins >= 0 && pins <= max){
      game.addShot(pins);
      document.getElementById('number-of-pins').value = "";
   } else if (pins < 0){
      //cannot have negative number of pins
      addWarningPopup("Must be above zero")
      document.getElementById('number-of-pins').value = 0;
   } else if (pins > max){
      //you only have max pins
      addWarningPopup("Sorry, you only have " + max + " pins on the board")
      document.getElementById('number-of-pins').value = max;
   } else {
      //This should not happen, but might if the input is not a number
      // which it cant be.
      console.log(pins);
   }
   updateAll();
}

/******************************************************
 updateInputs()
 Go through each output and get the appropriate number
 of pins knocked donw. Since the last frame has three
 and special rules it is taken care of sepreatly.
 ******************************************************/
function updateInputs(){
   var shotsOutputs = document.getElementsByClassName("shot-output");
   var isFirst = true;
   //Update all but the last frame
   for (var i = 0; i < shotsOutputs.length; i++) {
      //now go through and update based on frames
      var frameID = shotsOutputs[i].getAttribute("data-frame-id");
      var shots = game.getShotsByFrame(frameID);
      //Update the input values based on whats in the game object
      if(shots.length > 0){
         if(isFirst){   //alternate with the two shots per frame
            if(shots[0].isStrike())
               shotsOutputs[i].innerHTML = "X"
            else
               shotsOutputs[i].innerHTML = shots[0].pins;
            isFirst = false;
         } else {
            if(shots[0].isStrike() && !game.isLastRound())
               shotsOutputs[i].innerHTML = "-"
            else if(shots[1] && Shot.isSpare(shots[0], shots[1]))
               shotsOutputs[i].innerHTML = "/"
            else if (shots[1])
               shotsOutputs[i].innerHTML = shots[1].pins;
            else
               shotsOutputs[i].innerHTML = ""

            isFirst = true;
         }
      } else {
         shotsOutputs[i].innerHTML = ""
      }

   }

   //Now update the last frame
   shotsOutputs = document.getElementsByClassName("final-shot-output");
   var shots = game.getShotsByFrame(game.rounds);
   //fill in each shot with the appropriate data.
   if(shots[0]){
      if(shots[0].isStrike()){
         shotsOutputs[0].innerHTML = 'X'
         //now fill in the third
         if(shots[2]) {
            shotsOutputs[2].innerHTML = shots[2].isStrike() ? 'X' : shots[2].pins
         }
      } else {
         shotsOutputs[0].innerHTML = shots[0].pins
         shotsOutputs[2].innerHTML = "-"
      }

      //now fill in the second shot
      if(shots[1]){
         if(shots[1].isStrike())
            shotsOutputs[1].innerHTML = "X"
         else if(Shot.isSpare(shots[0], shots[1])){
            shotsOutputs[1].innerHTML = "/"
            if(shots[2])
               shotsOutputs[2].innerHTML = shots[2].isStrike() ? 'X' : shots[2].pins
         } else
            shotsOutputs[1].innerHTML = shots[1].pins
      } else {
         shotsOutputs[1].innerHTML = ""
      }
   } else {
      for (var i = 0; i < shotsOutputs.length; i++) {
         shotsOutputs[i].innerHTML = "" //set everthing back to empty
      }
   }
}

/******************************************************
 updateScores()
 Have the score on each frame properly represent the
 score earned up to that frame.
 ******************************************************/
function updateScores(){
   var scoresInputs = document.getElementsByClassName("score");
   var total = 0;
   for (var i = 0; i < scoresInputs.length; i++) {
      var shots = game.getShotsByFrame(i + 1);
      if(shots.length){
         var score = shots[0] ? shots[0].points : 0;
         score += shots[1] ? shots[1].points : 0;
         total += score;
         scoresInputs[i].innerHTML = "Score: " + total;
      } else {
         scoresInputs[i].innerHTML = "Score: "
      }
   }
}

/******************************************************
 updateGameStatus()
 Determin if the user can still input more shots.
 ******************************************************/
function updateGameStatus(){
   if(game.isGameOver()){
      document.getElementById("number-of-pins").disabled = true;
   } else {
      document.getElementById("number-of-pins").disabled = false;
   }
}

/******************************************************
 resetGame()
 Remove all data and clear the page.
 ******************************************************/
function resetGame(){
   game = new Game(10)
   updateAll();
}

/******************************************************
 addRandomData()
 Fill the page with random data, very helpful for
 testing.
 ******************************************************/
function addRandomData(){
   resetGame()
   while(!game.isGameOver()){
      var max = game.getMaxPins() + 1;
      var pins = Math.floor(Math.random() * max);
      game.addShot(pins);
   }
   updateAll();
}

/******************************************************
 updateAll()
 Call all the various update functions.
 ******************************************************/
function updateAll(){
   updateGameStatus()
   updateScores()
   updateInputs()
}
