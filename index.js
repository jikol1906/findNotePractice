const notesWithSharps = "A A# B C C# D D# E F F# G G#".split(' ')
const notesWithFlats = "A Bb B C Db D Eb E F Gb G Ab".split(' ')
const naturalNotes = notesWithSharps.filter(n => !n.includes('#'));
const notesWithStaffPosition = generateNotesWithStaffPostion();
let includeAccidentals = false;




const notes = document.getElementById("notes");
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const range = document.getElementById("range");
const timeBetween = document.getElementById("time-between");
const timeLeft = document.getElementById("time-left");
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const staffNote = document.getElementById("staff-note");
const ledgerLines = Array.from(document.getElementsByClassName("ledger-line"));

const synth = new Tone.Synth().toDestination();
let intervalId;
let staffMode = false;
let timeBetweenInSeconds = 5000;
range.value = 50;

startButton.addEventListener('click', _ => {
    menu.style.display = 'none';
    game.style.display = 'block';
    stopButton.style.display = 'block';
    Tone.start().then(() => {
        intervalId = setInterval(() => {
            nextNote()
        }, timeBetweenInSeconds)
        nextNote()
    })

})

stopButton.addEventListener('click', _ => {
    menu.style.display = 'block';
    game.style.display = '';
    stopButton.style.display = 'none';
    clearInterval(intervalId);
})

range.addEventListener('input', e => {
    let value = e.target.value / 10;
    timeBetweenInSeconds = value * 1000
    timeBetween.textContent = 'Time between notes: ' + (value === 10 ? value : value.toFixed(1)) + ' seconds'
})

function generateNotesWithStaffPostion() {
    const notes = [];
    let currentOctave = 3;



}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function getRandomBoolean() {
    return Math.random() >= 0.5;
}

function nextNote() {
    if (!staffMode) {
        nextNoteAsLetter()
    } else {
        nextNoteOnStaff();
    }

}

function placeNoteOnStaffAtPosition(position) {
    position = Math.min(22, Math.max(1, position))
    staffNote.style.setProperty('--position', position)
    placeLedgerLines(position);
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
    } else if (position === 1) {
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

function nextNoteAsLetter() {
    const note = getRandomNote();
    reset_animation();
    timeLeft.style.animation = 'shrink ' + timeBetweenInSeconds + 'ms linear infinite';
    synth.triggerAttackRelease(note + "4", "4n");
    notes.innerHTML = '<span class="highlight">' + note + '</span> <span style="font-size:2.5rem"> on the </span> ' + '<span class="highlight">' + getStringNumber(getRandomIntInclusive(1, 6)) + '</span>' + ' <span style="font-size:2.5rem"> string </span>'
}

function reset_animation() {
    var el = document.getElementById('time-left');
    el.style.animation = 'none';
    el.offsetHeight; /* trigger reflow */
    el.style.animation = null;
}

function getRandomNote() {
    return getRandomBoolean() ? notesWithSharps[getRandomIntInclusive(0, 11)] : notesWithFlats[getRandomIntInclusive(0, 11)];
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







