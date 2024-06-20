var express = require('express');
var router = express.Router();
var fs = require("fs");


var app = express();


// start by creating data so we don't have to type it in each time
let ServerExerciseArray = [];

// define a constructor to create recipe objects
let ExerciseObject = function (pDay, pType, pDuration, pSet, pRep, pHeart, pNotes) {
    this.ID =  ServerExerciseArray.length + 1 // Generates the ID in the List
    this.day = pDay;
    this.type = pType;
    this.duration = pDuration;
    this.set = pSet;
    this.rep = pRep;
    this.heart = pHeart;
    this.notes = pNotes;
};

// add route for delete
router.delete('/DeleteExercise/:ID', (req, res) => {
  const delID = req.params.ID;
  let pointer = GetObjectPointer(delID);

   if(pointer == -1) {  // if did nt find movie in array
    console.log("not found");
    return res.status(500).json({
        status: "error - no such ID"
    });

  } else {  // if did find the recipe
    ServerExerciseArray.splice(pointer, 1);  // remove 1 element at index
    fileManager.write();
    res.send('Exercise with ID: ' + delID + ' deleted!');
  }
});

function GetObjectPointer(localID) {
    return ServerExerciseArray.findIndex(exercise => exercise.ID === localID);
}

// var fs = require("fs"); // relocate to line 3

let fileManager = {
  read: function() {
    var rawdata = fs.readFileSync('objectdata.json');
    let goodData = JSON.parse(rawdata);
    ServerExerciseArray = goodData;
  },

  write: function() {
    let data = JSON.stringify(ServerExerciseArray);
    fs.writeFileSync('objectdata.json', data);
  },

  validData: function() {
    var rawdata = fs.readFileSync('objectdata.json');
    console.log(rawdata.length);
    if(rawdata.length < 1) {
      return false;
    }
    else {
      return true;
    }
  }
};

if(!fileManager.validData()) {
ServerExerciseArray.push(new ExerciseObject("Monday", "Pushups", "30 minutes", "15", "3", "123", "Lower Sets and increase Reps"));
ServerExerciseArray.push(new ExerciseObject("Tuesday", "Squats", "20 minutes", "3", "30", "121", "Need to go longer"));
ServerExerciseArray.push(new ExerciseObject("Wednesday", "Weight Lifting", "45 minutes", "5", "15", "147", "Need to increase weight"));
fileManager.write();
}

else {
  fileManager.read(); // do have prior exercises so load up the array
  }

console.log(ServerExerciseArray);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
})

/* GET all Recipe data */
router.get('/getAllExercises', function(req, res) {
  fileManager.read()
  res.status(200).json(ServerExerciseArray);
})

/* Add one new recipe */
router.post('/AddExercise', function(req, res) {
  const newExercise = req.body;
  ServerExerciseArray.push(newExercise);
  fileManager.write();
  res.status(200).json(newExercise);
});

module.exports = router;