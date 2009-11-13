require 'rubygems'
require 'culerity'
require 'cucumber/formatter/unicode'
require 'restclient'
require 'json'


Symbol.class_eval do
  def to_proc
    Proc.new{|object| object.send(self)}
  end
end unless :symbol.respond_to?(:to_proc)

Before do
  $server ||= Culerity::run_server
  $browser = Culerity::RemoteBrowserProxy.new $server, {:browser => :firefox, :javascript_exceptions => true, :resynchronize => true, :status_code_exceptions => true}
  $browser.log_level = :warning
  RestClient.delete "#{host}/#{database}" rescue nil
  RestClient.put "#{host}/#{database}", ""
  system "couchapp push #{database}"
  # $browser.goto host + path_to('start page');
  # $browser.execute_script("setTestEnv();")
end

def host
  'http://localhost:5984'
end

def database
  'doingnotes_test'
end

def app
  'doingnotes'
end

at_exit do
  $browser.exit if $browser
  $server.close if $server
end

