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
const staffNote = document.getElementById("staff-note");
const ledgerLines = Array.from(document.getElementsByClassName("ledger-line"));

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




function nextNoteAsLetter() {
    const stringNumber = getRandomIntInclusive(0, 5);
    const note = getRandomNote(stringNumber);
    reset_animation();
    timeLeft.style.animation = 'shrink ' + timeBetweenInSeconds + 'ms linear infinite';
    synth.triggerAttackRelease(note, "4n");
    notes.innerHTML = '<span class="highlight">' + note.replace(/\d+/g,"") + '</span> <span style="font-size:2.5rem"> on the </span> ' + '<span class="highlight">' + getStringNumber(stringNumber+1) + '</span>' + ' <span style="font-size:2.5rem"> string </span>'
}

function reset_animation() {
    var el = document.getElementById('time-left');
    el.style.animation = 'none';
    el.offsetHeight; /* trigger reflow */
    el.style.animation = null;
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







