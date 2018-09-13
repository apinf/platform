*** Settings ***
Library		Selenium2Library
Suite Setup 	Go to homepage
Suite Teardown 	Close All Browsers

*** Variables ***
${BROWSER} 	chrome
${HOMEPAGE} 	http://localhost:3000

*** Test Cases ***
Login to apinf wrong password(negative)
	confirm page loaded	Users
	Go to login
	Login to apinf	asdas	asdasdasd
	confirm page loaded	forbidden

Login to apinf wrong username (negative)
	Go to login
	Login to apinf	asdasd	asdasd
	confirm page loaded	forbidden

password lost wrong email(negative)
	Go to login
	Test reset password	asd@asd.as
	confirm page loaded	User not found

password lost no email (negative)
	Go to login
	Test reset password	${EMPTY}
	confirm page loaded	Required Field

password lost (positive)
	Go to login
	Test reset password	asd@asd.asd
	confirm page loaded	Email sent

Login to apinf (positive)
	Go to login
	Login to apinf	asdas	asdasd
	confirm page loaded	Users

Log out of apinf
	Logout of apinf
	confirm page loaded	Sign In

*** Keywords ***
Go to homepage
	Open Browser	${HOMEPAGE} 	${BROWSER}

Go to login
	Click Element 	id=frontpage-button
	confirm page loaded	Users
	Click Element	id=signin-button
	confirm page loaded	Login

Login to apinf
	[Arguments]	${username}	${password}
	Input Text	id=at-field-username_and_email	${username}
	Input Password 	id=at-field-password	${password}
	Click Button	id=at-btn

confirm page loaded
	[Arguments] 	${searchkey}
	Wait Until Page Contains 	${searchkey}

Test reset password
	[Arguments] 	${email}
	Click Link	id=at-forgotPwd
	confirm page loaded	Reset your
	Input Text 	id=at-field-email	${email}
	Click Button	id=at-btn

Logout of apinf
	Focus		id=footer-signout
	Click Element 	id=footer-signout
