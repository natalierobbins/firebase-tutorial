# Welcome! 👋
## Table of Contents
- [Introduction](https://github.com/natalierobbins/firebase-tutorial#introduction)
    - [Getting started](https://github.com/natalierobbins/firebase-tutorial#getting-started)
- [Project set-up](https://github.com/natalierobbins/firebase-tutorial#project-set-up)
    - [Setting up your project directory](https://github.com/natalierobbins/firebase-tutorial#setting-up-your-project-directory)
- [Firebase console](https://github.com/natalierobbins/firebase-tutorial#firebase-console)
    - [Create new Firebase project](https://github.com/natalierobbins/firebase-tutorial#step-1-create-new-firebase-project)
    - [Link your local project to the console](https://github.com/natalierobbins/firebase-tutorial#step-2-link-your-local-project-to-the-console)
- [Project layout](https://github.com/natalierobbins/firebase-tutorial#project-layout)
    - [index.html](https://github.com/natalierobbins/firebase-tutorial#publicresourcesindexhtml)
    - [data](https://github.com/natalierobbins/firebase-tutorial#publicresourcesdata)
    - [stimuli.json](https://github.com/natalierobbins/firebase-tutorial#publicresourcesdatastimulijson)
    - [firebase.js](https://github.com/natalierobbins/firebase-tutorial#publicresourcesjsfirebasejs)
    - [experiment.js](https://github.com/natalierobbins/firebase-tutorial#publicresourcesjsexperimentjs)
- [jsPsych pointers](https://github.com/natalierobbins/firebase-tutorial#jspysch-pointers)
    - [Plugins](https://github.com/natalierobbins/firebase-tutorial#plugins)
- [Troubleshooting](https://github.com/natalierobbins/firebase-tutorial#troubleshooting)

## Introduction
Welcome to the Firebase tutorial for the [Contact, Cognition, & Change Lab](https://sites.google.com/umich.edu/ccc-lab/home) at the University of Michigan! This is an updated version of [Matthew Kramer’s original tutorial](https://github.com/ccc-lab/ccc-firebase), adapted for [Firebase v9](https://firebase.google.com/docs/web/modular-upgrade) and [jsPsych v8](https://github.com/jspsych/jsPsych/tree/v8). This tutorial is geared towards users who may not have much coding experience, so it will include a little more information on setting up both Firebase and your jsPsych experiment itself.

While you may run into errors with some of the outdated segments on Matthew’s original template, their tutorial is still very useful, and even includes a section on pupillometry!
### Getting started
This tutorial assumes that you have basic coding knowledge, are comfortable with using code editors and command line interfaces, and have npm installed on your computer. If you need help with setting up your editor, the EECS 280 website has a tutorial available for most operating systems. To learn more about npm, check out its website.

## Project set-up
### Setting up your project directory
1. Download and install Node.js.
2. Install ```firebase-tools``` using your terminal
```
npm install -g firebase-tools
```
## Firebase console
### Step 1: Create new Firebase project
1. Log into the [Firebase Console](https://console.firebase.google.com/u/0/) using your preferred Google account and create a new project.
3. If you were not already prompted, set your cloud resource location. You can do this by filling in the value of ```Default GCP resource location``` under ```Project settings > General```. Make sure to choose the location closest to your actual location; once you set it, you cannot change it.
2. Create a new ```Realtime Database```. The ```Realtime Database``` page is under the ```Build``` dropdown menu in the sidebar of your console. Start your database in test mode; we will edit the rules later.
2. Set up your ```Storage```. The ```Storage``` page is under the ```Build``` dropdown menu in the sidebar of your console. Start your database in test mode; we will edit the rules later.
### Step 2: Link your local project to the console
1. Navigate to your project in the command line using ```cd``` if not already there. For example:
```
cd Users/user/path/to/your/experiment
```
2. Initialize your Firebase project
```
firebase init
```
3. You’ll be asked a series of configuration questions; when prompted, ```Which Firebase CLI features do you want to set up for this folder?```, make sure to select ``` Realtime Database ```, ``` Hosting: ..... ```, and``` Storage ```
5. You will be prompted to choose an existing project or create a new one. Select ```Use an existing project```. At this point, you may be asked to log into Firebase if you haven't already.
6. Select the project you made in Step 1.
7. Press enter to select the default options for any remaining questions. (Unless you know what you are doing and want to change them!)
## Project layout
As of right now, your project directory should look like this:
```
firebase-project
├── database.rules.json
├── firebase.json
├── public
    ├── index.html
    ├── 404.html
    ├── resources
        ├── data
            ├── stimuli.json
        ├── js
            ├── firebase.js
            ├── experiment.js
├── storage.rules
```
We'll focus on the ```public``` folder first, since this is the only thing you should need to change.
### index.html
The only thing you HAVE to change here is your experiment title. Feel free to add any additional ```.css``` files or ```.js``` files as needed.

This is also home to all of your packages; they're imported using the ```<script></script>``` tags. While you shouldn't need any more Firebase modules, you will likely need to import jsPsych plugins. For the sake of any beginners following this tutorial, we will be using CDN-hosted scripts; feel free to overhaul this structure and download everything via ```npm``` if you know how to do that :)

We'll worry about importing jsPsych plugins later!
### /resources/data
This folder should hold any external files you might need to load into your experiment (audio, images, etc.). While you don't need to create a new subfolder to hold these files, it's nice to have them all in one place (so, for instance, you could create a ```/public/resources/data/images```). If your experiment soley consists of simple text stimuli, however, I would simply include the text in your stimuli.json file, which I discuss below.
### stimuli.json
As of right now, your data stimuli.json is an example skeleton -- do what you will with the starter structure. This file should hold your experiment "outline" and any insertable data, such as written instructions; this will do wonders for your code readability and organization. Here is a (slightly modified) example from Matthew Kramer's tutorial that works very well.
``` json
{
  "stimuli": {
    "l1":
      [["List1", "1", "FILLER_GOOD_1", "FILLER_GOOD", "N/A", "N/A", "FILLER_GOOD_1.wav"], ... ],
    
    "l2":
      [["List2", "1", "FILLER_GOOD_1", "FILLER_GOOD", "N/A", "N/A", "FILLER_GOOD_1.wav"], ... ]
  },
      
  "trial_instructions": {
    "instructions1": "<p class=\"text-center large\">Please follow these instructions</p>",
    "instructions2": "<p class=\"text-center large\">Please follow more instructions</p>",
    "stimulus": "<p class=\"text-center large\">Please follow these instructions for each stimulus</p>",
    ...
  }
  ...
}
```
Notice that they have split the JSON object into two categories, ```"stimuli"``` and ```"trial_instructions"```, but you can use more or less as needed.

Additionally, look at how the ```"stimuli"``` object is structured -- in this experiment, there are multiple experiment verisons that hold a list of stimuli (```"l1"```, ```"l2"```, etc). Each stimulus in any given version is a list of values. In Matthew's example, each stimulus has the following attributes: ```list```, ```position```, ```id```, ```condition```, ```verb_type```, ```adjunct_type```, and ```audio_name```.

You can have as many or as few attributes as you like, just make sure you stay consistent with the order of attributes in each given stimuli. (Work like this can be tedious -- I usually run a python script to generate the ```"stimuli"``` section from a spreadsheet for me).

So now, instead of inundating your code with the experiment order and file names for all of your stimuli and experiment versions, you can just reference this ```.json``` file! We will use it in our ```experiment.js``` file (more on that later). If you're not familiar with JSON, no worries! Here's some information about basic syntax you can look at if you feel lost.
### firebase.js
While small, this file is important because it links your local project to your remote Firebase console! To do so, you need to set up your web app on the console and add the correct configuration information to your ```firebase.js``` file.

1. Go to the ```Hosting``` section of your Firebase console. Click Get started.
2. You should have already completed the first two steps (```Install Firebase CLI``` and ```Initialize your project```). If not, do them.
3. Register your web app with whatever name you like -- it won't be visible to participants.
4. Open your ```firebase.js``` file. You will see an empty firebaseConfig item. Replace it with your project's configuration -- it should look something like this:
``` javascript
const firebaseConfig = {
  apiKey: "XXXXXXXX",
  authDomain: "XXXXXXXX",
  databaseURL: "XXXXXXXX",
  projectId: "XXXXXXXX",
  storageBucket: "XXXXXXXX",
  messagingSenderId: "XXXXXXXX",
  appId: "XXXXXXXX"
};
```
If you ever need to access your configuration information again, you can find it under ```Project settings > General > Your apps```.
### experiment.js
## jsPsych pointers
### Plugins
## Troubleshooting
Firebase won’t let me create a new project
At the time this tutorial is being written, student email accounts at UofM do not have permission to create Firebase projects. The best solution will be to use a different email account that is not part of an organization.

Firebase command not found
The first thing you can try is sudo installing firebase-tools by running the following command:

sudo npm i -g firebase-tools
If that still doesn’t work, try looking at possible solutions on stackoverflow (this one could be particularly useful).
