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


class Game {
   constructor(rounds){
      this.rounds = rounds; // How many frames to play the game
      this.shots = [];
      this.frame = 1;
   }
   //HELPER
   getShotsByFrame(f){
      return this.shots.filter(s=>s.frame == f);
   }

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

      this.shots.push(shot);
      this.updatePoints();
   }



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

   isGameOver(){
      if(this.frame < this.rounds)
         return false

      //Determin if we are still playing the last round
      if(this.frame == this.rounds){
         var lastFrame = this.getShotsByFrame(this.rounds);
         if(lastFrame[0]){
            if(lastFrame[0].isStrike())
               return lastFrame.length == 3
            else
               return lastFrame.length == 2
         } else {
            return false;
         }
      }
      return true; //this should never be called but just in case
   }

   isLastRound(){
      return this.rounds == this.frame
   }

   getMaxPins(){
      var frames = this.getShotsByFrame(this.frame)
      return frames[0] ? 10 - frames[0].pins : 10;
   }

}

const rounds = 10
var game1 = new Game(rounds)

for(var i = 1; i < rounds; i++){
   $("#frame-holder").append("<div class='card card-frame col-lg-2 col-md-3 col-sm-6 col-12' ><div class='card-body'><h5 class='card-title text-center'>Frame #" + i + "</h5><div class='row'><div class='form-group col-md-6'><label>Shot 1</label><p type='text' class='form-control shot-input' min='0' max='10' data-frame-id=" + i + "></div><div class='form-group col-md-6'><label>Shot 2</label><p type='text' class='form-control shot-input' min='0' max='10' data-frame-id=" + i + "></div></div><div class='form-group'><label class='score'>Score: </label></div></div></div>")
}
$("#frame-holder").append("<div class='card card-frame col-lg-2 col-md-3 col-sm-6 col-12' ><div class='card-body'><h5 class='card-title text-center'>Frame #" + rounds + "</h5><div class='row'><div class='form-group col-md-6'><label>Shot 1</label><p type='text' class='form-control final-shot-input' min='0' max='10' data-frame-id=" + rounds + "></div><div class='form-group col-md-6'><label>Shot 2</label><p type='text' class='form-control final-shot-input' min='0' max='10' data-frame-id=" + rounds + "></div><div class='form-group col-md-6'><label>Shot 3</label><p type='text' class='form-control final-shot-input' min='0' max='10' data-frame-id=" + rounds + "></div><div class='form-group col-md-6'><label class='score'>Score: </label></div></div></div>")




function addWarningPopup(message){
   var alert = $('#alert')
   alert.text(message)
   alert.slideDown("slow").delay(2000).slideUp("slow")
}

//Add a new shot to the game.
function addNewShot(){
   var pins = Number(document.getElementById('number-of-pins').value);
   var max = game1.getMaxPins();
   if(pins >= 0 && pins <= max){
      game1.addShot(pins);
      document.getElementById('number-of-pins').value = "";
      updateInputs();
      updateScores();
   } else if (pins < 0){
      //cannot have negative number of pins
      addWarningPopup("Must be above zero")
      document.getElementById('number-of-pins').value = 0;
   } else if (pins > max){
      //you only have max pins
      addWarningPopup("Sorry, you only have " + max + " pins on the board")
      document.getElementById('number-of-pins').value = max;
   } else {
      console.log(pins);
   }
}

//Update the shots in each frame
function updateInputs(){
   var shotsInputs = document.getElementsByClassName("shot-input");
   var isFirst = true;
   //Update all but the last frame
   for (var i = 0; i < shotsInputs.length; i++) {
      //now go through and update based on frames
      var frameID = shotsInputs[i].getAttribute("data-frame-id");
      var shots = game1.getShotsByFrame(frameID);
      //Update the input values based on whats in the game object
      if(shots.length > 0){
         if(isFirst){
            if(shots[0].isStrike())
               shotsInputs[i].innerHTML = "X"
            else
               shotsInputs[i].innerHTML = shots[0].pins;
            isFirst = false;
         } else {
            if(shots[0].isStrike() && !game1.isLastRound())
               shotsInputs[i].innerHTML = "-"
            else if(shots[1] && Shot.isSpare(shots[0], shots[1]))
               shotsInputs[i].innerHTML = "/"
            else if (shots[1])
               shotsInputs[i].innerHTML = shots[1].pins;
            else
               shotsInputs[i].innerHTML = ""

            isFirst = true;
         }
      } else {
         shotsInputs[i].innerHTML = ""
      }

   }

   //Now update the last frame
   shotsInputs = document.getElementsByClassName("final-shot-input");
   var shots = game1.getShotsByFrame(game1.rounds);

   if(shots[0]){
      if(shots[0].isStrike()){
         shotsInputs[0].innerHTML = 'X'
         //now fill in third
         if(shots[2]) {
            shotsInputs[2].innerHTML = shots[2].isStrike() ? 'X' : shots[2].pins
         }
      } else {
         shotsInputs[0].innerHTML = shots[0].pins
         shotsInputs[2].innerHTML = "-"
      }

      if(shots[1]){
         if(shots[1].isStrike())
            shotsInputs[1].innerHTML = "X"
         else if(Shot.isSpare(shots[0], shots[1]))
            shotsInputs[1].innerHTML = "/"
         else
            shotsInputs[1].innerHTML = shots[1].pins
      } else {
         shotsInputs[1].innerHTML = ""
      }
   } else {
      for (var i = 0; i < shotsInputs.length; i++) {
         shotsInputs[i].innerHTML = ""
      }
   }


}

//Update the score item on each frame
function updateScores(){
   var scoresInputs = document.getElementsByClassName("score");
   var total = 0;
   for (var i = 0; i < scoresInputs.length; i++) {
      var shots = game1.getShotsByFrame(i + 1);
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

function updateGameStatus(){
   if(game1.isGameOver()){
      document.getElementById("number-of-pins").disabled = true;
   } else {
      document.getElementById("number-of-pins").disabled = false;
   }
}

//Go through and remove all scores, reset the screen, and so on.
function resetGame(){
   game1 = new Game(10)
   updateAll();
}


function addRandomData(){
   while(!game1.isGameOver()){
      var max = game1.getMaxPins();
      var pins = Math.floor(Math.random() * max);
      game1.addShot(pins);
   }

   updateAll();
}

function updateAll(){
   updateGameStatus()
   updateScores()
   updateInputs()
}
