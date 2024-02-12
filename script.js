var NotificationList = [];
var CreatedNotes = 0;

function AppSettings(isLightMode) {
    this.IsLightMode = isLightMode;
}

function note(Id, Title, Desc) {
    this.Id = Id;
    this.Title = Title;
    this.Desc = Desc;
}

window.onload = function () {
    let container = document.getElementById('note-container');
    let button = document.getElementById('add-button');

    let notesJson = sessionStorage.getItem('notes');
    if (notesJson === null) {
        return;
    }

    let settingsJson = sessionStorage.getItem('notesAppConfigs');
    if (settingsJson === null) {
        return;
    }

    Settings = JSON.parse(settingsJson);
    if (Settings.IsLightMode) {
        document.body.classList.add("light-theme");
    }
    else {
        document.body.classList.remove("light-theme");
    }

    NotificationList = JSON.parse(notesJson);
    if (NotificationList.length === 0) {
        return;
    }
    CreatedNotes = Math.max.apply(Math, NotificationList.map(it => it.Id));
    NotificationList.map((it => container.appendChild(CreateNote(it.Id, it.Title, it.Desc)).after(button)));
};

function CreateNewNote(button, containerId) {
    CreatedNotes++;
    document.getElementById(containerId).appendChild(CreateNote(CreatedNotes)).after(button);
    NotificationList.push(new note(CreatedNotes, undefined, undefined));
}

function CreateNote(currentId, titleValue, descValue) {
    if (titleValue == undefined) {
        titleValue = '';
    }
    if (descValue == undefined) {
        descValue = '';
    }


    let noteElement = `<div class=\"title-bar\">
                           <input placeholder=\"Title\" class=\"title\" oninput="ChangeNoteData(this, 'note-${currentId}', 'title')" value='${titleValue}'/>
                           <button class=\"close-button\" onclick=\"RemoveNote('note-${currentId}')\">x</button>
                       </div >
                       <textarea placeholder=\"Description\" class=\"description\" wrap=\"Soft\" oninput="ChangeNoteData(this, 'note-${currentId}', 'desc')">${descValue}</textarea>`;
    let newElement = document.createElement('section');
    newElement.className = "notes-sizes";
    newElement.innerHTML = noteElement;
    newElement.id = `note-${currentId}`;

    return newElement;
}

function CreateButton() {
    let buttonElement = `<div class="button-style">
                            <p class="button-plus">+</p>
                       </div>
                       <p class="button-text">Add new note</p>`;

    let newElement = document.createElement('button');
    newElement.innerHTML = buttonElement;
    newElement.className = "add-button notes-sizes";
    newElement.id = `add-button`;
    newElement.setAttribute("onclick", "CreateNewNote(this, 'note-container');");
    return newElement;
}

function RemoveNote(noteId) {
    document.getElementById(noteId).remove();
    NotificationList = NotificationList.filter(it => it.Id != GetCurrentId(noteId));
}

function InitNotes(search, containerId) {
    let noteContainer = document.getElementById(containerId);
    noteContainer.innerHTML = '';

    let container = document.getElementById(containerId)

    if (search.value.length != 0) {
        NotificationList.filter(it => it.Title != undefined && it.Title.toLowerCase().includes(search.value.toLowerCase()))
            .map((it => container.appendChild(CreateNote(it.Id, it.Title, it.Desc))));
    }
    else {
        NotificationList.map(it => container.appendChild(CreateNote(it.Id, it.Title, it.Desc)));
        container.appendChild(CreateButton());
    }
}

function ChangeNoteData(tag, noteId, type) {
    let object = NotificationList.find(x => x.Id == GetCurrentId(noteId));
    if (type === 'title') {
        object.Title = tag.value;
    }
    else if (type = 'desc') {
        object.Desc = tag.value;
    }
}

function GetCurrentId(noteId) {
    return noteId.slice(5);
}

function SaveAllNotes() {
    sessionStorage.setItem('notes', JSON.stringify(NotificationList));
}

function ChangeTheme() {
   var currentState = document.body.classList.toggle("light-theme")
   sessionStorage.setItem('notesAppConfigs', JSON.stringify(new AppSettings(currentState)));
}
