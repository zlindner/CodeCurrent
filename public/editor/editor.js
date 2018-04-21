$(document).ready(function() {
    initEditor();

    $('#newProjectModal').on('show.bs.modal', function(event) {
        resetNewProject();
    });

    $('#createProject').click(function() {
        setProjectName();
    });

    $('#newFile').click(function() {
        newFile();
    });
});

/*
 * Initialization
 */
let editor;

function initEditor() {
    editor = CodeMirror.fromTextArea($('#editor')[0], {
        mode: 'javascript',
        lineNumbers: true,
        indentUnit: 4,
        autoCloseBrackets: true,
    });

    editor.setSize(null, 800);
}

/*
 * New project
 */

//TODO project language?

let projectName;

function setProjectName() {
    let temp = $('#projectNameField').val();

    if (temp.length > 0) {
        $('#projectNameHeader').text(temp);
        $('#newProjectModal').modal('hide');
    } else {
        $('#projectNameErr').text('Invalid project name');
    }
}

function resetNewProject() {
    $('#projectNameField').val('');
    $('#projectNameErr').text('');
}

/*
 * New file
 */

//TODO close button for open files
//TODO probably modal for new file -> file name, language?

function newFile() {
    let html = '<li class="nav-item"><a class="nav-link active" href="#">untitled</a></li>';
    $('#fileTabs').append(html);
}