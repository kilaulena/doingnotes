require 'rake'
require 'rake/testtask'
require 'rake/rdoctask'

require 'restclient'

def host
  'http://localhost:5984'
end

def server
  'http://localhost:5985'
  # 'http://184.73.233.128'
end

def database
  'doingnotes'
end

namespace :couch do
  desc 'deletes and recreates the database and pushes the app to server on port 5984'
  task :recreate4 do
    puts 'Deleting and recreating database to 5984 ...'
    RestClient.delete "#{host}/#{database}" rescue nil
    RestClient.put "#{host}/#{database}", ""
    puts '... pushing app ...'
    system "couchapp push #{host}/#{database}"
    puts '... ready.'
  end
  
  desc 'deletes and recreates the database and pushes the app to the server on port 5985'
  task :recreate5 do
    puts 'Deleting and recreating database to 5985 ...'
    RestClient.delete "#{server}/#{database}" rescue nil
    RestClient.put "#{server}/#{database}", ""
    puts '... pushing app ...'
    system "couchapp push #{server}/#{database}"
    puts '... ready.'
  end
  
  desc "delete, create and push server and localhost"
    task :recreateboth => [:recreate4, :recreate5]


  desc "wait for two seconds"
  task :wait do
    puts "Waiting for two seconds ..."
    sleep(2)
  end
    
    
  desc "start 5984"
  task :start4 do
    puts 'Starting CouchDB on 5984'
    system "sudo -i -u couchdb '/usr/local/bin/couchdb -a /usr/local/etc/couchdb/local-1.ini -p /usr/local/var/run/couchdb/couchdb-1.pid -o /usr/local/var/log/couchdb/error-1.log -e /usr/local/var/log/couchdb/error-1.log -b'"
  end
  
  desc "start 5985"
  task :start5 do
    puts 'Starting CouchDB on 5985'
    system "sudo -i -u couchdb '/usr/local/bin/couchdb -a /usr/local/etc/couchdb/local-2.ini -p /usr/local/var/run/couchdb/couchdb-2.pid -o /usr/local/var/log/couchdb/error-2.log -e /usr/local/var/log/couchdb/error-2.log -b'"
  end
  
  desc "start 5984 and 5985"
    task :startboth => [:start4, :start5]
  
  desc "stop 5984"
  task :stop4 do
    puts 'Stopping CouchDB on 5984'
    system "sudo -i -u couchdb '/usr/local/bin/couchdb -a /usr/local/etc/couchdb/local-1.ini -p /usr/local/var/run/couchdb/couchdb-1.pid -o /usr/local/var/log/couchdb/error-1.log -e /usr/local/var/log/couchdb/error-1.log -d'"
  end

  desc "stop 5985"
  task :stop5 do
    puts 'Stopping CouchDB on 5985'
    system "sudo -i -u couchdb '/usr/local/bin/couchdb -a /usr/local/etc/couchdb/local-2.ini -p /usr/local/var/run/couchdb/couchdb-2.pid -o /usr/local/var/log/couchdb/error-2.log -e /usr/local/var/log/couchdb/error-2.log -d'"
  end
  
  desc "stop 5984 and 5985"
    task :stopboth => [:stop4, :stop5]
  
  desc "create an outline"
  task :createoutline do
    puts 'Creating Outline with id "01234567890".'
    system 'curl -X PUT http://localhost:5984/doingnotes/01234567890 -d \'{"created_at" : "2010/01/24 20:45:51 +0000", "kind": "Outline", "title": "test"}\''
  end

  desc "stop, start, recreate databases and create an outline"
  task :restartrecreateoutline => [:stopboth, :startboth, :wait, :recreateboth, :createoutline]
  
  
  desc "post a note to 5984"
  task :postto4 do
    puts "Bulk posting Note with ID \"111\" to 5984."
    system 'curl -d \'{"all_or_nothing": true, "docs":[{"_id":"111", "created_at": "2010/01/24 20:53:48 +0000", "updated_at": "2010/01/24 20:53:51 +0000", "kind": "Note", "text": "single from client", "source": "eb8abd1c45f20c0989ed79381cb4907d", "outline_id": "01234567890", "first_note": true}]}\' -X POST http://localhost:5984/doingnotes/_bulk_docs'
  end
  
  desc "post a note to 5985"
  task :postto5 do
    puts "Bulk posting Note with ID \"111\" to 5985."
    system 'curl -d \'{"all_or_nothing": true, "docs":[{"_id":"111", "created_at": "2010/01/24 20:53:48 +0000", "updated_at": "2010/01/24 20:55:20 +0000", "kind": "Note", "text": "single from server", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890", "first_note": true}]}\' -X POST http://localhost:5985/doingnotes/_bulk_docs'
  end

  desc "recreate the databases and create a write conflict"
    task :writeconflict => [:restartrecreateoutline, :stop5, :postto4, :stop4, :start5, :postto5, :start4]
  
    
  desc "add a second note to 5984"
  task :addto4 do
    puts "Adding a second note to 5984."
    system 'curl -X PUT http://localhost:5984/doingnotes/22a -d \'{"created_at": "2010/01/24 21:12:10 +0000", "kind": "Note", "text": "append with conflict from client", "source": "eb8abd1c45f20c0989ed79381cb4907d", "outline_id": "01234567890", "next_id" : "333"}\''
    system 'curl -d \'{"all_or_nothing": true, "docs":[{"_id":"111", "created_at": "2010/01/24 20:53:48 +0000", "updated_at": "2010/01/24 21:12:10 +0000", "kind": "Note", "text": "first", "source": "eb8abd1c45f20c0989ed79381cb4907d", "outline_id": "01234567890", "first_note": true, "next_id" : "22a"}]}\' -X POST http://localhost:5984/doingnotes/_bulk_docs'
    system 'curl -X PUT http://localhost:5984/doingnotes/333 -d \'{"created_at": "2010/01/24 21:00:10 +0000", "kind": "Note", "text": "last one.", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890"}\''
  end
  
  desc "add a second note to 5985"
  task :addto5 do
    puts "Adding a second note to 5985."
    system 'curl -X PUT http://localhost:5985/doingnotes/22b -d \'{"created_at": "2010/01/24 21:14:40 +0000", "kind": "Note", "text": "append with conflict from server", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890", "next_id" : "333"}\''
    system 'curl -d \'{"all_or_nothing": true, "docs":[{"_id":"111", "created_at": "2010/01/24 20:53:48 +0000", "updated_at": "2010/01/24 21:14:40 +0000", "kind": "Note", "text": "first", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890", "first_note": true, "next_id" : "22b"}]}\' -X POST http://localhost:5985/doingnotes/_bulk_docs'
    system 'curl -X PUT http://localhost:5984/doingnotes/333 -d \'{"created_at": "2010/01/24 21:00:10 +0000", "kind": "Note", "text": "last one.", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890"}\''
  end
  
  desc "recreate the databases and create an append conflict"
    task :appendconflict => [:restartrecreateoutline, :stop5, :addto4, :stop4, :start5, :addto5, :start4]
  
  desc "post two notes to 5984"
  task :posttwiceto4 do
    puts "Bulk posting Notes with ID \"111\", \"222\" and \"333\" to 5984."
    system 'curl -d \'{"all_or_nothing": true, "docs":[' + 
    '{"_id":"111", "created_at": "2010/01/24 20:53:48 +0000", "updated_at": "2010/01/24 22:55:20 +0000", "kind": "Note", "text": "top from client, created first", "source": "eb8abd1c45f20c0989ed79381cb4907d", "outline_id": "01234567890", "first_note": true, "next_id" : "222"}, ' + 
    '{"_id":"222", "created_at": "2010/01/24 22:56:48 +0000", "updated_at": "2010/01/24 22:57:20 +0000", "kind": "Note", "text": "bottom from client, created last", "source": "eb8abd1c45f20c0989ed79381cb4907d", "outline_id": "01234567890", "next_id" : "333"}, ' + 
    '{"_id":"333", "created_at": "2010/01/24 22:58:48 +0000", "updated_at": "2010/01/24 22:59:20 +0000", "kind": "Note", "text": "just a last one.", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890"}' + 
    ']}\' -X POST http://localhost:5984/doingnotes/_bulk_docs'
  end

  desc "post two notes to 5985"
  task :posttwiceto5 do
    puts "Bulk posting Notes with ID \"111\", \"222\" and \"333\" to 5985."
    system 'curl -d \'{"all_or_nothing": true, "docs":[' + 
    '{"_id":"111", "created_at": "2010/01/24 20:54:48 +0000", "updated_at": "2010/01/24 22:55:20 +0000", "kind": "Note", "text": "top from server, created last", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890", "first_note": true, "next_id" : "222"}, ' + 
    '{"_id":"222", "created_at": "2010/01/24 22:55:48 +0000", "updated_at": "2010/01/24 22:57:20 +0000", "kind": "Note", "text": "bottom from server, created first", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890", "next_id" : "333"},' + 
    '{"_id":"333", "created_at": "2010/01/24 22:58:48 +0000", "updated_at": "2010/01/24 22:59:20 +0000", "kind": "Note", "text": "just a last one.", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890"}' + 
    ']}\' -X POST http://localhost:5985/doingnotes/_bulk_docs'
  end
  
  desc "recreate the databases and create an append and a write conflict"
    task :twowriteconflicts => [:restartrecreateoutline, :stop5, :posttwiceto4, :stop4, :start5, :posttwiceto5, :start4]
    

  desc "add a second note with different text to 5985"
  task :adddifferentto5 do
    puts "Adding a second note to 5985, with different text."
    system 'curl -X PUT http://localhost:5985/doingnotes/22b -d \'{"created_at": "2010/01/24 21:14:40 +0000", "kind": "Note", "text": "append with conflict from server", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890", "next_id" : "333"}\''
    system 'curl -d \'{"all_or_nothing": true, "docs":[{"_id":"111", "created_at": "2010/01/24 20:53:48 +0000", "updated_at": "2010/01/24 21:14:40 +0000", "kind": "Note", "text": "first, but different, from server.", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890", "first_note": true, "next_id" : "22b"}]}\' -X POST http://localhost:5985/doingnotes/_bulk_docs'
    system 'curl -X PUT http://localhost:5984/doingnotes/333 -d \'{"created_at": "2010/01/24 21:00:10 +0000", "kind": "Note", "text": "last one.", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890"}\''
  end

  desc "recreate the databases and create an append conflict"
    task :appendandwriteconflict => [:restartrecreateoutline, :stop5, :addto4, :stop4, :start5, :adddifferentto5, :start4]

end
