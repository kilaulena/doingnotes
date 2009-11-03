require 'rubygems'
require 'culerity'

require 'cucumber/formatter/unicode'

require 'restclient'
require 'json'

Before do
  RestClient.delete "#{host}/#{database}" rescue nil
  RestClient.put "#{host}/#{database}", ""
  system "couchapp push doingnotes_test"
end
