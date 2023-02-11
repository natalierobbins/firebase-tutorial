# Welcome! 👋
## Introduction
Welcome to the Firebase tutorial for the [Contact, Cognition, & Change Lab](https://sites.google.com/umich.edu/ccc-lab/home) at the University of Michigan! This is an updated version of [Matthew Kramer’s original tutorial](https://github.com/ccc-lab/ccc-firebase), adapted for [Firebase v9](https://firebase.google.com/docs/web/modular-upgrade) and [jsPsych v8](https://github.com/jspsych/jsPsych/tree/v8). This tutorial is geared towards users who may not have much coding experience, so it will include a little more information on setting up both Firebase and your jsPsych experiment itself.

While you may run into errors with some of the outdated segments on Matthew’s original template, their tutorial is still very useful, and even includes a section on pupillometry!

### Getting Started

This tutorial assumes that you have basic coding knowledge, are comfortable with using code editors and command line interfaces, and have npm installed on your computer. If you need help with setting up your editor, the EECS 280 website has a tutorial available for most operating systems. To learn more about npm, check out its website. 

This template takes advantage of Firebase v9’s modular format, which means that we also need a module bundler like Webpack or Rollup. If you don’t know exactly what this means, don’t worry! There is a premade configuration to use in the template, and Firebase also has documentation dedicated to using module bundlers with its library. This version uses Webpack, but if you prefer a different bundler, feel free to use another.

## Project Set-up

### Setting up your project directory

1. Download and install Node.js.
2. Download and open the template experiment under ```/path/to/experiment```
3. Navigate to the experiment on the command line using ```cd```
```
cd path/to/experiment
```
4. Once you have navigated to the experiment, initialize your node modules.
```
npm init
```
5. Now, you can install all the necessary modules using npm
```
npm i jspsych jquery underscore bootstrap firebase
```
6. You can see if these installed correctly by checking if they are now included in the ```“modules”``` section of the ```package.json``` file that initialized automatically in your project folder when you called ```npm init```

## Firebase console

### Step 1: Create new Firebase project
1. Log into the Firebase Console using your preferred Google account and create a new project.
2. <...>
### Step 2: Link your local project to the console
1. Install the ```firebase-tools``` module using the command line
```
npm i -g firebase-tools
```
2. Navigate to your project in the command line using ```cd``` if not already there
3. Initialize your firebase project
```
firebase init
```
(Help, firebase command not found!)
4. You’ll be asked a series of configuration questions; make sure to answer ```Realtime Database```, ```Storage```, and ```Hosting``` when prompted, ```Which Firebase CLI features do you want to set up for this folder?```

5. You will be prompted to choose an existing project or create a new one. Select ```Use an existing project```. At this point, you may be asked to log into Firebase if you haven't already.
6. Select the project you made in Step 1.
7. Press enter to select the default options for any remaining questions. (Unless you know what you are doing and want to change them!)

## Troubleshooting

### Firebase won’t let me create a new project
At the time this tutorial is being written, student email accounts at UofM do not have permission to create Firebase projects. The best solution will be to use a different email account that is not part of an organization.

### Firebase command not found
The first thing you can try is sudo installing ```firebase-tools``` by running the following command:
```
sudo npm i -g firebase-tools
```
If that still doesn’t work, try looking at possible solutions on stackoverflow ([this one](https://stackoverflow.com/questions/23645220/firebase-tools-bash-firebase-command-not-found) could be particularly useful).


