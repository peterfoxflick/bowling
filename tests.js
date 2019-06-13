
function runAllTests(){
   console.log("Running all tests");
   testShot();
   testGame();
   testUI();
   console.log("All test complete");
   addWarningPopup("Open the console to see results.")

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
   console.assert(!isSpare, "Test Shot: isSpare() has flagged a false spare")
}

function testGame(){
   const rounds = 10
   var game1 = new Game(rounds)

   //var game1 = new Game(rounds);
   console.assert(game1.rounds == rounds,  "Test Game: Rounds not properly initialized")
   console.assert(game1.shots.length == 0, "Test Game: Shots not properly initialized")
   console.assert(game1.frame == 1,        "Test Game: Frames not properly initialized")

   //Test adding a shot
   game1.addShot(1)
   console.assert(game1.shots.length == 1, "Test Game: Did not add a new shot")
   console.assert(game1.frame == 1,        "Test Game: Preemptive increase of frames")

   console.assert(game1.shots[0].points == 1, "Test Game: Failed to calculate points")


   //Test adding a second shot
   game1.addShot(9)
   console.assert(game1.shots.length == 2, "Test Game: Did not add a second shot")
   console.assert(game1.frame == 2,        "Test Game: Preemptive increase of frames to 2")

   console.assert(game1.shots[0].points == 1, "Test Game: Failed to calculate spare points")
   console.assert(game1.shots[1].points == 9, "Test Game: Failed to calculate spare points")


   //Test adding a strike
   game1.addShot(10)
   console.assert(game1.shots.length == 3, "Test Game: Did not add a second shot")
   console.assert(game1.frame == 3,        "Test Game: Preemptive increase of frames to 2")

   console.assert(game1.shots[0].points == 11, "Test Game: Failed to calculate points")
   console.assert(game1.shots[1].points == 9,  "Test Game: Failed to calculate points")
   console.assert(game1.shots[2].points == 10, "Test Game: Failed to calculate points")


   //Test adding after a strike
   game1.addShot(7)
   console.assert(game1.shots.length == 4, "Test Game: Did not add a second shot")
   console.assert(game1.frame == 3,        "Test Game: Preemptive increase of frames to 3")

   console.assert(game1.shots[0].points == 11, "Test Game: Failed to calculate points")
   console.assert(game1.shots[1].points == 9,  "Test Game: Failed to calculate points")
   console.assert(game1.shots[2].points == 17, "Test Game: Failed to calculate points")
   console.assert(game1.shots[3].points == 7,  "Test Game: Failed to calculate points")


   game1.addShot(1)
   console.assert(game1.shots.length == 5, "Test Game: Did not add a final shot")
   console.assert(game1.frame == 4,        "Test Game: Preemptive increase of frames to 3")


   //Test Points
   game1.updatePoints()
   console.assert(game1.shots[0].points == 11, "Test Game: Failed to calculate points")
   console.assert(game1.shots[1].points == 9,  "Test Game: Failed to calculate points")
   console.assert(game1.shots[2].points == 18, "Test Game: Failed to calculate points")
   console.assert(game1.shots[3].points == 7,  "Test Game: Failed to calculate points")
   console.assert(game1.shots[4].points == 1,  "Test Game: Failed to calculate points")


   //Test getShotsByFrame(f)
   var frame1 = game1.getShotsByFrame(1)
   console.assert(frame1[0].pins == 1, "Test Game: Failed to get shot 0 by frame 1")
   console.assert(frame1[1].pins == 9, "Test Game: Failed to get shot 1 by frame 1")
   console.assert(frame1.length == 2, "Test Game: Failed to get shot 0 by frame 1, returned " + frame1.length)

}


function testUI(){
   resetGame()

   //Test shots output, and ability to add new shots via input
   document.getElementById('number-of-pins').value = 7
   addNewShot()
   console.assert(game.getShotsByFrame(1).length == 1, "Test UI: Failed to add new shot")

   //Test adding a spare
   document.getElementById('number-of-pins').value = 3
   addNewShot()
   var shotsOutputs = document.getElementsByClassName("shot-output");
   console.assert(game.getShotsByFrame(1).length == 2, "Test UI: Failed to add new shot")
   console.assert(shotsOutputs[1].innerHTML == "/", "Test UI: Failed to display spare")

   //Test adding a Strike
   document.getElementById('number-of-pins').value = 10
   addNewShot()
   var shotsOutputs = document.getElementsByClassName("shot-output");
   console.assert(game.getShotsByFrame(2).length == 1, "Test UI: Failed to add new shot")
   console.assert(shotsOutputs[2].innerHTML == "X", "Test UI: Failed to display strike")
   console.assert(shotsOutputs[3].innerHTML == "-", "Test UI: Failed to display strikes second shot")

   var scoresInputs = document.getElementsByClassName("score");
   console.assert(scoresInputs[0].innerHTML == "Score: 20", "Test UI: Failed to display score")
   console.assert(scoresInputs[1].innerHTML == "Score: 30", "Test UI: Failed to display score")
   console.assert(scoresInputs[2].innerHTML == "Score: ", "Test UI: Failed to display score")

   //Test adding illegal shots
   document.getElementById('number-of-pins').value = 5
   addNewShot()
   console.assert(game.getShotsByFrame(3).length == 1, "Test UI: Failed to add new shot")

   //Test adding a negative shot
   document.getElementById('number-of-pins').value = -3
   addNewShot()
   console.assert(game.getShotsByFrame(3).length == 1, "Test UI: Added negative shot")
   addNewShot()
   console.assert(game.getShotsByFrame(3).length == 2, "Test UI: Failed to provided alterenative to negative")
   console.assert(game.getShotsByFrame(3)[1].pins == 0, "Test UI: Failed to add empty shot")


   //Test adding illegal shots
   document.getElementById('number-of-pins').value = 5
   addNewShot()
   console.assert(game.getShotsByFrame(4).length == 1, "Test UI: Failed to add new shot")

   //Test adding a shot above maximum
   document.getElementById('number-of-pins').value = 7
   addNewShot()
   console.assert(game.getShotsByFrame(4).length == 1, "Test UI: Added abundant shot")
   addNewShot()
   console.assert(game.getShotsByFrame(4).length == 2, "Test UI: Failed to provided alterenative to pins exceeding max")
   console.assert(game.getShotsByFrame(4)[1].pins == 5, "Test UI: Failed to add spare")
}
