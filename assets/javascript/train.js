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
// Initialize minute interval counter
var minuteTimer = setInterval(minuteCountdown, 60000);
// var minuteTimer = setTimeout(minuteCountdown, 5000); // Used for testing
$("#currentDate").text(moment().format("MMMM Do YYYY, H:mm"));

function minuteCountdown() {
    // for each train added to the dom, decrement the minutes to train arrival
    $(".mins").each(function(){
        let curMinArrElement = $(this);  // create copy of 'this', it gets reassigned when reading from database
        let min = parseInt($(this).text());
        min--;
        if (min == 0){
            let currKey = curMinArrElement.attr("data-key")
            let trainRef=database.ref(currKey);
            trainRef.once("value", function(data){
                let time = moment(data.val().trainTime,"HH:mm");
                let frequency = data.val().frequency;
                let minToA = updateTrainTime(time,frequency); // Get minutes to next train arrival

                curMinArrElement.text(minToA); // Update minutes to arrival
                $(".arrTime[data-key="+currKey+"]").text(moment().add(minToA,"minutes").format("HH:mm")) // Update next train arrival time
            })
        }
        else {
            curMinArrElement.text(min);
        }
        $("#currentDate").text(moment().format("MMMM Do YYYY, H:mm")); // Update current date/time display
    })
}

// Capture Button Click
$("#submit").on("click", function(event) {
    event.preventDefault();
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
    displaySchedule(snapshot);
});

function displaySchedule (snapshot) {

        // Get the first train time, convert to UTC
        let time = moment(snapshot.val().trainTime,"HH:mm")
        let frequency = snapshot.val().frequency
        let minToA = updateTrainTime(time,frequency);
    
        // Display train entry
        $("#schedule > tbody").append("<tr id="+snapshot.key+">" 
        + "<th scope='row'><i class='fas fa-train' style='color:#619B83'></i></th>"
        + "<td>" + snapshot.val().trainName + "</td>" 
        + "<td>" + snapshot.val().destination + "</td>" 
        + "<td>" + parseInt(snapshot.val().frequency) + "</td>" 
        + "<td class='arrTime' data-key="+snapshot.key+">" + moment().add(minToA,"minutes").format("HH:mm") + "</td>"
        + "<td class='mins' data-key="+snapshot.key+">" + minToA +  "</td>"
        + "<td><i class='far fa-edit edit' data-key="+snapshot.key+"></i></td>"
        + "<td><i class='far fa-trash-alt trash' data-key="+snapshot.key+"></i></tr>")
}

$(document).on("click",".edit", function(event) {
    console.log("edit");
    // Ideally, I would have code here that would edit the entry
});

$(document).on("click",".trash", function(event) {
    console.log("trash");
    let currKey = $(this).attr("data-key");
    console.log("key: "+currKey);
    let trainRef=database.ref(currKey);
    trainRef.remove();
    $("#"+currKey).remove();
});

// Display next train time
// startTime:UTC, frequency: integer
function updateTrainTime (startTime,frequency) {

    // Calculate the time difference between now and the first train time
    var trainDiff = moment().diff(startTime,"minutes");

    // If trainDiff is negative: remainder = minutes to next train
    // If trainDiff is positive: remainder = minutes since last train
    var remainder = trainDiff % frequency;

    var minToArrival;
    if (trainDiff < 0) {
        minToArrival = Math.abs(remainder)+1;
    }
    else {
        minToArrival = frequency - remainder;
    }
    return(minToArrival);
    
}