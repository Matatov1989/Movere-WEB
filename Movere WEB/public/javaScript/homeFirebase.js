
var lat = 0;
var lon = 0;
var geoH;
/*
function startPage(){
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			
								
			var imgVar = user.photoURL;

			document.querySelector(".fir-clickcircle1").src = imgVar;
					
		} else {
				
		}
	});
}
*/
function checkUser(){
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			window.location.href = "maps.html";
		} else {
			// No user is signed in.
			//		alert("You need to auth");
					
			//			var txt;
			var btnOK = confirm("Для продолжения необходима регистрация!\nПродолжить?");
			if (btnOK == true) {
				//		txt = "You pressed OK!";
				authUser();
			} else {
				txt = "You pressed Cancel!";
			//	window.location.href = "";
				window.location.replace("home.html");
			}
		}
	});
}

function authUser(){
	console.log("authUser");
	getLocation();
	var provider = new firebase.auth.GoogleAuthProvider();
		
	firebase.auth().signInWithPopup(provider).then(function(result) {
		
		var token = result.credential.accessToken;
		var user = result.user;
		
		addUserToFirestore(user, token);
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// The email of the user's account used.
		var email = error.email;
		// The firebase.auth.AuthCredential type that was used.
		var credential = error.credential;
	});
}

function addUserToFirestore(user, token){
	var db = firebase.firestore();
	db.collection("Users").doc(user.uid).set({
		userId: user.uid,
		userName: user.displayName,
		userUriPhoto: user.photoURL,
		userToken: token,
		userTypeVehicle: 0,
		userTimeStamp: firebase.firestore.FieldValue.serverTimestamp(),
		g: geoH,
		l: new firebase.firestore.GeoPoint(lat, lon)
	})
	.then(function() {
		console.log("USER Document successfully written!");
	//	window.location.href = "maps.html";
	})
	.catch(function(error) {
		console.error("Error writing document: ", error);
	});
}

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.watchPosition(showPosition);
	} else { 
	
	}
}

function showPosition(position) {
	lat = position.coords.latitude;
	lon = position.coords.longitude;		
	geoH = Geohash.encode(lat, lon, 10);
}