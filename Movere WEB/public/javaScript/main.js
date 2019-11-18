/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const MAX_USERS = 500;

var locations = [];
var prev_infowindow = false; 
var receiverId;
var receiverName;
var receiverToken;
var receiverPhoto;
var senderId;
var senderName;
var senderToken;
var senderPhoto;

function initMap() {
	// The location of Uluru
	var uluru = {lat: 33.344, lng: 35.036};
	// The map, centered at Uluru
	var map = new google.maps.Map(document.getElementById('map'), {zoom: 4, center: uluru});
		
	var markers = [];
	
	var i = 0;
	var db = firebase.firestore();

	
	db.collection("Users").limit(MAX_USERS).get()
	.then((querySnapshot) => {

		querySnapshot.forEach((doc) => {
		//	console.log(`${doc.id} ==> ${doc.data().userName}`);

			var contentString = 
			'<img src="' + doc.data().userUriPhoto + '" alt="icon" width="70" height="70">' +
			'<h6><b>'+doc.data().userName+'</b></h6>' + 
			'<p>' + doc.data().userTimeStamp.toDate() + '</p>';
			
			var iconUser = "";
			
			switch (doc.data().userTypeVehicle){
				case -1:
					iconUser = "img/icons/ic_hepl_me.png";
					break;
				
				case 0:
					iconUser = "img/icons/ic_child_friendly.png";
					break;
				
				case 1:
					iconUser = "img/icons/ic_motorcycle.png";
					break;
				
				case 2:
					iconUser = "img/icons/ic_directions_car.png";
					break;
				
				case 3:
					iconUser = "img/icons/ic_airport_shuttle.png";
					break;
			}

			var infowindow = new google.maps.InfoWindow({
				content: contentString,
				contactId: doc.id,
				contactName: doc.data().userName,
				contactPhoto: doc.data().userUriPhoto,
				contactToken: doc.data().userToken
			});
   
			var point = {lat: doc.data().l.latitude, lng: doc.data().l.longitude};
					
			var marker = new google.maps.Marker({
				position: point, 
				map: map, 
				icon: { 
					url: iconUser, 
					scaledSize: new google.maps.Size(21, 21)
				}
			});
			
			marker.addListener('click', function() {
				
				if( prev_infowindow ) {
					prev_infowindow.close();
				}

				prev_infowindow = infowindow;
				infowindow.open(map, marker);	
				console.log('click user ', infowindow.contactId);
				
				setInfoUserToChat(infowindow);
			});
			
			markers.push(marker);
		});
	})
	.then(() => {
		console.log('Successful');
				// Add a marker clusterer to manage the markers.
		var markerCluster = new MarkerClusterer(map, markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
	});
}

function setInfoUserToChat(infowindow){
	 // Get the signed-in user's profile pic and name.
	 
	receiverId = infowindow.contactId;
	receiverName = infowindow.contactName;
	receiverPhoto = infowindow.contactPhoto;
	receiverToken = infowindow.contactToken;
 //   var profilePicUrl = infowindow.userPhoto;
 //   var userName = infowindow.userName;

    // Set the user's profile pic and name.
    userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(receiverPhoto) + ')';
    userNameElement.textContent = receiverName;
	
	//clear list with messages
	var cnt = messageListElement.children.length;
	
	while (cnt-- != 1){
		messageListElement.removeChild(messageListElement.childNodes[cnt]);
	}
	
	var docRef = firebase.firestore().collection("Users").doc(senderId).collection("chat channels").doc(receiverId);

	docRef.get().then(function(doc) {
		if (doc.exists) {
			console.log("load chat room ", doc.data().channelId);
			
			loadMessages(doc.data().channelId);
		
		} else {
			// doc.data() will be undefined in this case
			console.log("No such chat room!");
		}
	}).catch(function(error) {
		console.log("Error getting document:", error);
	});
}

//selectList.removeAttribute('hidden');
//selectList.removeAttribute('hidden');
var contactsArray = [];
function getContacts(){
	
	var cnt = 0;

	console.log("getContacts senderId ", senderId);
	
	firebase.firestore().collection("Users").doc(senderId).collection("chat channels")
	.get().then(function(querySnapshot) {
		console.log("!!! size document! ", querySnapshot.size);
			
		if (querySnapshot.size > 0){
			document.getElementById("contactSelect").style.visibility = "visible";
			querySnapshot.forEach(function(doc) {
					
				firebase.firestore().collection("Users").doc(doc.id)
				.get().then(function(docUser) {
					if (docUser.exists) {
								
						contactsArray[cnt++] = {contactId: docUser.data().userId, 
												contactName: docUser.data().userName, 
												contactPhoto: docUser.data().userUriPhoto, 
												contactToken: docUser.data().userToken};
					
						if (contactsArray.length == querySnapshot.size){
							cnt = 1;
							for(var index in contactsArray) {
								selectList.options[cnt++] = new Option(contactsArray[index].contactName, index);
							}
								
							[].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {	
								new SelectFx(el);			
							});
						}				
					} else {
						// doc.data() will be undefined in this case
						console.log("No such document!");
					}
				}).catch(function(error) {
					console.log("Error getting document:", error);
				});
			});
		}
		else if (querySnapshot.size == 0){
			document.getElementById("contactSelect").style.visibility = "hidden";	
		}
	});
}

