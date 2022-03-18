const standardTuning = generateStandardTuning()
const standardTuningFlat = generateStandardTuningFlats()

standardTuning.forEach(a => a.shift())
standardTuningFlat.forEach(a => a.shift())    




const notes = document.getElementById("notes");
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const range = document.getElementById("range");
const timeBetween = document.getElementById("time-between");
const timeLeft = document.getElementById("time-left");
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const stickToScreenCb = document.getElementById("stick-to-screen-checkbox")
const staffNote = document.getElementById("staff-note");
const ledgerLines = Array.from(document.getElementsByClassName("ledger-line"));
const includeNotesCheckboxes = document.querySelector("#notes-included-checkboxes .label-wrapper")
const strings = [];

function initialzeIncludeNoteChecboxes() {
    function createNoteCheckbox(note,x,y) {
        const l = document.createElement("label")
        
        const cb = document.createElement("input")
        cb.setAttribute("type","checkbox")
        // cb.setAttribute("checked","true")
        cb.setAttribute("data-x",x)
        cb.setAttribute("data-y",y)
        cb.setAttribute("data-note",note)
        
        const s = document.createElement("span")
        s.innerText = note
        
        l.appendChild(cb)
        l.appendChild(s)
    
        return l;
    }
    for (let i = 0; i < 6; i++) {
        const string = []
        for (let j = 0; j < 12; j++) {
            const cb = createNoteCheckbox(standardTuning[i][j].replace(/\d/,""),j,i)
            string.push(cb.querySelector("input"))
            includeNotesCheckboxes.append(cb)
        }
        strings.push(string)
    }
}


initialzeIncludeNoteChecboxes();

function includeNote(note) {
    iterateAllCheckboxes((cb) => {
        if(cb.getAttribute("data-note") === note) {
            cb.checked = true;
        }
    })

}

function iterateAllCheckboxes(fn) {
    strings.forEach(s => {
        s.forEach(cp => {
            fn(cp)
        })
    })
}

function clearAllSelectedNotes() {
   iterateAllCheckboxes(cp => cp.checked = false) 
}

function includeString(number) {
    strings[number].forEach(cb => cb.checked = true)    
}

function includeFret(number) {
    for (let i = 0; i < strings.length; i++) {
        strings[i][number].checked =  true;
    }
}


const synth = new Tone.Synth().toDestination();
let intervalId;

let timeBetweenInSeconds = 5000;
range.value = 50;

startButton.addEventListener('click', _ => {
    menu.style.display = 'none';
    game.style.display = 'block';
    stopButton.style.display = 'block';
    Tone.start().then(() => {
        intervalId = setInterval(() => {
            nextNoteAsLetter()
        }, timeBetweenInSeconds)
        nextNoteAsLetter()
    })

})

stopButton.addEventListener('click', _ => {
    menu.style.display = 'grid';
    game.style.display = '';
    stopButton.style.display = 'none';
    clearInterval(intervalId);
})

stickToScreenCb.addEventListener("change",e => {
    console.log('here');
    if(!e.target.checked) {
        document.getElementById("notes-included-checkboxes").classList.remove("stick-to-top")
    } else {
        document.getElementById("notes-included-checkboxes").classList.add("stick-to-top")
    }
})

range.addEventListener('input', e => {
    let value = e.target.value / 10;
    timeBetweenInSeconds = value * 1000
    timeBetween.textContent = 'Time between notes: ' + (value === 10 ? value : value.toFixed(1)) + ' seconds'
})



function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function getRandomBoolean() {
    return Math.random() >= 0.5;
}

function animateTimeLeft() {
    gsap.fromTo(timeLeft, {scaleX: 1}, {scaleX: 0, ease:"none", duration: timeBetweenInSeconds/1000});
}


function nextNoteAsLetter() {
    const stringNumber = getRandomIntInclusive(0, 5);
    const note = getRandomNote(stringNumber);
    animateTimeLeft()
    synth.triggerAttackRelease(note, "4n");

    const noteSpan = document.createElement("span");
    const stringSpan = document.createElement("span");
    noteSpan.classList.add('highlight')
    stringSpan.classList.add('highlight')

    noteSpan.append(note.replace(/\d+/g,""))
    stringSpan.append(getStringNumber(stringNumber+1))
    notes.innerHTML = '';
    notes.append(noteSpan,' on the ', stringSpan, ' string')
}



function getRandomNote(sNumber) {
    const flat = getRandomBoolean();
    const notes = flat ? standardTuningFlat[sNumber] : standardTuning[sNumber]
    return notes[getRandomIntInclusive(0, notes.length - 1)]
}

function getStringNumber(number) {
    switch (number) {
        case 1:
            return '1st'
        case 2:
            return '2nd'
        case 3:
            return '3rd'
        default:
            return number + 'th'
    }
}







