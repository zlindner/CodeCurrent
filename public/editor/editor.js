$(document).ready(function() {
    /*
     * Editor
     */
    initEditor();

    /*
     * Menu bar
     */
    $('#createProject').click(function() {
        if (setProjectName() && setProjectLang()) {
            createProject();
            createProjectTree();
        }
    });

    $('#createFile').click(function() {
        if (setFilename()) {
            createFile();
        }
    });

    $('#newProjectModal').on('show.bs.modal', function(e) {
        resetNewProject();
    });

    //TODO fix new file button disabling when no project
    $('#newFileModal').on('show.bs.modal', function(e) {
        resetNewFile();
    });

    //TODO temp
    $('form').submit(function(e) {
        e.preventDefault();
    });

    /*
     * File bar
     */

    $(document).on('click', '.closetab', function(e) {
        closeFile(this, e);
    });

    $(document).on('click', '.filetab', function() {
        openFile(this);
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

    editor.setSize(null, 900);

    hideEditor();
}

function hideEditor() {
    if (editorShown) {
        $(editor.getWrapperElement()).hide();
        editorShown = false;
    }
}

function showEditor() {
    if (!editorShown) {
        $(editor.getWrapperElement()).show();
        editorShown = true;
    }
}

/*
 * Menu bar
 */

function closeFile(x, e) {
    e.stopPropagation(); // prevent openFile() being called

    let wasOpen = $(x.parentNode).hasClass('opentab');
    let tabs = $('.filetab').toArray();
    let index = tabs.indexOf(x.parentNode);

    x.parentNode.parentNode.removeChild(x.parentNode); // remove tab

    if (wasOpen) {
        tabs = $('.filetab').toArray(); // need to update the tabs as a child was removed

        if (tabs.length != 0) {
            if (index == 0) {
                $(tabs[0]).addClass('opentab');
            } else {
                $(tabs[index - 1]).addClass('opentab');
            }
        }
    }

    if (tabs.length == 0) {
        hideEditor();
    }
}

function openFile(tab) {
    $('.opentab').removeClass('opentab');
    $(tab).addClass('opentab');

    //TODO load file contents into editor
}

/*
 * New project
 */

let projectName;
let projectLang;

function createProject() {
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/createProjectDir',
        data: {
            dir: projectName
        },
        success: function(data) {
            $('#newProjectModal').modal('hide');

            $('#newFileMenuButton').removeClass('disabled');

            $('#projName').text(projectName);
        },
        fail: function(error) {

        }
    });
}

function setProjectName() {
    let name = $('#projectNameField').val();

    if (name.length > 0) {
        projectName = name;

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
            //editor.setOption("mode", mode);
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

//TODO file type
//TODO get possible file types for language selected (like idea)
//TODO set templates for file types
//TODO support highliting for certain file types in a certain project type (ex. javascript project w/ special highlighting for json files, makefiles, etc.)

let filename;

function createFile() {
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/createFile',
        data: {
            dir: projectName,
            file: filename
        },
        success: function(data) {
            $('#newFileModal').modal('hide');

            let html = '<div class="filetab opentab"><span class="closetab noselect">&times;</span><p class="filename noselect">' + filename + '</p></div>';
            $('.opentab').removeClass('opentab');
            $('#filebar').append(html);

            refreshProjectTree();

            showEditor();
        },
        fail: function(error) {

        }
    });
}

function setFilename() {
    let name = $('#filenameField').val();

    if (name.length > 0) {
        filename = name;
        $('#filenameErr').text('');

        return true;
    }

    $('#filenameErr').text('You must specify a filename for the file');

    return false;
}

function resetNewFile() {
    $('#filenameField').val('');
    $('#filenameErr').text('');
}

/*
 * Project file tree
 */

//TODO configure jstree

function createProjectTree() {
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/jstree',
        data: {
            dir: projectName
        },
        success: function(data) {
            $('#projTree').jstree(data);
        },
        fail: function(error) {

        }
    });
}

function refreshProjectTree() {
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/jstree',
        data: {
            dir: projectName
        },
        success: function(data) {
            $('#projTree').jstree(true).settings = data;
            $('#projTree').jstree(true).refresh();
        },
        fail: function(error) {

        }
    });
}