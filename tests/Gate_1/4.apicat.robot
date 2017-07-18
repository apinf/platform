*** Settings ***
Library		Selenium2Library
Suite Setup 	Go to homepage
Suite Teardown 	Close All Browsers

*** Variables ***
${BROWSER} 	chrome
${HOMEPAGE} 	http://localhost:3000

*** Test Cases ***
Login to apinf
	confirm page loaded	Users
	Go to login
	Login to apinf	asdas	asdasd
	confirm page loaded 	Users
	#Page Should Not Contain	Add API

APIs sorting
	Go to api catalog
	confirm page loaded 	asd
	apis sorting

Filter my apis
	Go to api catalog
	confirm page loaded 	asd
	Show my apis
	Location Should Contain	By=my-apis
	Page Should Not Contain	Kappa

Filter my bookmarks
	Go to api catalog
	confirm page loaded 	asd
	Show my bookmarks
	Location Should Contain	By=my-bookmarks
	Page Should Not Contain	Kappa

*** Keywords *** 
Go to homepage
	Open Browser	${HOMEPAGE} 	${BROWSER}

Go to login
	confirm page loaded	Users
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

Apis sorting
	Select From List By Value	id=sort-select	bookmarkCount
	Location Should Contain	By=bookmark
	Click Element	id=sortDirection-descending
	Location Should Contain	Direction=descending
	Select From List By Value	id=sort-select	created_at
	Location Should Contain	By=created
	Click Element	id=sortDirection-ascending
	Location Should Contain	Direction=ascending
	Select From List By Value	id=sort-select	averageRating
	Location Should Contain	By=average
	Select From List By Value	id=sort-select	name
	Location Should Contain	By=name

Show my apis
	Click Element	id=filterBy-my-apis

Show my bookmarks
	Click Element	id=filterBy-my-bookmarks

confirm page loaded
	[Arguments] 	${searchkey}
	Wait Until Page Contains 	${searchkey}

Logout of apinf
	Click Element 	id=footer-signout