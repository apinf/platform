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

Change profile name (fail)
	change profile data	asdas#	sampo
	confirm page loaded	alphanumeric

Change profile name (pass)
	change profile data	qweqw	apinf
	confirm page loaded	updated

Change name back
	change profile data	asdas	${EMPTY}
	confirm page loaded	updated

Change password
	change account data	asdasd	qweqwe
	confirm page loaded 	updated

Verify password change
	Logout of apinf
	Go to login
	Login to apinf	asdas	qweqwe
	confirm page loaded	Users

Change password back
	change account data	qweqwe	asdasd
	confirm page loaded 	updated

delete account
	Delete account
	
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

change profile data
	[Arguments]	${username}	${Company}
	Click Element 	id=usermenu
	Click Element	id=profile-button
	Input Text 	id=username	${username}
	Input Text 	id=company	${Company}
	Click Button	id=update-button

change account data
	[Arguments]	${oldpassword}	${newpassword}
	Click Element 	id=usermenu
	Click Element	id=account-button
	Input Password 	id=password-old	${oldpassword}
	Input Password 	id=password-new	${newpassword}
	Input Password 	id=password-new-again	${newpassword}
	Click Button 	id=submit-password


Logout of apinf
	Click Element 	id=footer-signout

Register to apinf
	[Arguments]	${username}	${email}	${password}
	Go To	http://localhost:3000/
	Wait Until Page Contains	Users
	Click Link 	id=footer-signup
	Input Text	id=at-field-username	${username}
	Input Text 	id=at-field-email	${email}
	Input Password 	id=at-field-password	${password}
	Input Password 	id=at-field-password_again	${password}
	Click Element	id=at-btn
	Wait Until Page Contains	Users

Delete account
	Click Element 	id=usermenu
	Click Element	id=account-button
	Click Link	id=delete-account-button
	Wait Until Element Is Visible	id=delete-account-confirm
	Click Button	id=delete-account-confirm