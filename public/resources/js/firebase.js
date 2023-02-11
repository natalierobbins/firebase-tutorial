// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref as dbR, get } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import { getStorage, uploadBytes } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";
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

var urlVars = {participantId: turkGetParam('participantId'), experimentId: turkGetParam('experimentId')};

var loadStimuliAndRun = (file, urlVars) => {

    $.getJSON(file, function(json) {
        var experiment = new Experiment(_.extend(json, urlVars), getStorage());
        experiment.init();
    }).fail(showConsoleError);

}

var showConsoleError = () => {
    console.log('fuck');
}

loadStimuliAndRun('./resources/data/stimuli.json')