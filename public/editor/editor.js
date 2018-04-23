$(document).ready(function() {
    initEditor();

    $('#newProjectModal').on('show.bs.modal', function(event) {
        resetNewProject();
    });

    $('#createProject').click(function() {
        if (setProjectName() && setProjectLang()) {
            $('#newProjectModal').modal('hide');
        }
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

let projectName;

function setProjectName() {
    let name = $('#projectNameField').val();

    if (name.length > 0) {
        $('#projectNameHeader').text(name);
        $('#projectNameErr').text('');

        return true;
    }

    $('#projectNameErr').text('Invalid project name');

    return false;
}

function setProjectLang() {
    let lang = $('#projectLangSelect').val();

    if (lang != null) {
        editor.setOption("mode", lang);
        $('#projectLangErr').text('');

        return true;
    }

    $('#projectLangErr').text('You must specify a language for the project');

    return false;
}

function resetNewProject() {
    $('#projectNameField').val('');
    $('#projectNameErr').text('');
    $("#projectLangSelect").get(0).selectedIndex = 0;
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