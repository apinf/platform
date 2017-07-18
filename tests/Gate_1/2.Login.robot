*** Settings ***
Library		Selenium2Library
Suite Setup 	Go to homepage
Suite Teardown 	Close All Browsers

*** Variables ***
${BROWSER} 	chrome
${HOMEPAGE} 	http://localhost:3000

*** Test Cases ***
Login to apinf wrong password(fail)
	confirm page loaded	Users
	Go to login
	confirm page loaded	Github
	Login to apinf	asdas	asdasdasd
	confirm page loaded	forbidden

Login to apinf wrong username (fail)
	Go to login
	confirm page loaded	Github
	Login to apinf	asdasd	asdasd
	confirm page loaded	forbidden

password lost wrong email(fail)
	Go to login
	confirm page loaded	Github
	Test reset password	asd@asd.as
	confirm page loaded	User not found

password lost no email (fail)
	Go to login
	confirm page loaded	Github
	Test reset password nomail
	confirm page loaded	Required Field

password lost (pass)
	Go to login
	confirm page loaded	Github
	Test reset password	asd@asd.asd
	confirm page loaded	Email sent

Login to apinf (pass)
	Go to login
	confirm page loaded	Github
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
	Click Element	id=signin-button

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
	Input Text 	id=at-field-email	${email}
	Click Button	id=at-btn

Test reset password nomail
	Click Link	id=at-forgotPwd
	Click Button	id=at-btn

Logout of apinf
	Click Element 	id=footer-signout