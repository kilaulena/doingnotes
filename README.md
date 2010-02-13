## About

This is going to be my diploma thesis. Enjoy. Report bugs. But don't share (yet) or I'll fail ;)

You can try the program on http://184.73.233.128.

The whole fun only starts though when you also "install" it locally (I call that client), and open it and the program on the server in two different browser windows. Then you can see how updates on the server (or on other clients) are autmatically replicated to your client programm.

To see this, make sure you have the right server URL set in /_attachments/app/config/config.js.

## Usage

Create a new outline and start to write.

- Enter: create and jump to a new line
- Up/down: jump one line up/down
- Tab: Indent a line
- Shift+Tab: Unindent a line

When solving a write conflict:

- Tab or Shift+Tab: Jump between versions


## Installation

- Install CouchDB. 
  - The fastest way is to download <a href="http://janl.github.com/couchdbx/">CouchDBX</a>, but with the 0.10.0 version you currently get you can't test the repliaction and conflict resolution stuff.
  - So it's better to install CouchDB from source with the latest SVN version: <a href="http://wiki.apache.org/couchdb/Installing_on_OSX">Scroll down on this page</a> for instructions for Snow Leopard, or <a href="http://wiki.apache.org/couchdb/Installation">look here for other OS</a>.
- Install <a href="http://github.com/couchapp/couchapp">Couchapp</a>
- Get a Browser that supports Javascript HTML5 (only <a href="http://getfirefox.com/">Firefox >= 3.5</a> is currently supported, Safari might not work so well with the continuous changes feed)
- Start CouchDB - for this you can amend the Rakefile with your CouchDB location and use the raketask "rake couch:start4"
- 'couchapp push' in the doingnotes project folder
- visit <a href="http://localhost:5984/doingnotes/_design/doingnotes/index.html">http://localhost:5984/doingnotes/_design/doingnotes/index.html</a>

## Running the tests

### Integration tests

- $ cd features
- $ cucumber/*.feature

### Unit tests
Open the file _attachments/app/spec/index.html and uncomment the specs you want to run. 

## Testing Replication notifications

- You need to <a href="http://code.google.com/p/couchdb-lounge/wiki/SettingUpTwoCouchInstances">set up two CouchDB instances on your machine</a> first. 
- Make sure the server URL constant is set to http://localhost:5985 in /_attachments/app/config/config.js
- Start the second couch instance (on port 5985) in another Browser window. 
- Open the same outline with both browser windows and type in the window where it says "You are on the server"
- See a notification in the client window (port 5984)

## Testing Conflict resolution 

You need to open the same outline on two couch instances in two windows. Then:
 
- stop the first couch instance, 
- write something in the second window, 
- stop the second couch instance, 
- start the first couch instance, 
- write something in the same line in the first window, 
- start the second couch instance. 

Then you have a write conflict. For creating an append conflict, add a new line to the same line instead of writing in it. You can also create both conflicts for the same line, or multiple (different) conflicts in one outline. But don't expect the outliner to handle this last case gracefully!

As a shortcut for this lengthy procedure, there are a couple of rake tasks to help you bring your DB into certain states:

- rake:writeconflict or rake:twowriteconflicts 
- rake:appendconflict
- rake:appendandwriteconflict

