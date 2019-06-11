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
         } else if (i < this.shots.length - 1 && Shot.sameFrame(shot, this.shots[i + 1])) {
            //Bonus points on spares are stored in the first shot of the frame
            shot.points = shot.pins;
            shot.points += this.shots[i + 2] ? this.shots[i + 2].pins : 0;
         }
      }
   }

   isGameOver(){
      if(this.frame <= this.rounds)
         return false

      //Determin if we are still playing the last round
      if(this.frame == this.rounds){
         var lastFrame = getShotsByFrame(this.rounds);
         if(lastFrame.length > 0 && lastFrame[0].isStrike){
            return lastFrame.length < 3
         } else {
            return lastFrame.length < 2
         }
      }

      //We should never get to this point but just in case
      return true;
   }


   getMaxPins(){
      var frames = this.getShotsByFrame(this.frame)
      console.log(frames);
      return frames[0] ? 10 - frames[0].pins : 10;
   }


}
