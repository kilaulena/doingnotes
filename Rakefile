require 'rake'
require 'rake/testtask'
require 'rake/rdoctask'

require 'restclient'

def host
  'http://localhost:5984'
end

def server
  'http://localhost:5985'
  # 'http://lena.couchone.com:5984'
end

def database
  'doingnotes'
end

namespace :couch do
  desc "deletes and recreates the database and pushes the app to server on #{host}"
  task :recreate_host do
    puts "Deleting and recreating database to #{host} ..."
    RestClient.delete "#{host}/#{database}" rescue nil
    RestClient.put "#{host}/#{database}", ""
    puts '... pushing app ...'
    system "couchapp push #{host}/#{database}"
    puts '... ready.'
  end
  
  desc "deletes and recreates the database and pushes the app to the server on #{server}"
  task :recreate_server do
    puts "Deleting and recreating database to #{server} ..."
    RestClient.delete "#{server}/#{database}" rescue nil
    RestClient.put "#{server}/#{database}", ""
    puts '... pushing app ...'
    system "couchapp push #{server}/#{database}"
    puts '... ready.'
  end
  
  desc "delete, create and push #{host} and #{server}"
    task :recreateboth => [:recreate_host, :recreate_server]


  desc "wait for two seconds"
  task :wait do
    puts "Waiting for two seconds ..."
    sleep(2)
  end
    
  desc "start #{host}"
  task :start_host do
    puts "Starting CouchDB on #{host}"
    system "sudo -i -u couchdb '/usr/local/bin/couchdb -a /usr/local/etc/couchdb/local-1.ini -p /usr/local/var/run/couchdb/couchdb-1.pid -o /usr/local/var/log/couchdb/error-1.log -e /usr/local/var/log/couchdb/error-1.log -b'"
  end
  
  desc "start #{server}"
  task :start_server do
    puts "Starting CouchDB on #{server}"
    system "sudo -i -u couchdb '/usr/local/bin/couchdb -a /usr/local/etc/couchdb/local-2.ini -p /usr/local/var/run/couchdb/couchdb-2.pid -o /usr/local/var/log/couchdb/error-2.log -e /usr/local/var/log/couchdb/error-2.log -b'"
  end
  
  desc "start #{host} and #{server}"
    task :startboth => [:start_host, :start_server]
  
  desc "stop #{host}"
  task :stop_host do
    puts "Stopping CouchDB on #{host}"
    system "sudo -i -u couchdb '/usr/local/bin/couchdb -a /usr/local/etc/couchdb/local-1.ini -p /usr/local/var/run/couchdb/couchdb-1.pid -o /usr/local/var/log/couchdb/error-1.log -e /usr/local/var/log/couchdb/error-1.log -d'"
  end

  desc "stop #{server}"
  task :stop_server do
    puts "Stopping CouchDB on #{server}"
    system "sudo -i -u couchdb '/usr/local/bin/couchdb -a /usr/local/etc/couchdb/local-2.ini -p /usr/local/var/run/couchdb/couchdb-2.pid -o /usr/local/var/log/couchdb/error-2.log -e /usr/local/var/log/couchdb/error-2.log -d'"
  end
  
  desc "stop #{host} and #{server}"
    task :stopboth => [:stop_host, :stop_server]
  
  desc "create an outline"
  task :createoutline do
    puts 'Creating Outline with id "01234567890".'
    system 'curl -X PUT http://localhost:5984/doingnotes/01234567890 -H "Content-Type: application/json" -d \'{"created_at" : "2010/01/24 20:45:51 +0000", "kind": "Outline", "title": "Protokoll Finanzsitzung"}\''
  end

  desc "stop, start, recreate databases and create an outline"
  task :restartrecreateoutline => [:stopboth, :startboth, :wait, :recreateboth, :createoutline]
  
  
  desc "post a note to #{host}"
  task :post_to_host do
    puts "Bulk posting Note with ID \"111\" to #{host}."
    system 'curl -H "Content-Type: application/json" -d \'{"all_or_nothing": true, "docs":[{"_id":"111", "created_at": "2010/01/24 20:53:48 +0000", "updated_at": "2010/01/24 20:53:51 +0000", "kind": "Note", "text": "single from client", "source": "eb8abd1c45f20c0989ed79381cb4907d", "outline_id": "01234567890", "first_note": true}]}\' -X POST http://localhost:5984/doingnotes/_bulk_docs'
  end
  
  desc "post a note to #{server}"
  task :post_to_server do
    puts "Bulk posting Note with ID \"111\" to #{server}."
    system 'curl -H "Content-Type: application/json" -d \'{"all_or_nothing": true, "docs":[{"_id":"111", "created_at": "2010/01/24 20:53:48 +0000", "updated_at": "2010/01/24 20:55:20 +0000", "kind": "Note", "text": "single from server", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890", "first_note": true}]}\' -X POST http://localhost:5985/doingnotes/_bulk_docs'
  end

  desc "recreate the databases and create a write conflict"
    task :writeconflict => [:restartrecreateoutline, :stop_server, :post_to_host, :stop_host, :start_server, :post_to_server, :start_host]
  
    
  desc "add a second note to #{host}"
  task :add_to_host do
    puts "Adding a second note to #{host}."
    system "curl -X PUT #{host}/#{database}" + '22a -H "Content-Type: application/json" -d \'{"created_at": "2010/01/24 21:12:10 +0000", "kind": "Note", "text": "append with conflict from client", "source": "eb8abd1c45f20c0989ed79381cb4907d", "outline_id": "01234567890", "next_id" : "333"}\''
    system 'curl -H "Content-Type: application/json" -d \'{"all_or_nothing": true, "docs":[{"_id":"111", "created_at": "2010/01/24 20:53:48 +0000", "updated_at": "2010/01/24 21:12:10 +0000", "kind": "Note", "text": "first", "source": "eb8abd1c45f20c0989ed79381cb4907d", "outline_id": "01234567890", "first_note": true, "next_id" : "22a"}]}\' -X POST http://localhost:5984/doingnotes/_bulk_docs'
    system "curl -X PUT #{host}/#{database}" + '333 -H "Content-Type: application/json" -d \'{"created_at": "2010/01/24 21:00:10 +0000", "kind": "Note", "text": "last one.", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890"}\''
  end
  
  desc "add a second note to #{server}"
  task :add_to_server do
    puts "Adding a second note to #{server}."
    system "curl -X PUT #{server}/#{database}" + '/22b -H "Content-Type: application/json" -d \'{"created_at": "2010/01/24 21:14:40 +0000", "kind": "Note", "text": "append with conflict from server", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890", "next_id" : "333"}\''
    system 'curl -H "Content-Type: application/json" -d \'{"all_or_nothing": true, "docs":[{"_id":"111", "created_at": "2010/01/24 20:53:48 +0000", "updated_at": "2010/01/24 21:14:40 +0000", "kind": "Note", "text": "first", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890", "first_note": true, "next_id" : "22b"}]}\' -X POST http://localhost:5985/doingnotes/_bulk_docs'
    system "curl -X PUT #{server}/#{database}" + '/333 -H "Content-Type: application/json" -d \'{"created_at": "2010/01/24 21:00:10 +0000", "kind": "Note", "text": "last one.", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890"}\''
  end
  
  desc "recreate the databases and create an append conflict"
    task :appendconflict => [:restartrecreateoutline, :stop_server, :add_to_host, :stop_host, :start_server, :add_to_server, :start_host]
  
  desc "post two notes to #{host}"
  task :posttwiceto_host do
    puts "Bulk posting Notes with ID \"111\", \"222\" and \"333\" to #{host}."
    system 'curl -H "Content-Type: application/json" -d \'{"all_or_nothing": true, "docs":[' + 
    '{"_id":"111", "created_at": "2010/01/24 20:53:48 +0000", "updated_at": "2010/01/24 22:55:20 +0000", "kind": "Note", "text": "top from client, created first", "source": "eb8abd1c45f20c0989ed79381cb4907d", "outline_id": "01234567890", "first_note": true, "next_id" : "222"}, ' + 
    '{"_id":"222", "created_at": "2010/01/24 22:56:48 +0000", "updated_at": "2010/01/24 22:57:20 +0000", "kind": "Note", "text": "bottom from client, created last", "source": "eb8abd1c45f20c0989ed79381cb4907d", "outline_id": "01234567890", "next_id" : "333"}, ' + 
    '{"_id":"333", "created_at": "2010/01/24 22:58:48 +0000", "updated_at": "2010/01/24 22:59:20 +0000", "kind": "Note", "text": "just a last one.", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890"}' + 
    "]}' -X POST #{host}/doingnotes/_bulk_docs"
  end

  desc "post two notes to #{server}"
  task :posttwiceto_server do
    puts "Bulk posting Notes with ID \"111\", \"222\" and \"333\" to #{server}."
    system 'curl -H "Content-Type: application/json" -d \'{"all_or_nothing": true, "docs":[' + 
    '{"_id":"111", "created_at": "2010/01/24 20:54:48 +0000", "updated_at": "2010/01/24 22:55:20 +0000", "kind": "Note", "text": "top from server, created last", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890", "first_note": true, "next_id" : "222"}, ' + 
    '{"_id":"222", "created_at": "2010/01/24 22:55:48 +0000", "updated_at": "2010/01/24 22:57:20 +0000", "kind": "Note", "text": "bottom from server, created first", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890", "next_id" : "333"},' + 
    '{"_id":"333", "created_at": "2010/01/24 22:58:48 +0000", "updated_at": "2010/01/24 22:59:20 +0000", "kind": "Note", "text": "just a last one.", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890"}' + 
    "]}' -X POST #{server}/doingnotes/_bulk_docs"
  end
  
  desc "recreate the databases and create an append and a write conflict"
    task :twowriteconflicts => [:restartrecreateoutline, :stop_server, :posttwiceto_host, :stop_host, :start_server, :posttwiceto_server, :start_host]
    

  desc "add a second note with different text to #{server}"
  task :adddifferentto_server do
    puts "Adding a second note to #{server}, with different text."
    system "curl -X PUT #{server}/#{database}" + '/22b -H "Content-Type: application/json" -d \'{"created_at": "2010/01/24 21:14:40 +0000", "kind": "Note", "text": "append with conflict from server", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890", "next_id" : "333"}\''
    system 'curl -H "Content-Type: application/json" -d \'{"all_or_nothing": true, "docs":[{"_id":"111", "created_at": "2010/01/24 20:53:48 +0000", "updated_at": "2010/01/24 21:14:40 +0000", "kind": "Note", "text": "first, but different, from server.", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890", "first_note": true, "next_id" : "22b"}]}\' -X POST http://localhost:5985/doingnotes/_bulk_docs'
    system "curl -X PUT #{server}/#{database}" + '/333 -H "Content-Type: application/json" -d \'{"created_at": "2010/01/24 21:00:10 +0000", "kind": "Note", "text": "last one.", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890"}\''
  end

  desc "recreate the databases and create an append conflict"
    task :appendandwriteconflict => [:restartrecreateoutline, :stop_server, :add_to_host, :stop_host, :start_server, :adddifferentto_server, :start_host]


  desc "post nice notes to #{host}"
  task :postniceto_host do
    puts "Bulk posting Notes to #{host} ..."
    system "curl -X PUT #{host}/#{database}" + '/111 -H "Content-Type: application/json" -d \'{"created_at": "2010/01/24 21:12:10 +0000", "kind": "Note", "text": "Verwendung der Mittel", "source": "eb8abd1c45f20c0989ed79381cb4907d", "outline_id": "01234567890", "first_note": true}\''
    system "curl -X PUT #{host}/#{database}" + '/222 -H "Content-Type: application/json" -d \'{"created_at": "2010/01/24 21:12:10 +0000", "kind": "Note", "text": "PCs werden nicht gekauft", "source": "eb8abd1c45f20c0989ed79381cb4907d", "outline_id": "01234567890", "parent_id": "111", "next_id": "333"}\''
    system "curl -X PUT #{host}/#{database}" + '/333 -H "Content-Type: application/json" -d \'{"created_at": "2010/01/24 21:12:10 +0000", "kind": "Note", "text": "Schreibwaren für 300 Euro", "source": "eb8abd1c45f20c0989ed79381cb4907d", "outline_id": "01234567890"}\''
  end

  desc "post nice notes to #{server}"
  task :postniceto_server do
    puts "Bulk posting Notes to #{server} ..."
    system 'curl -H "Content-Type: application/json" -d \'{"all_or_nothing": true, "docs":[' +
      '{"_id":"111", "created_at": "2010/01/24 21:12:10 +0000", "kind": "Note", "text": "Verwendung der Mittel", "source": "eb8abd1c45f20c0989ed79381cb4907d", "outline_id": "01234567890", "first_note": true}, ' +
      '{"_id":"222", "created_at": "2010/01/24 20:53:48 +0000", "updated_at": "2010/01/24 20:53:51 +0000", "kind": "Note", "text": "PCs für 2000 Euro", "source": "d476451f9b4031e515e9d139d328b116", "outline_id": "01234567890", "parent_id": "111", "next_id": "333"} ' +
    "]}\' -X POST #{server}/#{database}/doingnotes/_bulk_docs"
  end

  desc "recreate the databases and create a write conflict"
    task :nicewriteconflict => [:restartrecreateoutline, :stop_server, :postniceto_host, :stop_host, :start_server, :postniceto_server, :start_host]

end
