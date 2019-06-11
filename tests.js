
function runAllTests(){
   console.log("running all tests");
   testShot();
   testGame();
   console.log("All test complete");
}



function testShot(){
   //Basic test of constructor and variables
   var shot1 = new Shot(1, 2);
   console.assert(shot1.pins == 1, "Test Shot: Pins not properly initialized")
   console.assert(shot1.frame == 2, "Test Shot: Frame not properly initialized")
   console.assert(shot1.points == 1, "Test Shot: Points not properly initialized")

   //Now test is Strike function
   var shot2 = new Shot(10, 1);
   console.assert(shot2.isStrike(), "Test Shot: isStrike() has failed to flag strike")
   console.assert(!shot1.isStrike(), "Test Shot: isStrike() has flaged false strike ")

   //Test isSpare
   var shot3 = new Shot(5, 2);
   var shot4 = new Shot(5, 2);
   var isSpare = Shot.isSpare(shot3, shot4);
   console.assert(isSpare, "Test Shot: isSpare() has failed to find spare")
   shot4.pins = 3;
   isSpare = Shot.isSpare(shot3, shot4);
   console.assert(isSpare, "Test Shot: isSpare() has flagged a false spare")
}

function testGame(){
   const rounds = 10
   var game1 = new Game(rounds)

   //var game1 = new Game(rounds);
   console.assert(game1.rounds == rounds, "Test Game: Rounds not properly initialized")
   console.assert(game1.shots.length == 0, "Test Game: Shots not properly initialized")
   console.assert(game1.frame == 1, "Test Game: Frames not properly initialized")

   //Test adding a shot
   game1.addShot(1)
   console.assert(game1.shots.length == 1, "Test Game: Did not add a new shot")
   console.assert(game1.frame == 1, "Test Game: Preemptive increase of frames")

   console.assert(game1.shots[0].points == 1, "Test Game: Failed to calculate points")


   //Test adding a second shot
   game1.addShot(9)
   console.assert(game1.shots.length == 2, "Test Game: Did not add a second shot")
   console.assert(game1.frame == 2, "Test Game: Preemptive increase of frames to 2")

   console.assert(game1.shots[0].points == 1, "Test Game: Failed to calculate spare points")
   console.assert(game1.shots[1].points == 9, "Test Game: Failed to calculate spare points")


   //Test adding a strike
   game1.addShot(10)
   console.assert(game1.shots.length == 3, "Test Game: Did not add a second shot")
   console.assert(game1.frame == 3, "Test Game: Preemptive increase of frames to 2")

   console.assert(game1.shots[0].points == 11, "Test Game: Failed to calculate points")
   console.assert(game1.shots[1].points == 9, "Test Game: Failed to calculate points")
   console.assert(game1.shots[2].points == 10, "Test Game: Failed to calculate points")


   //Test adding after a strike
   game1.addShot(7)
   console.assert(game1.shots.length == 4, "Test Game: Did not add a second shot")
   console.assert(game1.frame == 3, "Test Game: Preemptive increase of frames to 3")

   console.assert(game1.shots[0].points == 11, "Test Game: Failed to calculate points")
   console.assert(game1.shots[1].points == 9, "Test Game: Failed to calculate points")
   console.assert(game1.shots[2].points == 17, "Test Game: Failed to calculate points")
   console.assert(game1.shots[3].points == 7, "Test Game: Failed to calculate points")


   game1.addShot(1)
   console.assert(game1.shots.length == 5, "Test Game: Did not add a final shot")
   console.assert(game1.frame == 4, "Test Game: Preemptive increase of frames to 3")


   //Test Points
   game1.updatePoints()
   console.assert(game1.shots[0].points == 11, "Test Game: Failed to calculate points")
   console.assert(game1.shots[1].points == 9, "Test Game: Failed to calculate points")
   console.assert(game1.shots[2].points == 18, "Test Game: Failed to calculate points")
   console.assert(game1.shots[3].points == 7, "Test Game: Failed to calculate points")
   console.assert(game1.shots[4].points == 1, "Test Game: Failed to calculate points")


   //Test getShotsByFrame(f)
   var frame1 = game1.getShotsByFrame(1)
   console.assert(frame1[0].pins == 1, "Test Game: Failed to get shot 0 by frame 1")
   console.assert(frame1[1].pins == 9, "Test Game: Failed to get shot 1 by frame 1")
   console.assert(frame1.length == 2, "Test Game: Failed to get shot 0 by frame 1, returned " + frame1.length)

}
