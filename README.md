Lighthouse automation using WDIO

We can automate the process of lighthouse testing by writing scripts that will execute performance tests on demand and assert that performance metrics have satisfactory scores.

One of the ways to achieve this is using WDIO which can be written in any of the further assertion frameworks such as mocha or cucumber. For this type of testing ether can work.

Testing method that will be described in the further reading will be testing using DevTools Service for WDIO.

Installing from scratch.

Install and setup Node

Prerequisites:
brew
nvm
VSC or other IDE / text editor
Terminal configure and setup

Start with the blank folder.
Install node version 18 using the nvm.
Execute the command to start using node version 18 “nvm use 18”
Using node package manager initialize project by typing “npm init”
Follow instructions in the prompt to start the project
package.json file will be generated in the list of files

If you encounter any problems in this initial setup refer to the official documentation or this helpful blog

Install and setup WDIO

Now we need to install WDIO and set it up. Do this by executing the following commands:
To install and start initial WDIO setup, execute “npm init wdio .” in the terminal.
Prompt will prompt you for inputs:
It will ask you to confirm if correct project is being used, confirm by choosing y/n
For question regarding what type of testing you would like to do, answer E2E testing.
Where is your automated backend located answer on my local machine
Which environment you would like to automate chose Web
For browser option should Chrome
For framework chose Mocha
Do you want to use compiler chose Babel
Do you want WDIO to autogenerate some tests?
For reporter question chose “spec”
For plugins question chose none
Do you want to add a service to your test setup chose chromedriver
For baseURL setup baseURL of the test application
Finally do you want to run NPM install chose yes

Packages required for WDIO to work will now be downloaded final folder should look like this:

WDIO getting started documentation can be found here. Use it if you cannot resolve any of the previous steps.

Install adding dev-tools service and first performance test

Now we need to add dev-tools service to the WDIO and also write some tests.

Execute the following command in the prompt “npm install @wdio/devtools-service --save-dev”
Open wdio.conf.js file and find a line that defines services.
Add devtools service to this line
Create new folder in the root of the directory called tests
In the wdio.conf.js file under specs line defined where tests are located

The official documentation for the dev-tools service reach to it for any additional insight or troubleshooting.
Writing and executing the test.

This is the part where we will write down the test to be executed to performance target in this example google.com.

Navigate to /tests/ folder and create file name performanceTest.js
Insert below code snippet inside the above file and save.

capabilities: [
{
browserName: "chrome",
"goog:chromeOptions": {
args: ["headless", "disable-gpu"],
},
},
],

const { default: expect } = require("expect");
describe("Open devtools", () => {
it("should load within performance budget", async () => {
/\*\*

- this page load will take a bit longer as the DevTools service will
- capture all metrics in the background
  \*/
  await browser.enablePerformanceAudits();
  await browser.url("http://www.google.com");

let metrics = await browser.getMetrics();
expect(metrics.speedIndex).toBeLessThan(1900); // check that speedIndex is below 1.9 secon

let score = await browser.getPerformanceScore(); // get Lighthouse Performance score
expect(score).toBeGreaterThanOrEqual(0.9); // Lighthouse Performance score is at 90% or higher
});
});

Execute the test by running “npx wdio”
Test will run, open chrome instance, attach to the devtools and run metrics against the site. It should produce terminal output that should look like this:

Here is the short explanation on how this works and some important tips and tricks.
It is very important to ether add in the before hook “browser.EnablePerformanceAudit()” function and this must be asynchronous function. Once we are successfully attached to this dev tools instance we will be able to read metrics by running “browser.getMetrics()”.
In the above example we are only testing for speed index and Performance score however in the log below what we can see is that in addition to that we have all metrics exposed inside this object that we have saved in the “metrics” variable, for example firstcontentfulPaint, firstMeaningfulPaint etc.
Above test shows that we have measured on our local machine that speed index was higher than 1900 (1.9 seconds) to load. This is machine dependant in general tests that depend on the local machine should be taken with the grain of salt and these should always be run in the isolated environment on static virtual machines.
