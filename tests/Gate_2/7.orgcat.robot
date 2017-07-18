*** Settings ***
Library		Selenium2Library
#Resource	Common.txt
Suite Setup 	Go to homepage
Suite Teardown 	Close All Browsers


*** Variables ***
${BROWSER} 	chrome
${HOMEPAGE} 	http://localhost:3000

*** Test Cases ***
login to apinf
	confirm page loaded	Apinf
	Go to login
	Login to apinf	asdas	asdasd

organizations viewmode
	Go to org
	confirm page loaded	1 APIs
	Sleep	0.5
	Org viewmode

organization sorting
	Go to org
	confirm page loaded	1 APIs
	Sleep	0.5
	org sorting
	#Capture Page Screenshot
	
*** Keywords *** 
Go to homepage
	Open Browser	${HOMEPAGE} 	${BROWSER}

Go to login
	Click Element 	id=frontpage-button
	Click Element	id=signin-button

Go to org
	Click Element	id=frontpage-button
	Click Element	id=organizations-button

Org viewmode
	Click Element	id=viewmode-table
	Page Should Not Contain	1 APIs
	Location Should Contain	table
	Click Element	id=viewmode-grid
	Page Should Contain	1 APIs
	Location Should Contain	grid

Org sorting
	Click Element	id=organization-sort-descending
	Location Should Contain	Direction=descending
	Select From List By Value	id=organization-sort-select	createdAt
	Location Should Contain	By=created
	Click Element	id=organization-sort-ascending
	Location Should Contain	Direction=ascending
	Select From List By Value	id=organization-sort-select	name
	Location Should Contain	By=name

Login to apinf	
	[Arguments]	${username}	${password}
	Input Text	id=at-field-username_and_email	${username}
	Input Password 	id=at-field-password	${password}
	Click Button	id=at-btn

confirm page loaded
	[Arguments] 	${searchkey}
	Wait Until Page Contains 	${searchkey}

Logout of apinf
	Click Element 	id=footer-signout