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
	confirm page loaded	Users

new organization no name
	Add organization	${EMPTY}	https://www.google.com
	confirm page loaded	Name is
	Add organization break

new organization no url
	Add organization	koira	${EMPTY}
	confirm page loaded	URL is
	Add organization break

Create new organization
	Add organization	koira	https://www.google.com
	Wait Until Page Contains	as featured

Delete created organization
	delete organization

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

confirm page loaded
	[Arguments] 	${searchkey}
	Wait Until Page Contains 	${searchkey}

Add organization
	[Arguments] 	${name}	${url}	
	Click Element	id=organizations-button
	Click Element	id=add-organization
	Wait Until Element Is Visible	id=add-organization-name
	Input Text 	id=add-organization-name	${name}
	Input Text	id=add-organization-url	${url}
	Input Text	id=add-organization-url	${url}
	Sleep	0.3
	Click Element 	id=save-organization

Add organization break
	Click Element 	id=close-window
	Sleep	0.3

delete organization
	Sleep	0.3
	Click Element	css=i.fa.fa-file-text
	Wait Until Element Is Visible	id=delete-organization
	Click Element	id=delete-organization
	Wait Until Element Is Visible	id=delete-organization-modal
	Click Element	id=delete-organization-modal
	Page Should Contain	Successfully deleted

Logout of apinf
	Click Element 	id=footer-signout