#!/usr/bin/env node

'use strict';

/*
 * -p, --port PORT
 * -d, --directoy, -f, --folder FOLDER to serve
 */

var Promise = require('bluebird');
const fs = require('fs');
const PORT = process.env.PORT || 8080;

const args = require('minimist')(process.argv.slice(2), {
    boolean: ['help'],
    string: ['port', 'folder', 'token'],
    alias: {
        help: ['h'],
        port: ['p'],
        token: ['t'],
        folder: ['directory', 'd', 'f']
    },
    "default": {
        port: PORT,
        token: process.env.BEARER_TOKEN,
        folder: 'Journal'
    }
});

if (args.help) {
    console.log(`
  Example usage
    $ journal-server <options>

  Options
    --help, -h                     Print this help
    --port, -p                     Port to run the server (defaults to ${PORT})
    --folder, -f, --directory, -d  Directory to serve, defaults to ./Journal
    --token, -t                    Bearer token to check from header

  If no port is specified, it will use the PORT environment variable, or 8080 otherwise.

  If no token is specified, it will use the BEARER_TOKEN variabble. If that's not specified, no security will be used.
    `);
    process.exit();
}

const express = require('express');
const app = express();
const readdir = Promise.promisify(fs.readdir);

if (args.token) {
    app.use(function(req, res, next) {
        let auth = req.get('Authorization') || '';
        let isBearer = auth.substr(0, 7) === 'Bearer ';
        let bearer = auth.substr(7);

        if (isBearer && bearer == args.token) {
            next();
            return;
        }

        res.status(403).send('');
    });
}

let filesPromise = readdir(args.folder).catch(function (err) {
    console.error(err.message);
    process.exit(1);
});

filesPromise.then(function (files) {
    app.get('/', (req, res) => res.json(files));

    app.use(express.static(args.folder));
    app.listen(args.port, function() {
        console.log(`Listening on port ${args.port}`);
    });
});
