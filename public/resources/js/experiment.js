// experiment.js

// This file defines the Experiment class that is initialized in runner.js.
// The experiment's timeline and trials live here.

// Stimuli are defined in data/stimuli.json. This file is loaded by runner.js.
// The contents of this file are passed to the params variable of the
// Experiment object.

import { uploadBytes } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js';
import { set } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';

export class Experiment {
    constructor(params, firebaseStorage, firebaseDatabase) {

        /* -------------------------------------------------------------------------- */
        /*                               EXPERIMENT DATA                              */
        /* -------------------------------------------------------------------------- */

        // TODO: Add more participant parameters here if needed.
        this.participant = {
            id: params.pID
        }

        // TODO: Add more experiment parameters here if needed.
        this.experimentData = {
            id: params.expID
        }

        this.columns = params.columns

        // Initialize the experiment timeline
        this.timeline = [];

        /* -------------------------------------------------------------------------- */
        /*                                   GETTERS                                  */
        /* -------------------------------------------------------------------------- */

        // Return current participant's ID
        this.pID = () => { 
            return this.participant.id;
        }
        // Return experiment's ID
        this.expID = () => {  
            return this.experimentData.id;
        }

        /* -------------------------------------------------------------------------- */
        /*                                   SETTERS                                  */
        /* -------------------------------------------------------------------------- */

        // push jsPsych block to timeline
        var add = (item) => {
            this.timeline.push(item);
        }

        // use this to add any retroactive properties to final data output
        // for example, this setting will add a new "participantId" column 
        // to the final .csv file with the correct ID
        this.addProperties = (jsPsych) => {
            jsPsych.data.addProperties({
                participantId: this.pID()
            });
        }

        /* -------------------------------------------------------------------------- */
        /*                             FIREBASE FUNCTIONS                             */
        /* -------------------------------------------------------------------------- */

        /* addParticipantToDatabase()
         * Checks if real participant or demo
         *
         * This format saves participants by ID, and under each participant ID
         * are two attributes, "complete" and "experiment"
         *
         * Edit if you want a different format, and add any extra information you want
         * about your participants in the second parameter of the set() function
         */
        var addParticipantToDatabase = () => {
            // check if demo
            if (this.pID() != 'demo') {
                try {
                    // set an instance of this participant with these values
                    set(firebaseDatabase, {
                        complete: 1,
                        experiment: this.expID()
                    });
                    console.log('Added participant to database');
                }
                // if issue with adding participant
                catch (err) {
                    console.error(err);
                }
            }
        }

        /* saveDataToStorage()
         *
         * Initializes new File object with csv-formatted filedata and uploads it to firebase storage
         *
         * Does not save any data from demo trials :)
         */
        var saveDataToStorage = (filedata) => {
            // check if demo
            if (this.pID() != 'demo') {
                console.log('Saving progress...');
                // initialize new file -- if you need help with this (ex. need to change file format), lookup Javascript's File API
                var file = new File([filedata], firebaseStorage._location.path, {type: 'text/csv'})
                try {
                    uploadBytes(firebaseStorage, file).then((snapshot) => {
                        console.log('Upload .csv file');
                    });
                }
                // if issue with uploading csv file
                catch (err) {
                    console.error(err)
                }
            }
            // demo complete, no need to upload file!
            else {
                console.log('Demo complete!')
            }
        }

        /* -------------------------------------------------------------------------- */
        /*                               EXPERIMENT FLOW                              */
        /* -------------------------------------------------------------------------- */
        
        /* Function to be called by jsPsych at the very end of the experiment
         * If you are using Prolific, you should use this function to redirect
         * participants to the page Prolific specifies. */
        this.onFinish = function () {
            console.log('finish')
            // TODO: Add Prolific or other redirects here
        }

        /* ----------------------------- PRE-EXPERIMENT ----------------------------- */

        // Use this function to create any trials that should appear before the main
        // experiment. For example:
        this.initPreExperiment = () => {

            // preload plugin from jsPsych. useful especially for audio and image stimuli
            var preload = {
                type: jsPsychPreload,
                auto_preload: true
            };
            
            // welcome page
            var welcome = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: params.trial_instructions.instructions1
            };

            // instructions page
            var instructions = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: params.trial_instructions.instructions2
            };

            // push all blocks to timeline
            add(preload);
            add(welcome);
            add(instructions);

        };

        /* --------------------------------- TRIALS --------------------------------- */

        /* initTrial()
         * Use this function if you have repetitive stimuli that take the same form.
         * This can also be useful if you want to initialize your trials in different
         * ways based on different conditions
         */ 
        var initTrial = (stimulus) => {
            return {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: `<p>${stimulus}</p>`
            }
        }

         /* initTrials()
          * Assuming that all of your stimuli are relatively uniform, you can init all
          * of them with one for loop. If not, use this function to initialize your trials
          * individually.
          */ 
        this.initTrials = (stimuli) => {
            for (let i = 0; i < stimuli.length; i++) {
                var trial = initTrial(stimuli[i][this.columns.text] + i);
                // push to timeline
                add(trial);
            } // for i
        }

        /* ----------------------------- POST-EXPERIMENT ---------------------------- */

        /* initPostExperiment()
         * 1. Converts data gathered by jsPsych into a csv-formatted string
         * *  and saves it to storage using savaDataStorage() from experiment.js
         * 2. Saves paricipant ID to database using addParticipantToDatabase()
         * *  from experiment.js
         * 3. Defines final message for user
         * 4. Pushes entire block to experiment timeline
         */
        this.initPostExperiment = (jsPsych) => {
            var thankYou = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus:  params.trial_instructions.thanks,
                // this function will run at beginning of this block to save participant
                // and data to Firebase
                on_start: function() {
                    saveDataToStorage(jsPsych.data.get().csv())
                    addParticipantToDatabase();
                }
            }
            // push to timeline
            add(thankYou);
            
        }

        // init()
        // putting it all together! this is the only function from the Experiment
        // class that we actually call in firebase.js
        this.init = () => {


            this.initPreExperiment();
            this.initTrials(params.stimuli[this.expID()]);

            var jsPsych = initJsPsych({
                show_progress_bar: true,
                display_element: 'jspsych-target',
                on_finish: this.onFinish
            });

            this.addProperties(jsPsych);
            this.initPostExperiment(jsPsych)

            jsPsych.run(this.timeline);
        }
    }
}