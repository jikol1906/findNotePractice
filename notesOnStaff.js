const staffNote = document.getElementById("staff-note");
const stringNumber = document.getElementById("string-number");
const ledgerLines = Array.from(document.getElementsByClassName("ledger-line"));
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const timeBetween = document.getElementById("time-between");
const staffContainer = document.getElementById("staff-container");
const range = document.getElementById("range");






const synth = new Tone.Synth().toDestination();
const notes = generateNotes();
let timeBetweenInMs = 5000;
let intervalId;

range.value = 5;

range.addEventListener('input', e => {
    let value = parseFloat(e.target.value);
    timeBetweenInMs = value * 1000
    timeBetween.textContent = 'Time between notes: ' + (value === 10 ? value : value.toFixed(1)) + ' seconds'
})

startButton.addEventListener('click', _ => {
    menu.style.display = 'none';
    staffContainer.style.display = 'flex';
    stopButton.style.display = 'block';
    Tone.start().then(() => {
        intervalId = setInterval(() => {
            nextNote()
        }, timeBetweenInMs)
        nextNote()
    })

})

stopButton.addEventListener('click', _ => {
    menu.style.display = 'grid';
    staffContainer.style.display = 'none';
    stopButton.style.display = 'none';
    clearInterval(intervalId);
})


function placeNoteOnStaffAtPosition(position) {
    position = Math.min(22, Math.max(0, position))
    staffNote.style.setProperty('--position', position)
    placeLedgerLines(position);
}


function nextNote() {
    const randNote = notes[getRandomIntInclusive(0, 22)]
    const numberOfStrings = randNote.canBePlayedOnStrings.length
    synth.triggerAttackRelease(randNote.note, "4n");
    const span = document.createElement('span');
    span.classList.add('highlight');
    span.textContent = getStringNumber(randNote.canBePlayedOnStrings[getRandomIntInclusive(0, numberOfStrings - 1)]);
    stringNumber.innerHTML = '';
    stringNumber.append('Play on ', span, ' string');
    placeNoteOnStaffAtPosition(randNote.position)
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

function placeLedgerLines(position) {
    ledgerLines.forEach(l => l.style.visibility = 'hidden')
    if (position === 22 || position == 21) {
        showLedgerLines(3, true)
    } else if (position === 20 || position === 19) {
        showLedgerLines(2, true)
    } else if (position === 18 || position === 17) {
        showLedgerLines(1, true)
    } else if (position === 5 || position === 4) {
        showLedgerLines(1, false)
    } else if (position === 3 || position === 2) {
        showLedgerLines(2, false)
    } else if (position === 1 || position === 0) {
        showLedgerLines(3, false)
    }
}

function showLedgerLines(amount, isTopLedgerLines) {
    const topThreeLedgerLines = ledgerLines.slice(0, 3).reverse();
    const bottomThreeLedgerLines = ledgerLines.slice(3);

    if (isTopLedgerLines) {
        for (let i = amount - 1; i >= 0; i--) {
            topThreeLedgerLines[i].style.visibility = 'visible'
        }
    } else {
        for (let i = amount - 1; i >= 0; i--) {
            bottomThreeLedgerLines[i].style.visibility = 'visible'
        }
    }
}

function generateNotes() {
    const strings = generateStandardTuning();

    const notes = [];
    let currentOctave = 3;

    for (let i = 0; i <= 22; i++) {
        if ("EFGABCD"[i % 7] === 'C') { currentOctave++ }
        const currNote = "EFGABCD"[i % 7] + currentOctave;
        const canBePlayedOnStrings = strings
            .map((s, i) => s.includes(currNote) ? i + 1 : -1)
            .filter(s => s !== -1)
        notes.push({
            note: currNote,
            position: i,
            canBePlayedOnStrings
        })
    }
    return notes;
}

function generateHalfToneSequenceOfNotes(startNote, currentOctave, amount, withSharps) {

    const notes = withSharps ? "A A# B C C# D D# E F F# G G#".split(' ') :
        "A Bb B C Db D Eb E F Gb G Ab".split(' ')

    const sequence = [];
    const noteIndex = notes.indexOf(startNote);
    const stopAt = noteIndex + amount;
    for (let i = noteIndex; i <= stopAt; i++) {
        const currNote = notes[i % notes.length];
        if (currNote === 'C') { currentOctave++ }
        sequence.push(currNote + currentOctave)
    }

    return sequence;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function generateStandardTuning() {
    return [
        generateHalfToneSequenceOfNotes('E', 5, 13, true),
        generateHalfToneSequenceOfNotes('B', 4, 12, true),
        generateHalfToneSequenceOfNotes('G', 4, 12, true),
        generateHalfToneSequenceOfNotes('D', 4, 12, true),
        generateHalfToneSequenceOfNotes('A', 3, 12, true),
        generateHalfToneSequenceOfNotes('E', 3, 12, true)
    ]
}

