*** Settings ***
Library		Selenium2Library
Suite Setup 	Go to homepage
Suite Teardown 	Close All Browsers

*** Variables ***
${BROWSER} 	chrome
${HOMEPAGE} 	http://localhost:3000

*** Test Cases ***
APIs sorting
	confirm page loaded	Users
	Go to api catalog
	apis sorting

*** Keywords ***
Go to homepage
	Open Browser	${HOMEPAGE} 	${BROWSER}

Go to api catalog
	Click Element	id=frontpage-button
	confirm page loaded	Users
	Click Element	id=apis-button
	confirm page loaded	Sort by

Apis sorting
	Select From List By Value	id=sort-select	bookmarkCount
	Location Should Contain	By=bookmark
	Select From List By Value	id=sort-select	name-desc
	Location Should Contain	name-desc
	Select From List By Value	id=sort-select	created_at
	Location Should Contain	By=created
	Select From List By Value	id=sort-select	name-asc
	Location Should Contain	name-asc
	Select From List By Value	id=sort-select	averageRating
	Location Should Contain	By=average

confirm page loaded
	[Arguments] 	${searchkey}
	Wait Until Page Contains 	${searchkey}

Logout of apinf
	Click Element 	id=footer-signout
