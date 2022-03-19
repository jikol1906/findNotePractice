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
        cb.setAttribute("checked","true")
        cb.setAttribute("data-x",x)
        cb.setAttribute("data-y",y)
        cb.setAttribute("data-note",note)
        
        const s = document.createElement("span")
        s.innerText = note.replace(/\d/g,"")
        
        l.appendChild(cb)
        l.appendChild(s)
    
        return l;
    }
    for (let i = 0; i < 6; i++) {
        const string = []
        for (let j = 0; j < 12; j++) {
            const noteSharp = standardTuning[i][j]
            const noteFlat = standardTuningFlat[i][j];
            const noteToInsert = noteSharp === noteFlat ? noteSharp : `${noteSharp}/${noteFlat}`
            const cb = createNoteCheckbox(noteToInsert,j,i)
            string.push(cb.querySelector("input"))
            includeNotesCheckboxes.append(cb)
        }
        strings.push(string)
    }
}


initialzeIncludeNoteChecboxes();

function includeNote(note) {
    iterateAllCheckboxes((cb) => {
        if(cb.getAttribute("data-note").replace(/\d/g,"") === note) {
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

function generateStringNoteMap() {
    const res = {};
    
    for (let i = 0; i < strings.length; i++) {
        const string = strings[i].reduce((p,c) => {
            if(c.checked) {
                p.push(c.getAttribute("data-note"))
            }
            return p
        },[])
        if(string.length > 0) {
            res[i] = string
        }
    }

    return res;
}


const synth = new Tone.Synth().toDestination();
let intervalId;

let timeBetweenInSeconds = 5000;
range.value = 50;

startButton.addEventListener('click', _ => {
    
    const stringNoteMap = generateStringNoteMap();
    generateNoteSequence(stringNoteMap)
    if(Object.keys(stringNoteMap).length === 0) {
        alert("must choose at least one note")
    } else {
        menu.style.display = 'none';
        game.style.display = 'block';
        stopButton.style.display = 'block';
        Tone.start().then(() => {
            intervalId = setInterval(() => {
                nextNoteAsLetter(stringNoteMap)
            }, timeBetweenInSeconds)
            nextNoteAsLetter(stringNoteMap)
        })
    }

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


function nextNoteAsLetter(stringNoteMap) {
    const possibleStrings = Object.keys(stringNoteMap);
    const chosenString = possibleStrings[getRandomIntInclusive(0,possibleStrings.length-1)];
    const availableNotes = stringNoteMap[chosenString];
    const note = getRandomNote(availableNotes)
    animateTimeLeft()
    synth.triggerAttackRelease(note, "4n");

    const noteSpan = document.createElement("span");
    const stringSpan = document.createElement("span");
    noteSpan.classList.add('highlight')
    stringSpan.classList.add('highlight')

    noteSpan.append(note.replace(/\d+/g,""))
    stringSpan.append(getStringNumber(+chosenString+1))
    notes.innerHTML = '';
    notes.append(noteSpan,' on the ', stringSpan, ' string')
}

function generateNoteSequence(stringNoteMap){
    const notes = [];

    for(k in stringNoteMap) {
        const string = stringNoteMap[k];
        string.forEach(n => {
            let note = n;
            if(n.includes("/")) {
                const flat = getRandomBoolean();
                const [flatNote,sharpNote] = n.split("/");
                note = flat ? flatNote : sharpNote;   
            }

            notes.push({
                note,
                fullname:n,
                onString:k
            })
        })
    }

    return shuffle(notes);
}



function getRandomNote(availablenotes) {
    let note = availablenotes[getRandomIntInclusive(0,availablenotes.length-1)]
    if(note.includes("/")) {
        const flat = getRandomBoolean();
        const [flatNote,sharpNote] = note.split("/");
        note = flat ? flatNote : sharpNote;
    }
    return note
    
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

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  function swapArrayValues(arr, indexA, indexB) {
    var temp = arr[indexA];
    arr[indexA] = arr[indexB];
    arr[indexB] = temp;
  };







