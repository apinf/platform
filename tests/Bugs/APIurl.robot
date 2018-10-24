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
	confirm page loaded	Users

Create new api (positive)
	Go to addapi
	Create API	Kissa	${EMPTY}	https://www.google.com
	confirm page loaded	media
	
Change API name
	Change API name

*** Keywords *** 
Go to homepage
	Open Browser	${HOMEPAGE} 	${BROWSER}

Go to login
	Click Element 	id=frontpage-button
	confirm page loaded	Users
	Click Element	id=signin-button
	confirm page loaded	Login
	
Go to addapi
	Click Element 	id=frontpage-button
	confirm page loaded	Users
	Click Element 	id=addapi-button
	confirm page loaded	Lifecycle status

Login to apinf	
	[Arguments]	${username}	${password}
	Input Text	id=at-field-username_and_email	${username}
	Input Password 	id=at-field-password	${password}
	Click Button	id=at-btn

confirm page loaded
	[Arguments] 	${searchkey}
	Wait Until Page Contains 	${searchkey}

Create API
	[Arguments] 	${name}	${description}	${url}
	Input Text 	id=api-name	${name}
	Input Text	id=api-description	${description}
	Input Text	id=api-url	${url}
	Sleep	0.3
	Click Element	id=submitapi-button
	
Change API name
	Click Element	css=i.fa.fa-cog
	Sleep	0.3
	Input Text 	id=api-name	Koira
	Click Element 	id=save-settings
	Location Should Contain	Koira
	