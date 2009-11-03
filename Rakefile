require 'rake'
require 'rake/testtask'
require 'rake/rdoctask'

require 'restclient'

def host
  'http://localhost:5984'
end

def database
  'doingnotes'
end

namespace :couch do
  desc 'deletes and recreates the database and pushes the app'
  task :delete_and_push do
    puts 'Deleting and recreating database ...'
    RestClient.delete "#{host}/#{database}" rescue nil
    RestClient.put "#{host}/#{database}", ""
    puts '... pushing app ...'
    system "couchapp push #{database}"
    puts '... ready.'
  end
end