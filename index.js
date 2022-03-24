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
const includeNotesCheckboxes = document.querySelector("#notes-included-checkboxes .label-wrapper")
const strings = [];
let mode;

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

function removeNotes(...notes) {
    iterateAllCheckboxes(cb => {
        if(notes.includes(cb.getAttribute("data-note").replace(/\d/g,""))) {
            cb.checked = false
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

function includeAllNaturalNotes() {
    "ABCDEFG".split("").forEach(includeNote)
}

function includeAllSharpsAndFlats() {
    selectAllNotes()
    removeNotes(..."ABCDEFG".split(""))
}



function clearAllSelectedNotes() {
   iterateAllCheckboxes(cp => cp.checked = false) 
}
function selectAllNotes() {
   iterateAllCheckboxes(cp => cp.checked = true) 
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
    let seq = generateNoteSequence(stringNoteMap);
    let lastNoteOfCurrentSequence = seq[0]
    let mode = document.querySelector("input[name='mode']:checked").value
    if(seq.length < 2) {
        alert("must choose at least two notes")
    } else {
        menu.style.display = 'none';
        game.style.display = 'block';
        stopButton.style.display = 'block';
        Tone.start().then(() => {
            intervalId = setInterval(() => {
                animateTimeLeft()
                insertNextNote(seq.pop())

                //Generate new sequence if old one is empty
                if(seq.length === 0) {
                    seq = generateNoteSequence(stringNoteMap);
                    //Make sure same note won't be played twice
                    const firstNoteInNewSequence = seq[seq.length-1].fullname;
                    const lastNoteInOldSequence = lastNoteOfCurrentSequence.fullname;
                    if(firstNoteInNewSequence === lastNoteInOldSequence) {
                        swapArrayValues(seq,seq.length-1,seq.length-2)
                    }
                    lastNoteOfCurrentSequence = seq[0]
                }

            }, timeBetweenInSeconds)
            animateTimeLeft()
            insertNextNote(seq.pop())
        })
    }

})

stopButton.addEventListener('click', _ => {
    menu.style.display = 'grid';
    game.style.display = '';
    stopButton.style.display = 'none';
    clearInterval(intervalId);
})

function insertNextNote(note) {
    
    const noteSpan = document.createElement("span");
    const stringSpan = document.createElement("span");
    noteSpan.classList.add('highlight')
    stringSpan.classList.add('highlight')

    synth.triggerAttackRelease(note.noteWithOctave, "4n");
    
    noteSpan.append(note.note);
    stringSpan.append(note.onString);

    notes.innerHTML = '';
    notes.append(noteSpan,' on the ', stringSpan, ' string')


}


range.addEventListener('input', e => {
    let value = e.target.value / 10;
    timeBetweenInSeconds = value * 1000
    timeBetween.textContent = 'Time between notes: ' + (value === 10 ? value : value.toFixed(1)) + ' seconds'
})




function getRandomBoolean() {
    return Math.random() >= 0.5;
}

function animateTimeLeft() {
    gsap.fromTo(timeLeft, {scaleX: 1,opacity:1}, {scaleX: 0, opacity:.2, ease:"none", duration: timeBetweenInSeconds/1000});
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
                note:note.replace(/\d/g,""),
                noteWithOctave:note,
                fullname:n,
                onString:+k+1
            })
        })
    }

    return shuffle(notes);
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







