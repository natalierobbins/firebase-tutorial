import { getStorage, ref, listAll, getDownloadURL} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js'//
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js'
import config from './config.json' assert {type: 'json'}
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';


var succ = 0

$('#configSubmit').click(function() {
    const config = {
    }
    const input = $("#config").val()
    const all = input.split('{')[1].slice(0, -2).split(',\n')
    config.apiKey = all[0].split(': ')[1].slice(1, -1)
    config.authDomain = all[1].split(': ')[1].slice(1, -1)
    config.databaseURL = all[2].split(': ')[1].slice(1, -1)
    config.projectId = all[3].split(': ')[1].slice(1, -1)
    config.storageBucket = all[4].split(': ')[1].slice(1, -1)
    config.messagingSenderId = all[5].split(': ')[1].slice(1, -1)
    config.appId = all[6].split(': ')[1].slice(1, -2)
    $('#instructions').attr('style', 'display: none !important')
    download(config)
})

const download = (config) => {

    const app = initializeApp(config)
    const storage = getStorage(app)
    const storageRef = ref(storage, '/')
    const auth = getAuth(app)

    $('#message').text('Awaiting authentication...')
      signInAnonymously(auth).then(() => {
        $('#message').text('Success!')
            listAll(storageRef)
            .then(async (res) => {
                var delay = 0;
                for (const folder in res.prefixes) {
                    $('body').append(`<p>EXPERIMENT ID: ${res.prefixes[folder]._location.path_}</p>`)
                    $('body').append(`<p id="${res.prefixes[folder]._location.path_}-frac">_/_</p>`)
                    $('body').append(`<div id="${res.prefixes[folder]._location.path_}" style="display: flex; width: 50%; height: 30px; border-style: solid; border-width: 1px; border-color: #000; padding: 5px;" class="bar">`)
                        listAll(res.prefixes[folder])
                        .then((res) => {
                            var last = false;
                            var count = 0
                            var increment = 1 / res.items.length
                            for (const item in res.items) {
                                var clicked = 0;
                                const curr = res.items[item]._location.path_.split('/')[1]
                                delay += 500
                                setTimeout(function() {
                                    $('#message').text(`Now downloading experiment with ID: ${res.items[item]._location.path_.split('/')[0]}`)
                                    $(`#${res.items[item]._location.path_.split('/')[0]}-frac`).text(`${++count}/${res.items.length}`)
                                    if (count + 1 == res.items.length) {
                                        last = true;
                                    }
                                    getDownloadURL(res.items[item])
                                    .then((url) => {
                                        console.log(url)
                                        $('body').append(`<a href="${url}" style="display: none;" id="${curr.split('.csv')[0]}" class="downloadLink" download>Download</a>`)
                                        $(`#${res.items[item]._location.path_.split('/')[0]}`).append(`<span style="display: block; height: 100%; width: ${increment * 100}%; background-color:cadetblue;" class="bar"></span>`)
                                    })
                                }, delay)
                                setTimeout(function() {
                                    $(`#${curr.split('.csv')[0]}`).click(function() {
                                        this.click();
                                    }).click();
                                }, delay + 2000)
                            }
                        })
                    }
            })

        })
}







