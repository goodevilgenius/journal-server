# journal-server

This acts as a simpe node server to serve up all files in a given directory, with a listing of the files, served in a simple JSON array, at the root of the server.

This is intended to serve up journal files generated by [droplogger](https://github.com/goodevilgenius/droplogger/), but could be used for a number of things.

Future versions will add some security features.

## Usage

Before anything else, you will need npm or yarn available.

First, create a directory that will house the server. The files to be served would best be added as a subfolder of this folder.

Initialize this directory as a node project with `npm init`, or `yarn init`.

Next, add the server with `npm install git@github.com:goodevilgenius/journal-server.git` or `yarn add git@github.com:goodevilgenius/journal-server.git` (I don't currently have plans to add it to the npm registry).

Next, add your sub-directory of files to be served. If you've already been using droplogger, you could mv your `Journal` folder to this folder (make sure to update your `droplogger` configuration).

Modify the `package.json` by adding the following:

```json
"scripts":{
    "start":"journal-server -f Journal"
}
```

Replace `Journal` with the name of the directory to be served.

You can also add a port to serve it on with `-p PORT`. Without, it will use the `PORT` environment variable, or lackking that, 8080.

The server also supports authorization through a Bearer token. It only supports using a single token. This can be specified on the command-line using the `-t` command-line switch, or by setting the `BEARER_TOKEN` environment variable. If neither of these are set, there will be no authorization check, meaning anybody will have access.

If CORS support is required (it probably is), you can enable it by passing the `-c` flag, or by setting the `CORS` environment variable to a non-empty value.

Next, run `npm start` to start the server.

You can deploy just about anywhere.

## Alternate usage

It can also be installed globally, and used with any folder on the filesystem.
