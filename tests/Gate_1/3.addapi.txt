*** Settings ***
Library		Selenium2Library
Suite Setup 	Go to homepage
Suite Teardown 	Close All Browsers

*** Variables ***
${BROWSER} 	chrome
${HOMEPAGE} 	http://localhost:3000

*** Test Cases ***
Login to apinf
	Go to login
	Login to apinf	asdas	asdasd
	confirm page loaded	Users

Create new api no name (negative)
	Create API	${EMPTY}	asdasdasd	https://www.google.com
	confirm page loaded	is required

Create new api no url (negative)
	Create API	Kissa	asdasd	${EMPTY}
	confirm page loaded	is required

Create new api (positive)
	Create API	Kissa	${EMPTY}	https://www.google.com
	confirm page loaded	Kappa

#Delete api
	#Delete API

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

confirm page loaded
	[Arguments] 	${searchkey}
	Wait Until Page Contains 	${searchkey}

Create API
	[Arguments] 	${name}	${description}	${url}
	Click Element 	id=addapi-button
	Input Text 	id=api-name	${name}
	Input Text	id=api-description	${description}
	Input Text	id=api-url	${url}
	Click Element	id=submitapi-button

Delete API
	Go To	http://localhost:3000/apis/kissa
	Wait Until Page Contains	media
	Select From List	id=api-settings-tab
	Click Element	id=delete-api
	Wait Until Element Is Visible	id=modal-delete-api
	Click Element	id=modal-delete-api
	Page Should Not Contain	${APINAME}