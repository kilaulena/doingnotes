require 'restclient'
require 'json'

Before do
  RestClient.delete "#{host}/#{database}" rescue nil
  RestClient.put "#{host}/#{database}", ""
  system "couchapp push"
end

Given /^a note with the text "([^\"]*)"$/ do |text|
  When "I go to the start page"
  And 'I follow "New note"'
  And "I fill in \"text\" with \"#{text}\""
  And 'I press "Save"'
end

Given /^a note with the text "([^\"]*)" created "([^\"]*)" minutes ago$/ do |text, minutes|
  note = {:type => 'Note', :created_at => (Time.now - minutes.to_i).strftime("%Y/%m/%d %H:%M:%S +0000"), :text => text};
  RestClient.post "#{host}/#{database}", note.to_json
end


When /^I update the text of the note "([^\"]*)" with "([^\"]*)"$/ do |old_text, new_text|
  notes = JSON.parse(RestClient.get "#{host}/#{database}/_design/doingnotes/_view/notes_by_text")
  note_id, note = 0

  notes['rows'].each do |note_hash|
    if (note_hash['key'] == old_text)
      note_id = note_hash['id']
      note = note_hash['value']
    end
  end

  RestClient.put "#{host}/#{database}/#{note_id}", {
    :text => new_text, 
    :_rev => note['_rev'],
    :created_at => note['created_at'],
    :type => note['type'],
    :updated_at => Time.now.to_json
  }.to_json
end 


Then /^"([^\"]*)" should have the class "([^\"]*)"$/ do |element_id, css_class|
  find_input(:text_field, element_id).attribute_value(:class).should include(css_class)
end

Then /^"([^\"]*)" should not have the class "([^\"]*)"$/ do |element_id, css_class|
  find_input(:text_field, element_id).attribute_value(:class).should_not include(css_class)
end

def find_input(type, attribute)
  matchers = [[attribute, :id], [attribute, :name]]
  matchers << [$browser.label(:text, attribute).for, :id] if $browser.label(:text, attribute).exist?
  matchers.map{|field, matchter| $browser.send(type, matchter, field)}.find(&:exist?) ||  raise("#{type} '#{attribute}' not found")
end

