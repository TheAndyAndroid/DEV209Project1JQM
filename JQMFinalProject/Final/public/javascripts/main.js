let ExerciseArray = [];

let ExerciseObject = function (pDay, pType, pDuration, pSet, pRep, pHeart, pNotes) {
    this.ID = ExerciseArray.length + 1  // Math.random().toString(16).slice(2, 10); // Generates a random ID
    this.day = pDay;
    this.type = pType;
    this.duration = pDuration;
    this.set = pSet;
    this.rep = pRep;
    this.heart = pHeart;
    this.notes = pNotes;
};

function GetObjectPointer(localID) {
    return ExerciseArray.findIndex(exercise => exercise.ID === localID);
}

// Preload some recipes -- Now done on Server, not here
// RecipeArray.push(new RecipeObject("Chicken & Spinach Skillet Pasta", "American", "Medium", "https://www.eatingwell.com/recipe/267768/chicken-spinach-skillet-pasta-with-lemon-parmesan/"));
// RecipeArray.push(new RecipeObject("Spaghetti & Spinach with Sun-Dried Tomato", "Italian", "Easy", "https://www.eatingwell.com/recipe/7919563/spaghetti-spinach-with-sun-dried-tomato-cream-sauce/"));
// RecipeArray.push(new RecipeObject("One-Pot Garlicky Shrimp & Broccoli ", "Chinese", "Medium", "https://www.eatingwell.com/recipe/7919492/one-pot-garlicky-shrimp-broccoli/"));

let selectedDay = "Monday";

function createList() {
    let myul = document.getElementById("myul");
    myul.innerHTML = ""; // Clear existing list items

    $.get("/getAllExercises", function (data, status) { // AJAX get
        ExerciseArray = data; // copy returned server json data into local array
        // now INSIDE this “call back” anonymous function,
        // update the web page with this new data

        ExerciseArray.forEach(function (element) {
            let li = document.createElement('li');
            // Include the ID in the displayed text
            li.innerHTML = `<a href="#details" onclick="showDetails('${element.ID}')">${element.ID}: ${element.day}: ${element.type} - ${element.duration} - ${element.heart} beats per minute</a>`;
            myul.appendChild(li);
        });

        if ($("#myul").hasClass('ui-listview')) {
            $("#myul").listview('refresh');
        }
    });
}

function showDetails(localID) {
    let pointer = GetObjectPointer(localID);
    if (pointer !== -1) {
        let data = ExerciseArray[pointer];
        document.getElementById("theID").innerHTML = "ID: " + data.ID;
        document.getElementById("theDay").innerHTML = "Day of the Week: " + data.day
        document.getElementById("theType").innerHTML = "Type: " + data.type;
        document.getElementById("theDuration").innerHTML = "Duration: " + data.duration;
        document.getElementById("theSet").innerHTML = "Sets: " + data.set;
        document.getElementById("theRep").innerHTML = "Reps: " + data.rep;
        document.getElementById("theHeart").innerHTML = "Heart Rate: " + data.heart + " beats per minute";
        document.getElementById("theNotes").innerHTML = "Notes: " + data.notes;
        localStorage.setItem("localID", data.ID);
        $.mobile.changePage("#details");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let storedExercises = localStorage.getItem("recipes");
    if (storedExercises) {
        ExerciseArray = JSON.parse(storedExercises);
    }

    createList();

// add button events **************************************************************************************************************

document.getElementById("buttonAdd").addEventListener("click", function () {
    let typeInput = document.getElementById("typeInput").value;
    let durationInput = document.getElementById("durationInput").value;
    let setInput = document.getElementById("setInput").value;
    let repInput = document.getElementById("repInput").value;
    let heartInput = document.getElementById("heartInput").value;
    let notesInput = document.getElementById("notesInput").value;
    let exercise = new ExerciseObject(selectedDay, typeInput, durationInput, setInput, repInput, heartInput, notesInput);
    ExerciseArray.push(exercise);

    $.ajax({
        type: "POST",
        url: "/AddExercise",
        data: exercise,
        success: function(result){
            createList(); // Re-create the list to reflect the deletion
            $.mobile.navigate("#show");
            },
            error: function (xor, textSt, errorThrown) {
                alert("Server could not delete Exercise with ID " + ID);
                }
            });

    document.getElementById("typeInput").value = "";
    document.getElementById("durationInput").value = "";
    document.getElementById("setInput").value = "";
    document.getElementById("repInput").value = "";
    document.getElementById("heartInput").value = "";
    document.getElementById("notesInput").value = "";

    localStorage.setItem("exercises", JSON.stringify(ExerciseArray));
    
});

// button details page to delete
document.getElementById("delete").addEventListener("click", function () {
    let exerciseID = localStorage.getItem('localID');
    $.ajax({
    type: "DELETE",
    url: "/DeleteExercise/" +exerciseID,
    success: function(result){
        $.mobile.navigate("#show");
        createList(); // Re-create the list to reflect the deletion
        },
        
    error: function (xor, textSt, errorThrown) {
        alert("Server could not delete Exercise with ID " + exerciseID);
        }
    });
});


    document.getElementById("select-day").addEventListener("change", function () {
        selectedCuisine = this.value;
    });
});