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
var database = firebase.database();

// Initial Values
var objdata = {

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
    objdata.trainName = $("#trainName").val().trim();
    objdata.destination = $("#destination").val().trim();
    objdata.trainTime= $("#trainTime").val().trim();
    objdata.frequency = $("#frequency").val().trim();
 
    database.ref().push({
        trainName: objdata.trainName,
        destination: objdata.destination,
        trainTime: objdata.trainTime,
        frequency: objdata.frequency
    })
});

// When item added to database
database.ref().on("child_added", function(snapshot){       

    // var monthsWorked = moment().diff(moment(StartD), "months")
    // var monthlyR = parseInt(childsnapshot.val().MonthlyRate)

    $("#table > tbody").append("<tr> <td>" + snapshot.val().trainName + "</td>" 
    + "<td>" + snapshot.val().destination + "</td>" 
    + "<td>" + parseInt(snapshot.val().frequency) + "</td>" 
    + "<td>" + "09:00" + "</td>"
    + "<td>" + "45" +  "</td> </tr>")

});