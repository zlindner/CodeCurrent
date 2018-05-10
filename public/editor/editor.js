$(document).ready(function() {
    /*
     * Menu bar
     */
    $('#createProject').click(function() {
        if (setProjectName() && setProjectLang()) {
            createProject();
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
    let close = false;

    //TODO close nearest to left tab rather than first
    $(document).on('click', '.closetab', function() {
        let open = $(this.parentNode).hasClass('opentab');

        console.log($(this.parentNode).index());

        //this.parentNode.parentNode.removeChild(this.parentNode);

        if (open) {
            let tabs = $('.filetab');

            //console.log(tabs.indexOf(this.parentNode));

            if (tabs.length != 0) {
                $(tabs[0]).addClass('opentab');
            }
        }

        close = true;
    });

    $(document).on('click', '.filetab', function() {
        if (close) {
            close = false;

            return;
        }

        $('.opentab').removeClass('opentab');
        $(this).addClass('opentab');
    });

    /*
     * File tree
     */

    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/jstree',
        data: {
            project_dir: 'fdsafdasfas'
        },
        success: function(data) {
            $('#projTree').jstree(data);
        },
        fail: function(error) {

        }
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

function createProject() {
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/mkdir',
        data: {
            dir: projectName
        },
        success: function(data) {
            $('#newProjectModal').modal('hide');

            $('#newFileMenuButton').removeClass('disabled');
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
    let html = '<div class="filetab opentab"><span class="closetab noselect">&times;</span><p class="filename noselect">' + filename + '</p></div>';

    $('.opentab').removeClass('opentab');

    $('#filebar').append(html);

    $('#newFileModal').modal('hide');
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