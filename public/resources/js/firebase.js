// Import the functions you need from the SDKs you need -- bare minimum already done
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';
import { ref as dbRef, get, child } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import { getStorage, ref } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";
import { Experiment } from './experiment.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

/* -------------------------------------------------------------------------- */
/*                   FIREBASE CONFIGURATION & INTIALIZATION                   */
/* -------------------------------------------------------------------------- */

// Firebase configuration for your web app; you can access this information in
// your project settings
// TODO: Fill in your own config
const firebaseConfig = {
  apiKey: "AIzaSyAkVEXlr37hGFHRWPKowauPW96XvuJZndc",
  authDomain: "tutorial-67fbc.firebaseapp.com",
  databaseURL: "https://tutorial-67fbc-default-rtdb.firebaseio.com",
  projectId: "tutorial-67fbc",
  storageBucket: "tutorial-67fbc.appspot.com",
  messagingSenderId: "56676404033",
  appId: "1:56676404033:web:05c4a11c074b596cddafc0"
};

// initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage  = getStorage(app);
const database = getDatabase(app);

/* -------------------------------------------------------------------------- */
/*                            GETTING URL VARIABLES                           */
/* -------------------------------------------------------------------------- */

// turkGetParam()
// searches for value of URL variable <name>
const turkGetParam = (name) => {
    name = name.replace(/[[]/, "\[").replace(/[]]/, "\]");
    var regexS = "[?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    return results[1];
}

var loadStimuliAndRun = (file, urlVars) => {

    $.getJSON(file, function(json) {
        // file named such that {expID}_{pID}.csv will be in folder {expID}
        var filename = urlVars.expID + '/' + urlVars.expID + '_' + urlVars.pID + '.csv';

        // initialize storage and database references
        var storageRef = ref(storage, filename)
        var databaseRef = dbRef(database, urlVars.pID)

        // initialize experiment
        var experiment = new Experiment(_.extend(json, urlVars), storageRef, databaseRef);
        experiment.init();
    }).fail(showUserError('fbIssues')); // should any part of this fail

}

signInAnonymously(auth).then(() => {

    console.log('Authenticated!')

    // get variables -- change as needed
    var urlVars = {
        pID: turkGetParam('participantId'), 
        expID: turkGetParam('experimentId')
    };

    getParticipantCompletion(urlVars.pID).then((val) => {
        // if there is data, and if that data shows participant has already completed
        // any version of the experiment
        if (val && val.complete == 1) {
            console.log('This participant has already completed the experiment! :(');
            showUserError('repeatUser');
        }
        // or if there is no experiment id matching url variable
        else if (!validateExpID(urlVars.expID)) {
            console.log('Invalid experiment ID or paricipant ID');
            showUserError('invalidExpId');
        }
        // green light
        else {
            console.log('This participant has not yet completed the experiment. :)');
            loadStimuliAndRun('./resources/data/stimuli.json', urlVars)
        }
    }).catch((err) => {
        // unable to access database to check participant status
        console.error(err);
        showUserError('fbIssues');
    });
    
})

// returns value at participant in database
var getParticipantCompletion = async (pID) => {
    var snapshot = await get(child(dbRef(database), `${pID}`))
    console.log('Read successful')
    return snapshot.val()
}

// injects error text via errorTextGenerator() into html
// TODO: insert your email into call to errorTextGenerator()
var showUserError = (errorType) => {
    var errorText = errorTextGenerator(errorType, 'YOUR_EMAIL_HERE@YOUR_INSTITUTION_HERE.edu')
  $( '#jspsych-target' ).append($('<div>', {
     id: 'error',
     class: 'text-center',
     html: errorText
   }));
}

// takes in errorType string and returns correct text. change or add error
// as needed
var errorTextGenerator = (errorType, email) => {
    var errorStr = ''
    var contactStr = `you can contact the lab at <a href="mailto:${email}">${email}</a>, and we will do our best to resolve the situation.</div>`
    if (errorType == 'repeatUser') {
        errorStr = '<p>It appears that you have previously completed a study that used the same data as, or similar data to, the study you are attempting to complete now. Unfortunately, we cannot allow the same person to participate in an experiment more than once. We apologize for the inconvenience, but we must ask that you return your HIT now. (This will not negatively impact your ability to participate in future experiments.)</p><p>If you believe that this message is in error, '
    } else if (errorType == 'invalidExpId') {
        errorStr = '<p>We\'re having trouble loading your experiment. Please make sure that you have not altered the URL given to you in any way. Try loading again with your original link.</p><p>If you believe that this message is in error, '
    } else if (errorType == 'fbIssues') {
        errorStr = '<p>We\'re having some trouble getting you connected. Please make sure that you have not altered the URL given to you in any way. Try loading again with your original link.</p><p>If this issue persists, '
    }
    return errorStr + contactStr
}

// in this example, valid experiment IDs would be any combination of prefixes and numbers within the id range. 
// I recommend you make the experiment IDs as simple as you can and have them
// correspond with list IDs in your stimuli.json
// so in this example, L1, L2, L3, X1, X2, X3 would all be valid experiment IDs
var validateExpID = (expID) => {
    var prefixes = ['L', 'X']
    var idRange = [1, 3];
    for (let i = 0; i < prefixes.length; i++) {
        for(let j = idRange[0]; j <= idRange[1]; j++) {
            if (expID == prefixes[i] + j) {
                return true;
            }
        } // for j
    } // for i
    return false;
    
}



