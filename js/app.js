const noteList = {
  notes: [{
    noteText: 'Review Conor\'s portfolio.',
    borderColor: '#008000'
  },
  {
    noteText: 'Interview Conor.',
    borderColor: '#008000'
  },
  {
    noteText: 'Hire Conor!',
    borderColor: '#008000'
  }],

  addNote(noteText) {
    this.notes.push({
      noteText,
      borderColor: '#008000'
    });
  },

  editNote(position, noteText) {
    this.notes[position - 1].noteText = noteText;
  },

  deleteNote(position) {
    this.notes.splice(position, 1);
  },

  toggleColor(position, borderColor) {
    const note = this.notes[position - 1];
    note.borderColor = borderColor;
  }
};

const handlers = {
  addNote() {
    const addNoteTextInput = document.getElementsByClassName('add-note__text-input')[0];
    // This conditional prevents the user from accidentally adding empty notes.
    if (addNoteTextInput.value !== '') {
      noteList.addNote(addNoteTextInput.value);
      addNoteTextInput.value = '';
      view.displayNotes();
    }
  },

  editNote() {
    const editNotePositionInput = document.getElementsByClassName('edit-note__position-input')[0];
    const editNoteTextInput = document.getElementsByClassName('edit-note__text-input')[0];
    if (editNotePositionInput.valueAsNumber && editNoteTextInput.value !== '') {
      noteList.editNote(editNotePositionInput.valueAsNumber, editNoteTextInput.value);
      editNotePositionInput.value = '';
      editNoteTextInput.value = '';
    }
    view.displayNotes();
  },

  deleteNote(position) {
    noteList.deleteNote(position);
    const toggleColorPositionInput = document.getElementsByClassName('color-picker__position-input')[0];
    if (toggleColorPositionInput.valueAsNumber > noteList.notes.length) {
      toggleColorPositionInput.value = noteList.notes.length;
    }
    view.displayNotes();
  },

  toggleColor(borderColor) {
    const toggleColorPositionInput = document.getElementsByClassName('color-picker__position-input')[0];
    if (toggleColorPositionInput.valueAsNumber && borderColor) {
      noteList.toggleColor(toggleColorPositionInput.valueAsNumber, borderColor);
      view.displayNotes();
    }
  }
};

const view = {
  displayNotes() {
    const notesUl = document.getElementsByClassName('note-list')[0];
    notesUl.innerHTML = '';
    const fragment = document.createDocumentFragment();

    noteList.notes.forEach((note, position) => {
      const noteLi = document.createElement('li');
      noteLi.setAttribute('class', 'note-item');
      noteLi.style.border = `2px solid ${note.borderColor}`;
      noteLi.id = position;
      noteLi.textContent = note.noteText;
      noteLi.appendChild(this.createDeleteButton());
      fragment.appendChild(noteLi);
    });

    notesUl.appendChild(fragment);

    // If there are no notes, display a message to the the user saying so and disable appropriate
    // button and inputs. Likewise, enable the inputs and buttons again when a note is added.
    const msg = document.getElementsByClassName('no-notes')[0];
    if (noteList.notes.length === 0) {
      msg.style.display = 'block';
      document.getElementsByClassName('edit-note__button')[0].disabled = true;
      document.getElementsByClassName('edit-note__position-input')[0].disabled = true;
      document.getElementsByClassName('edit-note__text-input')[0].disabled = true;
      document.getElementsByClassName('color-picker')[0].disabled = true;
      document.getElementsByClassName('color-picker__position-input')[0].disabled = true;
    } else {
      msg.style.display = 'none';
      document.getElementsByClassName('edit-note__button')[0].disabled = false;
      document.getElementsByClassName('edit-note__position-input')[0].disabled = false;
      document.getElementsByClassName('edit-note__text-input')[0].disabled = false;
      document.getElementsByClassName('color-picker')[0].disabled = false;
      document.getElementsByClassName('color-picker__position-input')[0].disabled = false;
    }
  },

  createDeleteButton() {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    return deleteButton;
  },

  setUpEventListeners() {
    const addNoteButton = document.getElementsByClassName('add-note__button')[0];
    const addNoteTextInput = document.getElementsByClassName('add-note__text-input')[0];
    const editNoteButton = document.getElementsByClassName('edit-note__button')[0];
    const toggleEditNotePositionInput = document.getElementsByClassName('edit-note__position-input')[0];
    const editNoteTextInput = document.getElementsByClassName('edit-note__text-input')[0];
    const toggleColorPositionInput = document.getElementsByClassName('color-picker__position-input')[0];
    const colorButton = document.getElementsByClassName('color-picker')[0];
    const notesUl = document.getElementsByClassName('note-list')[0];

    addNoteButton.addEventListener('click', handlers.addNote);
    editNoteButton.addEventListener('click', handlers.editNote);

    colorButton.addEventListener('click', ({ target }) => {
      const { color } = target.dataset;
      if (color) {
        handlers.toggleColor(target.dataset.color);
      }
    });

    notesUl.addEventListener('click', event => {
      const elementClicked = event.target;
      if (elementClicked.className === 'delete-button') {
        handlers.deleteNote(parseInt(elementClicked.parentNode.id, 10));
      }
    });

    // These next two event listeners prevent the 'Edit Note' and 'Note Color' numer input toggles
    // from increasing past the current note count.
    toggleEditNotePositionInput.addEventListener('click', () => {
      if (toggleEditNotePositionInput.valueAsNumber > noteList.notes.length) {
        toggleEditNotePositionInput.value = noteList.notes.length;
      }
    });

    toggleColorPositionInput.addEventListener('click', () => {
      if (toggleColorPositionInput.valueAsNumber > noteList.notes.length) {
        toggleColorPositionInput.value = noteList.notes.length;
      }
    });

    // Allows the user to hit 'Enter' when using inputs.
    function allowEnter(event, button) {
      event.preventDefault();
      if (event.keyCode === 13) button.click();
    }

    addNoteTextInput.addEventListener('keyup', event => {
      allowEnter(event, addNoteButton);
    });

    editNoteTextInput.addEventListener('keyup', event => {
      allowEnter(event, editNoteButton);
    });

    toggleColorPositionInput.addEventListener('keyup', event => {
      allowEnter(event, colorButton);
    });
  }
};

view.setUpEventListeners();
view.displayNotes();
