require 'restclient'
require 'json'

Given /^a note with the text "([^\"]*)"$/ do |text|
  note = {:type => 'Note', :text => text}
  RestClient.post "#{host}/#{database}", note.to_json
end

Given /^a note with the text "([^\"]*)" and the id "([^\"]*)"$/ do |text, id|
  note = {:type => 'Note', :id => id, :text => text}
  RestClient.put "#{host}/#{database}/#{id}", note.to_json
end

Given /^a note with the text "([^\"]*)" created "([^\"]*)" minutes ago$/ do |text, minutes|
  note = {:type => 'Note', :created_at => (Time.now - minutes.to_i).strftime("%Y/%m/%d %H:%M:%S +0000"), :text => text}
  RestClient.post "#{host}/#{database}", note.to_json
end

# When /^I press "Delete" for note "([^\"]*)"$/ do |text|
#   notes = JSON.parse(RestClient.get "#{host}/#{database}/_design/#{app}/_view/notes_by_text")
#   note_id = 0
#   notes['rows'].each do |note_hash|
#     if (note_hash['key'] == text)
#       note_id = note_hash['id']
#     end
#   end
#   field_by_xpath("//form[@id='delete_note_#{note_id}']//input[@type='submit']").click
# end

When /^I update the text of the note "([^\"]*)" with "([^\"]*)"$/ do |old_text, new_text|
  notes = JSON.parse(RestClient.get "#{host}/#{database}/_design/#{app}/_view/notes_by_text")
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
