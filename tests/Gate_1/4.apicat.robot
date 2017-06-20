*** Settings ***
Library		Selenium2Library
Suite Setup 	Go to homepage
Suite Teardown 	Close All Browsers

*** Variables ***
${BROWSER} 	chrome
${HOMEPAGE} 	http://localhost:3000

*** Test Cases ***
login to apinf
	Go to login
	Login to apinf	asdas	asdasd
	confirm page loaded 	Users

Go to api catalog
	Go to api catalog
	confirm page loaded 	Kappa

Filter my apis
	Show my apis
	confirm page loaded	Kissa
	Page Should Not Contain	Kappa

Filter my bookmarks
	Show my bookmarks
	Page Should Not Contain	Kissa

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

Go to api catalog
	Click Element	id=frontpage-button
	Click Element	id=apis-button

Show my apis
	Click Element	id=filterBy-my-apis

Show my bookmarks
	Click Element	id=filterBy-my-bookmarks

confirm page loaded
	[Arguments] 	${searchkey}
	Wait Until Page Contains 	${searchkey}

Logout of apinf
	Click Element 	id=footer-signout