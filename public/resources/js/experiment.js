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

        var add = (item) => {
            this.timeline.push(item);
        }

        this.addProperties = (jsPsych) => {
            jsPsych.data.addProperties({
                participantId: this.pID()
            });
        }

        var addParticipantToDatabase = () => {
            // if you want to have a demo mode that you can reuse
            if (this.pID() != 'demo') {
                try {
                    set(firebaseDatabase, {
                        complete: 1,
                        experiment: this.expID()
                    });
                    console.log('Added participant to database');
                }
                catch (err) {
                    console.error(err);
                }
            }
        }

        var saveDataToStorage = (filedata) => {
            if (this.pID() != 'demo') {
                console.log('Saving progress...');
                var file = new File([filedata], firebaseStorage._location.path, {type: 'text/csv'})
                try {
                    uploadBytes(firebaseStorage, file).then((snapshot) => {
                        console.log('Upload .csv file');
                    });
                }
                catch (err) {
                    console.error(err)
                }
            }
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

        this.initPreExperiment = () => {

            var preload = {
                type: jsPsychPreload,
                auto_preload: true
            };

            var welcome = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: params.trial_instructions.instructions1
            };

            var instructions = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: params.trial_instructions.instructions2
            };

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
                stimulus: params.trial_instructions.stimulus
            }
        }

         /* initTrials()
          * Assuming that all of your stimuli are relatively uniform, you can init all
          * of them with a for loop. If not, use this function to initialize your trials
          * individually.
          */ 
        this.initTrials = (stimuli) => {
            for (let i = 0; i < stimuli.length; i++) {
                var trial = initTrial(stimuli[i][this.columns.text] + i);
                add(trial);
            } // for
        }

        /* ----------------------------- POST-EXPERIMENT ---------------------------- */

        this.initPostExperiment = (jsPsych, timeline) => {
            var thankYou = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus:  params.trial_instructions.thanks,
                on_start: function() {
                    saveDataToStorage(jsPsych.data.get().csv())
                    addParticipantToDatabase();
                }
            }

            add(thankYou);
            
        }

        this.init = () => {


            this.initPreExperiment();
            this.initTrials(params.stimuli.L1);

            var jsPsych = initJsPsych({
                show_progress_bar: true,
                display_element: 'jspsych-target',
                on_finish: this.onFinish
            });

            this.addProperties(jsPsych);
            this.initPostExperiment(jsPsych, this.timeline)

            jsPsych.run(this.timeline);
        }
    }
}