// Signs-in Friendly Chat.
function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

// Signs-out of Friendly Chat.
function signOut() {
  // Sign out of Firebase.
 // firebase.auth().signOut();
  
}

// Initiate firebase auth.
function initFirebaseAuth() {
  // Listen to auth state changes.
  firebase.auth().onAuthStateChanged(authStateObserver);
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  return firebase.auth().currentUser.photoURL || '/img/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

function getContactData(val){
	console.log('------getContactData------');
	console.log('-----', val, "---- ", contactsArray[val].contactId);
	
	setInfoUserToChat(contactsArray[val]);
}

// Saves a new message on the Cloud Firestore.
function saveMessage(messageText) {
	console.log('------saveMessage------');
	return checkChatRoom("TEXT", messageText);
//	return true;
}

// Saves a new message containing an image in Firebase.
// This first saves the image in Firebase storage.
function saveImageMessage(file) {
	return checkChatRoom("IMAGE", file);
}

function checkChatRoom(type, msg){
	console.log('------checkChatRoom------');
	console.log('type = ', type);
	console.log('msg = ', msg);
	
	var docRef = firebase.firestore().collection("Users").doc(senderId).collection("chat channels").doc(receiverId);

	return docRef.get().then(function(doc) {
		console.log('contact has chat ', doc.exists);
		if (doc.exists) {
			console.log('contact has chat');
			console.log("contact has chat ", doc.data().channelId);
		//	addMessageToChatRoom();
	//		idChatRoom = doc.data().channelId;
			if (type == "TEXT")
				saveMessageToChatRoom(msg, doc.data().channelId);
			else if (type == "IMAGE") 
				saveImageToChatRoom(msg, doc.data().channelId);
			
			setContactToUser(doc.data().channelId);
		
		} else {
			console.log("No such document!");
			createChatRoom(type, msg);
			
		}
	}).catch(function(error) {
		console.log("Error getting document:", error);
	});	
}

function saveImageToChatRoom(file, idChatRoom){
	console.log("---------------");
	console.log("---add image to chat room---",);
	console.log("receiverId = ", receiverId);
	console.log("senderId = ", senderId);
	console.log("senderName = ", senderName);
	console.log("file = ", file);
	console.log("idChatRoom = ", idChatRoom);
	console.log("time = ", firebase.firestore.Timestamp.fromDate(new Date()));
	console.log("---------------");

	//idChatRoom
	firestore.collection('Chatrooms').doc(idChatRoom).collection('messages').add({
		recipientId: receiverId,
		senderId: senderId,
		senderName: senderName,
		imagePath: "",
		time: firebase.firestore.Timestamp.fromDate(new Date()),
		type: "IMAGE"
	})
	.then(function(docRef) {
		
//		idChatRoom = docRef.id;	

		var filePath = "/" + firebase.auth().currentUser.uid + '/' + "messages" + '/' + file.name;
		
	//	console.log("image path: ", filePath);
		
		// Get a non-default Storage bucket

		return storage.ref(filePath).put(file).then(function(fileSnapshot) {
			// 3 - Generate a public URL for the file.
			return fileSnapshot.ref.getDownloadURL().then((url) => {
				sendNotification("IMAGE");
				// 4 - Update the chat message placeholder with the image’s URL.
				return docRef.update({
					imagePath: filePath
				});
			});
		});	
	})
	.catch(function(error) {
//		console.error("Error adding document: ", error);
	});	
}

//var idChatRoom;
function createChatRoom(type, msg){
	console.log("------createChatRoom------");
	console.log('type = ', type);
	console.log('msg = ', msg);
	
	firestore.collection('Chatrooms').add({
		userIds: [senderId, receiverId]
	})
	.then(function(docRef) {
		console.log("add doc to room ", docRef.id);
	//	idChatRoom = docRef.id;	
		
		if (type == "TEXT")
			saveMessageToChatRoom(msg, docRef.id);
		else if (type == "IMAGE") 
			saveImageToChatRoom(msg, docRef.id);
			
		setContactToUser(docRef.id);
		loadMessages(docRef.id);
		
		if (document.getElementById("contactSelect").style.visibility == "visible"){
			
			let arrSize = contactsArray.length;
			
			console.log("visible a list ", arrSize);
			
	//		contactsArray[arrSize] = {receiverId, receiverName, receiverPhoto, receiverToken};
			
		
		}else{
			console.log("not visible a list");
			getContacts();
		}
	})
	.catch(function(error) {
//		console.error("Error adding document: ", error);
	});
}

function saveMessageToChatRoom(message, idChatRoom){
	console.log("---------------");
	console.log("---add message to chat room---",);
	console.log("receiverId = ", receiverId);
	console.log("senderId = ", senderId);
	console.log("senderName = ", senderName);
	console.log("message = ", message);
	console.log("idChatRoom = ", idChatRoom);
	console.log("time = ", firebase.firestore.Timestamp.fromDate(new Date()));
	console.log("---------------");
	
	firestore.collection('Chatrooms').doc(idChatRoom).collection('messages').add({
		recipientId: receiverId,
		senderId: senderId,
		senderName: senderName,
		text: message,
		time: firebase.firestore.Timestamp.fromDate(new Date()),
		type: "TEXT"
	})
	.then(function(docRef) {
		console.log("add to message (is msg) ", docRef.id);
		
		sendNotification(message);
		
	})
	.catch(function(error) {
		console.error("Error adding document: ", error);
	});	
}

function sendNotification(message){
	const SERVER_API_KEY = "AAAAyXHpznk:APA91bHTE5M_WRswDPYKq3ezB09PsB6l5ytP3glzD1nWNJ4JlAL304VTq1sarqkI4FxUlJAuatBe5gjs4hXJ_C5i6gP5ptvbwrDQ02BJjJsxvYaGi4P8Ve-578zTJ_zuTm_yrfS8NQQn";
    const CONTENT_TYPE = "Content-Type";
    const APPLICATION_JSON = "application/json";
    const AUTHORIZATION = "Authorization";
    const AUTH_KEY = "key=" + SERVER_API_KEY;
    const FCM_URL = "https://fcm.googleapis.com/fcm/send";
/*
	const KEY_TO = "to";
    const KEY_NOTIFICATION = "notification";
    const KEY_TITLE = "title";
    const KEY_TEXT = "text";
    const KEY_DATA = "data";
    const KEY_USERNAME = "username";
    const KEY_UID = "uid";
    const KEY_FCM_TOKEN = "fcm_token";
*/
	var jsonData = {
		"to":receiverToken,
		"data":{
			"title":senderName,
			"text":message,
			"username":senderName,
			"uid":senderId,
			"fcm_token":senderToken
		}
	};
	
	/*
	var jsonData =	{
		  "message": {
			"token": "eEz-Q2sG8nQ:APA91bHJQRT0JJ..."
			"notification": {
			  "title": "Background Message Title",
			  "body": "Background message body"
			},
			"webpush": {
			  "fcm_options": {
				"link": "https://dummypage.com"
			  }
			}
		  }
		};
	
*/
	console.log("jsom data = ", jsonData);

	var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
	xmlhttp.open("POST", FCM_URL);
	xmlhttp.setRequestHeader(CONTENT_TYPE, APPLICATION_JSON);
	xmlhttp.setRequestHeader(AUTHORIZATION, AUTH_KEY);
	xmlhttp.send(JSON.stringify(jsonData));

	console.log("ajax send = ", xmlhttp);
}

function setContactToUser(idChatRoom){
	console.log("------setContactToUser------");
	
	firestore.collection('Users').doc(receiverId).collection('chat channels').doc(senderId).set({
		channelId: idChatRoom,
		isRead: true
	}).catch(function(error) {
		console.error('Error writing new message to Firebase Database', error);
	});
	
	firestore.collection('Users').doc(senderId).collection('chat channels').doc(receiverId).set({
		channelId: idChatRoom,
		isRead: false
	}).catch(function(error) {
		console.error('Error writing new message to Firebase Database', error);
	});
}

// Loads chat messages history and listens for upcoming ones.
function loadMessages(channelId) {
	console.log("---loadMessages---");
  // Create the query to load the last 12 messages and listen for new ones.
	var query = firebase.firestore().collection('Chatrooms').doc(channelId).collection('messages').orderBy('time', 'desc').limit(12);
  
	  // Start listening to the query.
	  query.onSnapshot(function(snapshot) {
		snapshot.docChanges().forEach(function(change) {
		  if (change.type === 'removed') {
			deleteMessage(change.doc.id);
		  } else {
			var message = change.doc.data();
			
			let linkImage = (message.imagePath) ? message.imagePath : "";
			let msg = (message.text) ? message.text : "";
			
			if (senderId == message.senderId){
				displayMessage(change.doc.id, message.time, message.senderName, msg, senderPhoto, linkImage);
			}else{
				displayMessage(change.doc.id, message.time, message.senderName, msg, receiverPhoto, linkImage);
			}			
		  }
		});
	  });
}

// Saves the messaging device token to the datastore.
function saveMessagingDeviceToken() {
  firebase.messaging().getToken().then(function(currentToken) {
    if (currentToken) {
      console.log('Got FCM device token:', currentToken);
      // Saving the Device Token to the datastore.
      firebase.firestore().collection('fcmTokens').doc(currentToken)
          .set({uid: firebase.auth().currentUser.uid});
    } else {
      // Need to request permissions to show notifications.
      requestNotificationsPermissions();
    }
  }).catch(function(error){
    console.error('Unable to get messaging token.', error);
  });
}

// Requests permissions to show notifications.
function requestNotificationsPermissions() {
  console.log('Requesting notifications permission...');
  firebase.messaging().requestPermission().then(function() {
    // Notification permission granted.
 //   saveMessagingDeviceToken();
  }).catch(function(error) {
    console.error('Unable to get permission to notify.', error);
  });
}

// Triggered when a file is selected via the media picker.
function onMediaFileSelected(event) {
  event.preventDefault();
  var file = event.target.files[0];

  // Clear the selection in the file picker input.
  imageFormElement.reset();

  // Check if the file is an image.
  if (!file.type.match('image.*')) {
    var data = {
      message: 'You can only share images',
      timeout: 2000
    };
    signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
    return;
  }
  // Check if the user is signed-in
  if (checkSignedInWithMessage()) {
    saveImageMessage(file);
  }
}

// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (messageInputElement.value && checkSignedInWithMessage()) {
    saveMessage(messageInputElement.value).then(function() {
      // Clear message text field and re-enable the SEND button.
      resetMaterialTextfield(messageInputElement);
      toggleButton();
    });
  }
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
	
 if (user) { // User is signed in!

	senderId = firebase.auth().currentUser.uid;
	senderName = firebase.auth().currentUser.displayName;
	senderPhoto = firebase.auth().currentUser.photoURL;
	
	firebase.firestore().collection("Users").doc(senderId)
	.get().then(function(doc) {
		if (doc.exists) {
			senderToken = doc.data().userToken;
		} else {
			// doc.data() will be undefined in this case
			console.log("No such document!");
		}
	}).catch(function(error) {
		console.log("Error getting document:", error);
	});

 
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    // Set the user's profile pic and name.
  //  userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
  //  userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    userNameElement.removeAttribute('hidden');
    userPicElement.removeAttribute('hidden');
    signOutButtonElement.removeAttribute('hidden');

    // Hide sign-in button.
    signInButtonElement.setAttribute('hidden', 'true');

    // We save the Firebase Messaging Device token and enable notifications.
	document.getElementById("userName").innerHTML = senderName;
	document.querySelector(".icon_user").src = senderPhoto;
	getContacts();
 //   saveMessagingDeviceToken();
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
	console.log('430 else');
    userNameElement.setAttribute('hidden', 'true');
    userPicElement.setAttribute('hidden', 'true');
    signOutButtonElement.setAttribute('hidden', 'true');

    // Show sign-in button.
    signInButtonElement.removeAttribute('hidden');
  }
}

