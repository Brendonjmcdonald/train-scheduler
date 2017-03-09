

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyC0fWQF8ZcqRKld03KMzvBb7ld7info9dA",
    authDomain: "train-scheduler-92cce.firebaseapp.com",
    databaseURL: "https://train-scheduler-92cce.firebaseio.com",
    storageBucket: "train-scheduler-92cce.appspot.com",
    messagingSenderId: "820191475454"
  };
  firebase.initializeApp(config);

  // Create a variable to reference the database
  var database = firebase.database();

  // Initial Variables (SET the first set IN FIREBASE FIRST)
  // Note remember to create these same variables in Firebase!
  var trainName = "";
  var destination = "";
  var frequency = "";
  var firstTrain = "";
  var nextArrival = "";
  var minutesAway = "";

    // Get snapshot of data
  database.ref().on("child_added", function(childSnapshot){

      // Append data to table as new children
          $("#train-table").append('<tr id="train"><td id="train-display"> ' +
          childSnapshot.val().trainName +
        '</td><td id="destination-display"> ' +
        childSnapshot.val().destination +
        '</td><td id="frequency-display">' +
        childSnapshot.val().frequency + 
        '</td><td id="next-arrival-display">' +
        childSnapshot.val().nextArrival +
        '</td><td id="minutes-away-display">' +
        childSnapshot.val().minutesAway +"</td><tr>");
        
  });

  // Click Button changes what is stored in firebase
  $("#click-button").on("click", function() {
    // Prevent the page from refreshing
    event.preventDefault();

    // Get inputs
    trainName = $("#train-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstTrain = $("#first-train-input").val().trim();
    frequency = $("#frequency-input").val().trim();
    
    // Clear fields
    $("#train-input").val(null);
    $("#destination-input").val(null);
    $("#frequency-input").val(null);
    $("#first-train-input").val(null);


    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(firstTimeConverted, "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    minutesAway = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    // Next Train
    nextArrival = moment().add(minutesAway, "minutes");
    console.log("ARRIVAL TIME: " + nextArrival.format("hh:mm"));
    nextArrival.format("hh:mm");



   // Push to firebase
    database.ref().push({
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        nextArrival: nextArrival.format("hh:mm"),
        minutesAway: minutesAway,
    });

});


