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

Change profile name (fail)
	Go to profile
	change profile data	asdas#	sampo
	confirm page loaded	alphanumeric

Change profile name (pass)
	Go to profile
	change profile data	qweqw	apinf
	confirm page loaded	updated

Change password
	Go to account
	change account data	asdasd	qweqwe
	confirm page loaded 	updated

Verify password and name change
	Logout of apinf
	confirm page loaded	Sign In
	Go to login
	Login to apinf	qweqw	qweqwe
	confirm page loaded	Users

delete this account
	Go to account
	Delete account

*** Keywords ***
Go to homepage
	Open Browser	${HOMEPAGE} 	${BROWSER}

Go to login
	Click Element 	id=frontpage-button
	confirm page loaded	Users
	Click Element	id=signin-button
	confirm page loaded	Login

Go to profile
	Click Element 	id=frontpage-button
	confirm page loaded	Users
	Click Element 	id=usermenu
	Click Element	id=profile-button
	confirm page loaded	Company

Go to account
	Click Element 	id=frontpage-button
	confirm page loaded	Users
	Click Element 	id=usermenu
	Click Element	id=account-button
	confirm page loaded	Update password

Login to apinf
	[Arguments]	${username}	${password}
	Input Text	id=at-field-username_and_email	${username}
	Input Password 	id=at-field-password	${password}
	Click Button	id=at-btn

confirm page loaded
	[Arguments] 	${searchkey}
	Wait Until Page Contains 	${searchkey}

change profile data
	[Arguments]	${username}	${Company}
	Input Text 	id=username	${username}
	Input Text 	id=company	${Company}
	Click Button	id=update-button

change account data
	[Arguments]	${oldpassword}	${newpassword}
	Input Password 	id=password-old	${oldpassword}
	Input Password 	id=password-new	${newpassword}
	Input Password 	id=password-new-again	${newpassword}
	Click Button 	id=submit-password

Logout of apinf
	Focus	id=footer-signout
	Click Element 	id=footer-signout

Delete account
	Click Link	id=delete-account-button
	Wait Until Element Is Visible	id=delete-account-confirm
	Click Button	id=delete-account-confirm
