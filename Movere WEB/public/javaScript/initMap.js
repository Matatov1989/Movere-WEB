
/*
var str1 = "";
var locations = [];
function initMap() {
	// The location of Uluru
	var uluru = {lat: 33.344, lng: 35.036};
	// The map, centered at Uluru
	var map = new google.maps.Map(
	document.getElementById('map'), {zoom: 4, center: uluru});
	// The marker, positioned at Uluru
	
	
	var i = 0;
	db = firebase.firestore();

	str1 += "<br>1";
	db.collection("Users").get().then((querySnapshot) => {
	
		querySnapshot.forEach((doc) => {
			console.log(`${doc.id} =++> ${doc.data().userName}`);
		

			location[i++] = {lat: doc.data().l.latitude, lng: doc.data().l.longitude};
			
			str1 += "<br>" + doc.id + " => " + location[i-1].lat;
			
		//	document.getElementById("p1").innerHTML = "";
		
			var contentString = 
			'<img src="' + doc.data().userUriPhoto + '" alt="icon">' +
			'<h6><b>'+doc.data().userName+'</b></h6>' + 
			'<p>' + doc.data().userTimeStamp.toDate() + '</p>';
			
			
	
			var infowindow = new google.maps.InfoWindow({
				content: contentString
			});

			    
			var point = {lat: doc.data().l.latitude, lng: doc.data().l.longitude};
			
			var marker = new google.maps.Marker({position: point, map: map});
			  
			marker.addListener('click', function() {
				infowindow.open(map, marker);
				window.open("chat.html", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
				
			});
						
		});
		str1 += "<br>3";
	});
	str1 += "<br>4";
}
*/
	 