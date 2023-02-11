// experiment.js

// This file defines the Experiment class that is initialized in runner.js.
// The experiment's timeline and trials live here.

// Stimuli are defined in data/stimuli.json. This file is loaded by runner.js.
// The contents of this file are passed to the params variable of the
// Experiment object.

import { ref } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js';

export class Experiment {
    constructor(params, firebaseStorage) {

        /* -------------------------------------------------------------------------- */
        /*                               EXPERIMENT DATA                              */
        /* -------------------------------------------------------------------------- */

        // TODO: Add more participant parameters here if needed.
        this.participant = {
            id: params.participantId
        }

        // TODO: Add more experiment parameters here if needed.
        this.experimentData = {
            id: params.experimentId,
            storageLocation: ''
        }

        this.columns = params.stimuli.columns

        // Initialize the experiment timeline
        this.timeline = [];

        this.jsPsych = initJsPsych({
            show_progress_bar: true,
            display_element: 'jspsych-target',
            on_finish: this.onFinish
        });

        /* -------------------------------------------------------------------------- */
        /*                                   GETTERS                                  */
        /* -------------------------------------------------------------------------- */

        this.getParticipantId = function() { // Return current participant's ID
            return this.participant.id;
        }
          this.getExperimentId = function() {  // Return experiment's ID
            return this.experimentData.id;
        }
          this.getTimeline = function() {      // Return the timeline
            return this.timeline;
        }
        this.getStorageRef = function() {
            return this.experimentData.storageLocation;
        }
        this.setStorageRef = function(ref) {
            this.experimentData.storageLocation = ref;
        }

        this.setStorageLocation = () => {
            var filename = this.experimentData.id + '/' + this.experimentData.id + '_' + this.participant.id + '.csv';
            this.setStorageRef(ref(firebaseStorage, filename));
        }

        this.add = (item) => {
            this.timeline.push(item);
        }

        var addProperties = (jsPsych) => {
            jsPsych.data.addProperties({
                participantId: this.participant.id
            });
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

        this.initPreExperiment = () => {

            var preload = {
                type: jsPsychPreload,
                auto_preload: true
            };

            var welcome = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: "<p>Welcome to the experiment. Press any key to begin.</p>"
            };

            var instructions = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: "<p>Here are some instructions. Press any key to continue.</p>"
            };

            this.add(preload);
            this.add(welcome);
            this.add(instructions);

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
                stimulus: "<p>Here is a stimulus. Press any key to continue.</p>"
            }
        }

         /* initTrials()
          * Assuming that all of your stimuli are relatively uniform, you can init all
          * of them with a for loop. If not, use this function to initialize your trials
          * individually.
          */ 
        this.initTrials = (stimuli) => {
            for (let i = 0; i < stimuli.length; i++) {
                var trial = initTrial(stimuli[i]);
                this.add(trial);
            } // for
        }

        /* ----------------------------- POST-EXPERIMENT ---------------------------- */

        this.initPostExperiment = (jsPsych, timeline, storage, db) => {
            var thankYou = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus:  "<p>Thank you! Your responses have been recorded.</p>",
                on_start: function() {
                    saveDataToStorage(jsPsych.data.get().csv(), storage, this.participantId)
                    addParticipantToDatabase(this.participantId, this.experimentId, db);
                }
            }

            this.add(thankYou);
            
        }

        this.init = () => {
            this.setStorageLocation();

            this.initPreExperiment();
            this.initTrials(params.stimuli.L1);

            addProperties(this.jsPsych);
            this.initPostExperiment(this.jsPsych, this.timeline, )

            this.jsPsych.run(this.timeline);
        }
    }
}