// Returns true if user is signed-in. Otherwise false and displays a message.
function checkSignedInWithMessage() {
  // Return true if the user is signed in Firebase
  if (isUserSignedIn()) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
  return false;
}

// Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
}

// Template for messages.
var MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
    '</div>';

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
}

// A loading image URL.
var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

// Delete a Message from the UI.
function deleteMessage(id) {
  var div = document.getElementById(id);
  // If an element for that message exists we delete it.
  if (div) {
    div.parentNode.removeChild(div);
  }
}

// Displays a Message in the UI.
function displayMessage(id, timestamp, name, text, picUrl, imageUrl) {
	/*console.log('display id ', id);
	console.log('display timestamp ', timestamp);
	console.log('display name ', name);
	console.log('display text ', text);
	console.log('display imageUrl ', imageUrl);*/
	console.log('================');
	
  var div = document.getElementById(id);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', id);
    div.setAttribute('timestamp', timestamp);
    for (var i = 0; i < messageListElement.children.length; i++) {
      var child = messageListElement.children[i];
      var time = child.getAttribute('timestamp');
      if (time && time > timestamp) {
        break;
      }
    }
	
    messageListElement.insertBefore(div, child);
  }
  if (picUrl) {
    div.querySelector('.pic').style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(picUrl) + ')';
  }
  div.querySelector('.name').textContent = name;
  var messageElement = div.querySelector('.message');
  if (text) { // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
	

  } else if (imageUrl) { // If the message is an image.
  

	var storage = firebase.app().storage("gs://movere-point.appspot.com");
	//	var storage = firebase.storage();
	var pathReference = storage.ref(imageUrl);
				
	// Get the download URL
	pathReference.getDownloadURL().then(function(url) {
		// Insert url into an <img> tag to "download"
		//console.log("image url: ", url);
		
		var image = document.createElement('img');
		console.log('display image ', image);
		image.addEventListener('load', function() {
		  messageListElement.scrollTop = messageListElement.scrollHeight;
		});
	 //   image.src = imageUrl + '&' + new Date().getTime();
		image.src = url;
		messageElement.innerHTML = '';
		messageElement.appendChild(image);
					
	}).catch(function(error) {
		console.log("image error: ", linkImage);
	});
	
  }
  
  // Show the card fading-in and scroll to view the new message.
  setTimeout(function() {div.classList.add('visible')}, 1);
  messageListElement.scrollTop = messageListElement.scrollHeight;
  messageInputElement.focus();
  
}

