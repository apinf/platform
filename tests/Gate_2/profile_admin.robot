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
	
make adding api for admins only
	add api to admins

change branding settings
	change branding data	title place	creative slogan here
	change pp and tou	kissa-koira	koira-kissa
	save branding
	confirm page loaded	Branding saved
	Click Element 	id=frontpage-button
	Sleep	0.3
	Page Should Contain	place
	Page Should Contain	creative

check privacy policy and terms of use
	check info changed

change settings back
	change branding data	Apinf test	testing for fun
	#change pp and tou	${EMPTY}	${EMPTY}
	save branding
	confirm page loaded	Branding saved
	

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

Logout of apinf
	Click Element 	id=bottom-signout

change pp and tou
	[Arguments]	${pp}	${tou}
	Input Text	id=ql-editor-1	${pp}
	Input Text	id=ql-editor-2	${tou}

change branding data
	[Arguments]	${title}	${slogan}
	Click Element 	id=usermenu
	Click Element	id=branding-button
	confirm page loaded	Project Branding
	Input Text 	id=branding-site-title	${title}
	Input Text 	id=branding-site-slogan	${slogan}

save branding
	Click Button	id=branding-update-button

add api to admins
	Click Element 	id=usermenu
	Click Element	id=settings-button
	confirm page loaded	Adding APIs
	Click Element	id=addapi-adminonly
	Click Button	id=save-settings

check info changed
	Click Element	id=privacypolicy-button
	confirm page loaded	kissa-koira
	Click Element	id=termsofuse-button
	confirm page loaded	koira-kissa