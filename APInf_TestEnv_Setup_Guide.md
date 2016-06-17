# APInf Test Environment Setup Guide for Linux
Test Environment Setup Guide for running the Automated Scripts for APInf Web Portal.

### Precondition
Ensure you have Chrome and Firefox installed. If not please install before you proceed further.

### Step 1 : Java Installation
Go to Terminal, check for JAVA Version. 
```sh
$ java -version
```
If Java is not present, please install the latest version before you proceed further.

### Step 2 : Installation of Node.JS and Configuration

Download and install [node.js] 
Profile to be updated with the path of [node.js] installation.
```sh
$ nano ~/.profile
```
Go to the end of the file and just add the below lines, if you have downloaded the node.js to Downloads folder. If its a seperate folder change the folder location in the path accordingly.
```sh
#set PATH for Node JS
if [ -d "$HOME/Downloads/node-v4.4.5-linux-x64/bin" ] ; then
    PATH="$HOME/Downloads/node-v4.4.5-linux-x64/bin:$PATH"
fi
```
Exit(Ctrl+x) and save the file. Reload the changes to your profile by executing the below command.
```sh
$ source ~/.profile
```
To verify whether node.js was successfully installed or not, just goto terminal  and enter 
```sh
$ node 
>
```
If you see ">" then proceed to next step. You can exit from that prompt by executing 
```sh
> .exit
```

### STEP 3: Installation of npm

Goto Terminal and execute the below command.
```sh
$ sudo apt-get install npm
```
If you already have it, then no action needed. 

### STEP 4: Test Folder and Test Scripts extraction
Create a test folder and extract the test script files exactly under this folder. So that directly the files are present. Navigate via terminal to this folder, before you continue with next step.

### STEP 5: Installation of MOCHA
Execute the below command in terminal
```sh
$ npm install -g mocha
```
Then you should see some messages like this:
```sh
npm WARN deprecated jade@0.26.3: Jade has been renamed to pug, please install the latest version of pug instead of jade
mocha@2.5.3 node_modules/mocha
├── commander@2.3.0
├── diff@1.4.0
├── escape-string-regexp@1.0.2
├── growl@1.9.2
├── supports-color@1.2.0
├── to-iso-string@0.0.2
├── debug@2.2.0 (ms@0.7.1)
├── mkdirp@0.5.1 (minimist@0.0.8)
├── jade@0.26.3 (commander@0.6.1, mkdirp@0.3.0)
└── glob@3.2.11 (inherits@2.0.1, minimatch@0.3.0)
```

### STEP 6: Installation of CHAI
Execute the below command in terminal
```sh
$ npm install chai
```
Then you should see some messages like this:
```sh
chai@3.5.0 node_modules/chai
├── assertion-error@1.0.2
├── type-detect@1.0.0
└── deep-eql@0.1.3 (type-detect@0.1.1)
```

### STEP 7: Installation of Chrome Driver

- Create a folder called *bin* under HOME Directory
- Download [Chrome Driver]
- Extract the downloaded driver to *bin*

Under bin folder you should find file named: *chromedriver*

### STEP 8: Installation of Selenium Web Driver
Execute the below command from terminal
```sh
$ npm install selenium-webdriver
```

### STEP 9: Environment Cross Check 
Cross check whether the test script files are present under test folder. Navigate to the folder an use command *ls* 
```sh
$ ls
logintests.js  node_modules  package.json  registrationtests.js
```
If you are able to see, your environment is ready for execution.

### STEP 10: Execution

```sh
$ mocha logintests.js 
```

After the execution completes it looks like below:
```sh
  Login
    ✓ 2.1 should login with valid username and password (19117ms)
    ✓ 2.2 should show login forbidden message with invalid username (11379ms)
    ✓ 2.3 should show login forbidden message with invalid password (10845ms)


  3 passing (43s)
  ```
### Commands for Execution

- Scenerio 1- You want to execute all scripts at once, navigate to the parent directory where the test files are placed and execute the below command.

    ```sh
    $ mocha
    ```
- Scenerio 2: Executing only single test file
    ```sh
    $ mocha testfile.js
    ```
- Scenerio 3: Executing only single test case in a test file
    ```sh
    $ mocha testfile.js - g 'TestCaseID'
    EX: mocha testfile.js -g '1.3'
    ```

[//]: # 

   [node.js]: <http://nodejs.org>
   [Chrome Driver]: <http://chromedriver.storage.googleapis.com/index.html?path=2.22/>
