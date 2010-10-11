## About

This is my diploma thesis. Enjoy. Read more about the thesis <a href="http://lenaherrmann.net/tag/thesis">in my blog</a>.

<a href=" http://lena.couchone.com:5984/doingnotes/_design/doingnotes/index.html">You can try out the outliner here</a>. The whole fun only starts though when you also "install" it on your local CouchDB instance, and open that and the program on the server in two different browser windows. Then you can see how updates on the server (or on other peoples CouchDB instances) are automatically replicated to your computer.

To see this, make sure you have the right server URL set in /_attachments/app/config/config.js.

## Outliner usage

Create a new outline and start to write.

- Enter: create and jump to a new line
- Up/down: jump one line up/down
- Tab: Indent a line
- Shift+Tab: Unindent a line

When solving a write conflict:

- Tab or Shift+Tab: Jump between versions

You can also delete outlines and change their titles.

## Installation

- Install CouchDB. 
  - The fastest way is to download <a href="http://janl.github.com/couchdbx/">CouchDBX</a>.
  - You can also install CouchDB from source <a href="http://couchdb.apache.org/downloads.html">from the latest release</a> or from the latest SVN version: <a href="http://wiki.apache.org/couchdb/Installing_on_OSX">Scroll down on this page</a> for instructions for Snow Leopard, or <a href="http://wiki.apache.org/couchdb/Installation">look here for other OS</a>.
- Install <a href="http://couchapp.org/page/index">Couchapp</a>
- Get a Browser that supports Javascript HTML5. Only <a href="http://getfirefox.com/">Firefox >= 3.5</a> is guaranteed to work, Safari might not work so well with the continuous changes feed.
- Start CouchDB as instructed. If you installed from source, you can amend the Rakefile with your CouchDB location and use the raketask "rake couch:start4"
- Git clone this repository. Rename .couchapprc_example to .couchapprc.
- Do 'couchapp push' in the doingnotes project folder to deploy/"install" doingnotes into your local CouchDB.
- Visit <a href="http://localhost:5984/doingnotes/_design/doingnotes/index.html">http://localhost:5984/doingnotes/_design/doingnotes/index.html</a>

## Running the tests

### Integration tests

- $ cd features
- $ cucumber/*.feature

### Unit tests
Open the file _attachments/app/spec/index.html and uncomment the specs you want to run. 

## Replication notifications from remote

- Install, start and deploy CouchDB, Couchapp and doingnotes as instructed above.
- <a href=" http://lena.couchone.com:5984/doingnotes/_design/doingnotes/index.html">The application is running here already</a>. Set the server URL constant in /_attachments/app/config/config.js to http://lena.couchone.com:5984/doingnotes to replicate with this application. Make sure to do a 'couchapp push' afterwards.
- Visit <a href="http://localhost:5984/doingnotes/_design/doingnotes/index.html">http://localhost:5984/doingnotes/_design/doingnotes/index.html</a> and open an outline.
- Open the same outline on <a href=" http://lena.couchone.com:5984/doingnotes/_design/doingnotes/index.html">the server</a> in another browser window, change something in there, and see the instant changes on your local instance.


## Replication notifications on your local machine

- You need to <a href="http://code.google.com/p/couchdb-lounge/wiki/SettingUpTwoCouchInstances">set up two CouchDB instances on your machine</a> first. 
- Make sure the server URL constant is set to http://localhost:5985 in /_attachments/app/config/config.js
- Start the second couch instance (on port 5985) in another Browser window. 
- Open the same outline with both browser windows and type in the window where it says "you won't see any changes here".
- See a notification in the client window (port 5984)

## Conflict resolution 

You need to open the same outline on two couch instances in two windows. Then:
 
- stop the first couch instance, 
- write something in the second window, 
- stop the second couch instance, 
- start the first couch instance, 
- write something in the same line in the first window, 
- start the second couch instance. 

Then you have a write conflict. For creating an append conflict, add a new line to the same line instead of writing in it. You can also create both conflicts for the same line, or multiple (different) conflicts in one outline, or conflicts between more than two instances. But don't expect the outliner to handle all these cases gracefully!

As a shortcut for this lengthy procedure, there are a couple of rake tasks to help you bring your DB into certain states:

- rake:writeconflict or rake:twowriteconflicts or rake:nicewriteconflict
- rake:appendconflict
- rake:appendandwriteconflict

