## About

This is going to be my diploma thesis. Enjoy.

## Installation:

- Download CouchDB >= 0.10.0, eg <a href="http://janl.github.com/couchdbx/">CouchDBX</a>
- Install <a href="http://github.com/couchapp/couchapp">Couchapp</a>
- Get a Browser that supports Javascript HTML5 (current <a href="http://getfirefox.com/">Firefox</a> or Safari will do)
- 'couchapp push' in the doingnotes project folder
- visit <a href="http://localhost:5984/doingnotes/_design/doingnotes/index.html">http://localhost:5984/doingnotes/_design/doingnotes/index.html</a>
- at the moment my personal settings are in .couchapprc, you have to change them, or create a CouchDB user with pattern: curl -X PUT $HOST/_config/admins/anna -d '"secret"'