require 'rake'
require 'rake/testtask'
require 'rake/rdoctask'

require 'restclient'

def host
  'http://localhost:5984'
end

def server
  'http://localhost:5985'
end

def database
  'doingnotes'
end

namespace :couch do
  desc 'deletes and recreates the database and pushes the app to server on port 5984'
  task :host do
    puts 'Deleting and recreating database to 5984 ...'
    RestClient.delete "#{host}/#{database}" rescue nil
    RestClient.put "#{host}/#{database}", ""
    puts '... pushing app ...'
    system "couchapp push #{host}/#{database}"
    puts '... ready.'
  end
  
  desc 'deletes and recreates the database and pushes the app to the server on port 5985'
  task :server do
    puts 'Deleting and recreating database to 5985 ...'
    RestClient.delete "#{server}/#{database}" rescue nil
    RestClient.put "#{server}/#{database}", ""
    puts '... pushing app ...'
    system "couchapp push #{server}/#{database}"
    puts '... ready.'
  end
  
  desc "delete, create and push server and localhost"
    task :both => [:host, :server]
end