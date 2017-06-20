*** Settings ***
Library		Selenium2Library
Suite Setup 	Go to homepage
Suite Teardown 	Close All Browsers

*** Variables ***
${BROWSER} 	chrome
${HOMEPAGE} 	http://localhost:3000
${APIS}	https://nightly.apinf.io:3002/googol/
*** Test Cases ***
Login to apinf
	Go to login
	Login to apinf	asdas	asdasd

Go to api url
	Go to api page
	confirm page loaded	Gmail

*** Keywords *** 
Go to homepage
	Open Browser	${HOMEPAGE} 	${BROWSER}

Go to login
	Click Element 	id=frontpage-button
	Click Element	id=signin-button

Login to apinf	
	[Arguments]	${username}	${password}
	Input Text	id=at-field-username_and_email	${username}
	Input Password 	id=at-field-password	${password}
	Click Button	id=at-btn

Go to api page
	Go To	${APIS}

confirm page loaded
	[Arguments] 	${searchkey}
	Wait Until Page Contains 	${searchkey}

Logout of apinf
	Click Element 	id=footer-signout