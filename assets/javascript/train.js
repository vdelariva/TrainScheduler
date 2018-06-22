// Initialize Firebase
var config = {
apiKey: "AIzaSyBHlBPO0K9PjBgqifP7qCMnXGUsZPvWGdw",
authDomain: "mosquito-3e7d2.firebaseapp.com",
databaseURL: "https://mosquito-3e7d2.firebaseio.com",
projectId: "mosquito-3e7d2",
storageBucket: "mosquito-3e7d2.appspot.com",
messagingSenderId: "157111617944"
};
firebase.initializeApp(config);

// Create a variable to reference the database
// const database = firebase.database().ref().child("schedule");
const database = firebase.database();

// Initial Values
var trainData = {

    trainName: "",
    destination: "",
    trainTime: "",
    frequency: 0,
    nextArrival: 0,
    minutesAway: 0,

}

// Capture Button Click
$("#submit").on("click", function(event) {
    event.preventDefault();
    console.log($("trainName").val())
    trainData.trainName = $("#trainName").val().trim();
    trainData.destination = $("#destination").val().trim();
    trainData.trainTime= $("#trainTime").val().trim();
    trainData.frequency = $("#frequency").val().trim();
 
    database.ref().push({
        trainName: trainData.trainName,
        destination: trainData.destination,
        trainTime: trainData.trainTime,
        frequency: trainData.frequency
    })
});

// When item added to database
database.ref().on("child_added", function(snapshot){       

    // Get the first train time, convert time format
    var time = moment(snapshot.val().trainTime,"HH:mm")

    console.log("Name: "+snapshot.val().trainName)
    console.log("trainTime: "+ moment(time).format("HH:mm"))
    console.log("Time"+time);
    console.log("now: "+moment().format("HH:mm"));

    // Calculate the time difference between now and the first train time
    var trainDiff = moment().diff(moment(time),"minutes");
    console.log("diff: "+trainDiff)

    // Use modulus operater to calculate the minutes to next train
    var remainder = trainDiff % snapshot.val().frequency
    console.log("remainder: "+remainder)

    var minToArrival;
    // If the first train of the day has not arrived, the remainder is the time for the next train arrival
    if (trainDiff < 0) {
        minToArrival = Math.abs(remainder);
    }
    // Otherwise, calculate arrival time by subtracting the remainder from the frequency
    else {
        minToArrival = snapshot.val().frequency - remainder;
    }
    console.log("Arrival: "+minToArrival)

    $("#schedule > tbody").append("<tr>" 
    + "<th scope='row'><i class='fas fa-train' style='color:#619B83'></i></th>"
    + "<td>" + snapshot.val().trainName + "</td>" 
    + "<td>" + snapshot.val().destination + "</td>" 
    + "<td>" + parseInt(snapshot.val().frequency) + "</td>" 
    + "<td>" + moment().add(minToArrival,"minutes").format("HH:mm") + "</td>"
    + "<td>" + minToArrival +  "</td>"
    + "<td><i class='far fa-edit edit'></i></td>"
    + "<td><i class='far fa-trash-alt trash'></i></tr>")

});

$(document).on("click",".edit", function(event) {
    console.log("edit");
});

$(document).on("click",".trash", function(event) {
    console.log("trash");
});


// <span class="fa-stack fa-2x">
//   <i class="fas fa-camera fa-stack-1x"></i>
//   <i class="fas fa-ban fa-stack-2x" style="color:Tomato"></i>
// </span>

// <span class="fa-stack fa-2x">
//   <i class="fas fa-square fa-stack-2x"></i>
//   <i class="fab fa-twitter fa-stack-1x fa-inverse"></i>
// </span>

// + "<span class='fa-stack fa-2x'>"
// +   "<i class='fas fa-square fa-stack-2x' style='color:#3bafba'></i>"
// +   "<i class='fas fa-train fa-stack-1x fa-inverse'></i>"
// + "</span>"

// <i class="far fa-edit"></i>
// <i class="far fa-trash-alt"></i>

// https://fontawesome.com/license