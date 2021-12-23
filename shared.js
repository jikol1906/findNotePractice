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


function generateStandardTuning() {
    return [
        generateHalfToneSequenceOfNotes('E', 5, 12, true),
        generateHalfToneSequenceOfNotes('B', 4, 12, true),
        generateHalfToneSequenceOfNotes('G', 4, 12, true),
        generateHalfToneSequenceOfNotes('D', 4, 12, true),
        generateHalfToneSequenceOfNotes('A', 3, 12, true),
        generateHalfToneSequenceOfNotes('E', 3, 12, true)
    ]
}

function generateStandardTuningFlats() {
    return [
        generateHalfToneSequenceOfNotes('E', 5, 12, false),
        generateHalfToneSequenceOfNotes('B', 4, 12, false),
        generateHalfToneSequenceOfNotes('G', 4, 12, false),
        generateHalfToneSequenceOfNotes('D', 4, 12, false),
        generateHalfToneSequenceOfNotes('A', 3, 12, false),
        generateHalfToneSequenceOfNotes('E', 3, 12, false)
    ]
}