// Enables or disables the submit button depending on the values of the input
// fields.  /4ybrsR3DmZeowNeabYOisYUGLhq1/messages/ic_directions_car.png
function toggleButton() {
  if (messageInputElement.value) {
    submitButtonElement.removeAttribute('disabled');
  } else {
    submitButtonElement.setAttribute('disabled', 'true');
  }
}

// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
}

// Checks that Firebase has been imported.
checkSetup();

// Shortcuts to DOM Elements.
var messageListElement = document.getElementById('messages');
var messageFormElement = document.getElementById('message-form');
var messageInputElement = document.getElementById('message');
var submitButtonElement = document.getElementById('submit');
var imageButtonElement = document.getElementById('submitImage');
var imageFormElement = document.getElementById('image-form');
var mediaCaptureElement = document.getElementById('mediaCapture');
var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
var signInButtonElement = document.getElementById('sign-in');
var signOutButtonElement = document.getElementById('sign-out');
var signInSnackbarElement = document.getElementById('must-signin-snackbar');
var selectList = document.getElementById("contactSelect");

// Saves message on form submit.
messageFormElement.addEventListener('submit', onMessageFormSubmit);
signOutButtonElement.addEventListener('click', signOut);
signInButtonElement.addEventListener('click', signIn);

// Toggle for the button.
messageInputElement.addEventListener('keyup', toggleButton);
messageInputElement.addEventListener('change', toggleButton);

// Events for image upload.
imageButtonElement.addEventListener('click', function(e) {
  e.preventDefault();
  mediaCaptureElement.click();
});
mediaCaptureElement.addEventListener('change', onMediaFileSelected);

// initialize Firebase
initFirebaseAuth();

// Remove the warning about timstamps change. 
var firestore = firebase.firestore();
var storage = firebase.app().storage("gs://movere-point.appspot.com");

// TODO: Enable Firebase Performance Monitoring.
firebase.performance();

// We load currently existing chat messages and listen to new ones.
//loadMessages();