// Import the functions you need from the SDKs you need
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

const firebaseConfig = {
  apiKey: "AIzaSyAkVEXlr37hGFHRWPKowauPW96XvuJZndc",
  authDomain: "tutorial-67fbc.firebaseapp.com",
  databaseURL: "https://tutorial-67fbc-default-rtdb.firebaseio.com",
  projectId: "tutorial-67fbc",
  storageBucket: "tutorial-67fbc.appspot.com",
  messagingSenderId: "56676404033",
  appId: "1:56676404033:web:05c4a11c074b596cddafc0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage  = getStorage();
const database = getDatabase();

/* -------------------------------------------------------------------------- */
/*                            GETTING URL VARIABLES                           */
/* -------------------------------------------------------------------------- */

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
        var storageRef = ref(storage, filename)
        var databaseRef = dbRef(database, urlVars.pID)
        var experiment = new Experiment(_.extend(json, urlVars), storageRef, databaseRef);
        experiment.init();
    }).fail(showConsoleError);

}

var showConsoleError = () => {
    console.log('fuck');
}

signInAnonymously(auth).then(() => {
    console.log('Authenticated!')
    var urlVars = {pID: turkGetParam('participantId'), expID: turkGetParam('experimentId')};
    getParticipantCompletion(urlVars.pID).then((val) => {
        if (val && val.complete == 1) {
            console.log('This participant has already completed the experiment! :(');
            showUserError('repeatUser');
        }
        else if (!validateExpID(urlVars.expID)) {
            console.log('Invalid experiment ID or paricipant ID');
            showUserError('invalidExpId');
        }
        else {
            console.log('This participant has not yet completed the experiment. :)');
            loadStimuliAndRun('./resources/data/stimuli.json', urlVars)
        }
    }).catch((err) => {
        console.error(err);
        showUserError('fbIssues');
    });
    
})

var getParticipantCompletion = async (pID) => {
    var snapshot = await get(child(dbRef(database), `${pID}`))
    console.log('Read successful')
    return snapshot.val()
}

var showUserError = (errorType) => {
    var errorText = errorTextGenerator(errorType, 'YOUR_EMAIL@YOUR_INSTITUTION.edu')
  $( '#jspsych-target' ).append($('<div>', {
     id: 'error',
     class: 'text-center',
     html: errorText
   }));
}

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

// in this example, valid experiment IDs would be any combination of prefixes and numbers within the id range. I recommend you make the experiment IDs as simple as you can
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



