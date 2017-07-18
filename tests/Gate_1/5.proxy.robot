*** Settings ***
Library		Selenium2Library
Suite Setup 	Go to homepage
Suite Teardown 	Close All Browsers

*** Variables ***
${BROWSER} 	chrome
${HOMEPAGE} 	http://localhost:3000
${APIS}	https://nightly.apinf.io:3002/gaagol/

*** Test Cases ***
Login to apinf
	confirm page loaded	Users
	Go to login
	Login to apinf	asdas	asdasd
	confirm page loaded	Users

setup proxy
	setup proxy

Go to api url
	Go to api page
	confirm page loaded	Gmail

Delete api
	Delete API
	Page Should Not Contain	kissa

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

Go to api page
	Go To	${APIS}

setup proxy
	Go To	http://localhost:3000/apis/kissa
	Wait Until Page Contains	media
	Click Element	css=i.fa.fa-sitemap
	Sleep 	0.2
	Input text	id=proxy-base-path-field	/gaagol/
	Input text	id=api-base-path-field	/
	Click Element	id=disable-apikey-box
	Click Element	id=save-proxy-button
	Wait Until Page Contains	Settings saved	10
	Sleep	0.2
	Capture Page Screenshot

Delete API
	Go To	http://localhost:3000/apis/kissa
	Wait Until Page Contains	Feedback
	Click Element	css=i.fa.fa-cog
	Wait Until Element Is Visible	id=delete-api
	Click Element	id=delete-api
	Wait Until Element Is Visible	id=modal-delete-api
	Click Element	id=modal-delete-api

confirm page loaded
	[Arguments] 	${searchkey}
	Wait Until Page Contains 	${searchkey}

Logout of apinf
	Click Element 	id=footer-signout