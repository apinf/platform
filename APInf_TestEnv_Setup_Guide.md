# APInf Test Environment Setup Guide for Linux
Test Environment Setup Guide for running the Automated Scripts for APInf Web Portal.

### Precondition
Ensure you have Chrome and Firefox installed. If not please install before you proceed further.

### Installation of Node.JS and Configuration

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

### Installation of npm

Goto Terminal and execute the below command.
```sh
$ sudo apt-get install npm
```
If you already have it, then no action needed. 

### Test Folder and Test Scripts extraction
Create a 'test' folder and extract the test script files exactly under this folder. So that directly the files are present. Navigate via terminal to this folder, before you continue with next step.

### Installation of Chrome Driver

- Create a folder called *bin* under HOME Directory
- Download [Chrome Driver]
- Extract the downloaded driver to *bin*

Under bin folder you should find file named: *chromedriver*

###  Installation of MOCHA, CHAI , Selenium Web Driver
Execute the below command in terminal
```sh
$ npm install -g 
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
