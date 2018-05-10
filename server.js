'use strict'

let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
let helmet = require('helmet');
let fs = require('fs');
let glob = require('glob');

app.use(express.static('public'));
app.use(helmet());

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index/index.html');
});

app.get('/createProjectDir', function(req, res) {
    let dir = req.query.dir;

    fs.mkdir('project_files/' + dir, function() {
        res.send(true);
    });
});

app.get('/createFile', function(req, res) {
    let dir = req.query.dir;
    let file = req.query.file;

    fs.writeFile('project_files/' + dir + '/' + file, '');

    res.send(true);
});

app.get('/jstree', function(req, res) {
    let dir = req.query.dir;

    getDirectories('project_files/' + dir, function(err, files) {
        if (err) {
            console.log('Error', err);
        } else {
            let data = [{
                id: dir,
                parent: '#',
                text: dir
            }];

            for (let file in files) {
                files[file] = files[file].substring(14);

                let parents = files[file].split('/');
                let text = files[file].split('/');
                let icon;

                //TODO better way to determine file vs dir
                if (text[parents.length - 1].includes('.')) {
                    icon = 'jstree-file';
                } else {
                    icon = '';
                }

                let info = {
                    id: text[parents.length - 1],
                    parent: parents[parents.length - 2],
                    text: text[parents.length - 1],
                    icon: icon
                };

                data.push(info);
            }

            let core = {
                core: {
                    data: data
                }
            }

            res.send(core);
        }
    });
});

let getDirectories = function(src, callback) {
    glob(src + '/**/*', callback);
};

server.listen(9000);
console.log('Server running on port 9000');