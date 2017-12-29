*** Settings ***
Library		Selenium2Library
Suite Setup 	Go to homepage
Suite Teardown 	Close All Browsers

*** Variables ***
${BROWSER} 	chrome
${HOMEPAGE} 	http://localhost:3000

*** Test Cases ***
Make new account no mail (fail)
	confirm page loaded	Users
	Go to signup
	Register to apinf	asdas	${EMPTY}	asdasd
	Wait Until Page Contains	Required Field

Make new account no password (fail)
	Go to signup
	Register to apinf	asdas	asd@asd.asd	${EMPTY}
	Wait Until Page Contains	Required Field

Make new account (pass)
	Go to signup
	Register to apinf	asdas	asd@asd.asd	asdasd
	confirm page loaded	Users

	
*** Keywords *** 
Go to homepage
	Open Browser	${HOMEPAGE} 	${BROWSER}

Register to apinf
	[Arguments]	${username}	${email}	${password}
	Input Text	id=at-field-username	${username}
	Input Text 	id=at-field-email	${email}
	Input Password 	id=at-field-password	${password}
	Input Password 	id=at-field-password_again	${password}
	Click Element	id=at-btn

Go to signup
	Click Element 	id=frontpage-button
	confirm page loaded	Users
	Click Element	id=signup-button
	confirm page loaded	Username

confirm page loaded
	[Arguments] 	${searchkey}
	Wait Until Page Contains 	${searchkey}

Logout of apinf
	Click Element 	id=footer-signout