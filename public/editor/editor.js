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
 * Editor
 */

let editor;
let editorShown = false;

function initEditor() {
    editor = CodeMirror.fromTextArea($('#editor')[0], {
        lineNumbers: true,
        indentUnit: 4,
        autoCloseBrackets: true,
    });

    editor.setSize(null, 800);

    $(editor.getWrapperElement()).hide();
}

/*
 * New project
 */

let projectName;
let projectLang;

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
        let mode = $("#projectLangSelect option:selected").attr('data-mime-type');
        let script = $("#projectLangSelect option:selected").attr('data-script');
        let s = document.createElement('script');

        s.src = 'http://codemirror.net/mode/' + script + '/' + script + '.js';
        s.async = true;

        s.onload = function() {
            editor.setOption("mode", mode);
        }

        document.head.appendChild(s);
        $('#projectLangErr').text('');
        projectLang = lang;

        return true;
    } else {
        $('#projectLangErr').text('You must specify a language for the project');

        return false;
    }
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
//TODO get possible file types for language selected (like idea)
//TODO set templates for file types
//TODO support highliting for certain file types in a certain project type (ex. javascript project w/ special highlighting for json files, makefiles, etc.)

let openFiles = 0;

function newFile() {
    let html = '<li class="nav-item"><a class="nav-link active" href="#">untitled</a></li>';
    $('#fileTabs').append(html);

    openFiles++;

    if (!editorShown) {
        $(editor.getWrapperElement()).show();
    }
}