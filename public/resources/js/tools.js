$('form').submit(function(e) {
    e.preventDefault()
    console.log(e)
    const json = {}
    const csv = e.target[0].files[0]
    var reader = new FileReader()
    reader.readAsText(csv)
    reader.addEventListener('load', () => {
        const content = reader.result.split('\r\n')
        const parsed = []
        for (const row in content) {
            parsed.push(content[row].split(','))
        }
        const splitby = cols[col]
        const sortby = cols[sort]
        const versions = {}

        parsed.slice(1).map(row => {
            const val = row[splitby]
            var newItem = ""
            var newRow = []
            for (let i = 0; i < row.length; i++) {
                if (row[i][0] == '"') {
                    newItem += row[i]
                    var k = i
                    for (let j = i + 1; k < row.length; j++) {
                        newItem += row[j]
                        k = j
                        if (row[j].charAt(row[j].length - 1) == '"') {
                            break;
                        }
                    }

                    if (newItem.charAt(newItem.length - 1) != '"') {
                        newItem = null;
                    }

                    if (newItem) {
                        console.log('SUCCESS NEW ITEM', newItem)
                        newRow.push(newItem)
                        i = k;
                    }
                    else {
                        newRow.push(row[i])
                    }
                }
                else {
                    newRow.push(row[i])
                }
            }
            if (Object.keys(versions).includes(val)) {
                versions[val].push(newRow)
            }
            else {
                versions[val] = [newRow]
            }
        })

        Object.keys(versions).map(key => {
            versions[key] = versions[key].sort((a, b) => {
                if (a[sortby] < b[sortby]) { return -1 }
                else if (a[sortby] > b[sortby]) { return 1 }
                else { return 0 }
            })
        })
        json["firebaseConfig"] = firebaseConfig
        json["columns"] = cols
        json["files"] = {
            type: stimtype,
            stimulusContent: filenames == '__NONE' ? null : filenames 
        }
        json["stimuli"] = versions
        
        $('#downloadLink').attr("href", `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(json, null, 2))}`)
        $('#downloadLink').css({'visibility': 'visible'})
        console.log(json)

    })
    const cols = JSON.parse(e.target[1].value)
    const col = e.target[2].value
    const sort = e.target[3].value
    const stimtype = e.target[4].value
    const filenames = e.target[5].value
    const pid = e.target[6].value
    const pnum = e.target[7].value
    const apikey = e.target[8].value
    const appid = e.target[9].value
    const firebaseConfig = {
        apiKey: apikey,
        authDomain: `${pid}.firebaseapp.com`,
        databaseURL: `https://${pid}-default-rtdb.firebaseio.com`,
        projectId: pid,
        storageBucket: `${pid}.appspot.com`,
        messagingSenderId: pnum,
        appId: appid
    }
})

$('#stimuli').change(function(e) {
    const csv = e.target.files[0]
    var reader = new FileReader()
    reader.readAsText(csv)
    reader.addEventListener('load', () => {
        $('#column').empty()
        $('#sort').empty()
        $('#filenames').empty()
        $('#filenames').append('<option value="__NONE">Not applicable</option>')
        const colsObject = {}
        const content = reader.result.split('\r')
        const cols = content[0].split(',')
        for (const col in cols) {
            $('#column').append(`<option value="${cols[col]}">${cols[col]}</option>`)
            $('#sort').append(`<option value="${cols[col]}">${cols[col]}</option>`)
            $('#filenames').append(`<option value="${cols[col]}">${cols[col]}</option>`)
            colsObject[cols[col]] = col
        }
        $('#cols').val(JSON.stringify(colsObject))
    })
})

$('#stimtype').change(function(e) {
    $("label[for='filenames']").text(`Select column containing ${e.target.value} stimuli`)
})


