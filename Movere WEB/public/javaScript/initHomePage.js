//https://movere-point.web.app/home.html
//
var currentURL = document.URL;
var currentTitle = document.title;
			
console.log("------URL current ", currentURL);
console.log("------title site ", currentTitle);

	
function socialShare() {
	var fbShare = document.getElementById("fbShare");
	var whatsappShare = document.getElementById("whatsappShare");
	var linkedInShare = document.getElementById("linkedInShare");
	var twitterShare = document.getElementById("twitterShare");	
	var vkShare = document.getElementById("vkShare");
	var okShare = document.getElementById("okShare");
	var telegramShare = document.getElementById("telegramShare");
			
	fbShare.onclick = function() {
		window.open("https://www.facebook.com/sharer.php?u="+currentURL,"","height=370,width=600,left=100,top=100,menubar=0");
		return false;
	}
				
	whatsappShare.onclick = function() {
		window.open("https://api.whatsapp.com/send?text="+currentURL+"&title="+currentTitle);
		return false;
	}
				
	linkedInShare.onclick = function() {
		window.open("https://www.linkedin.com/shareArticle?mini=true&url="+currentURL+"&title="+currentURL+"&summary=Hello&source=LinkedIn", "","height=500,width=800,left=100,top=100,menubar=0");
		return false;
	}	
				
	twitterShare.onclick = function() {
		window.open("https://twitter.com/intent/tweet?text="+currentTitle+"&url="+currentURL, "","height=370,width=600,left=100,top=100,menubar=0");
		return false;
	}
				
	vkShare.onclick = function() {
		window.open("http://vk.com/share.php?url="+currentURL+"&title="+currentTitle+"&comment=For FREEE!!!", "","height=370,width=600,left=100,top=100,menubar=0");			
		return false;
	}
				
	okShare.onclick = function() {
		window.open("https://connect.ok.ru/offer?url="+currentURL, "","height=370,width=600,left=100,top=100,menubar=0");						
		return false;
	}
				
	telegramShare.onclick = function() {
		window.open("https://t.me/share/url?url="+currentURL+"&text="+currentTitle+" for free!");
		return false;
	}
				
				//share url 
			/*	fbShare.setAttribute("href","http://www.facebook.com/sharer.php?u="+currentURL);
		//		whatsappShare.setAttribute("href", "https://api.whatsapp.com/send?text="+currentURL);
				linkedInShare.setAttribute("href","https://plus.google.com/share?url="+currentURL);
				instagramShare.setAttribute("href","whatsapp://send?text="+currentURL);
				twitterShare.setAttribute("href", "https://twitter.com/intent/tweet?text="+currentTitle+"&url="+currentURL);	
				vkShare.setAttribute("href","http://vkontakte.ru/share.php?url="+currentURL);
				okShare.setAttribute("href", "https://profitquery.com/add-to/odnoklassniki/?url="+currentURL);
				telegramShare.setAttribute("href","https://telegram.me/share/url?url="+currentURL+"&text="+currentTitle);
				*/
}


function startPage(){
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			
								
			var imgVar = user.photoURL;

			document.querySelector(".fir-clickcircle1").src = imgVar;
					
		} else {
				
		}
	});
}


window.onload = function() {
	startPage();
	socialShare();
}


