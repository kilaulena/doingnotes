require 'restclient'
require 'json'

Given /^a note with the text "([^\"]*)"$/ do |text|
  note = {:kind => 'Note', :text => text}
  RestClient.post "#{host}/#{database}", note.to_json
end

Given /^a note with the text "([^\"]*)" and the id "([^\"]*)"$/ do |text, id|
  note = {:kind => 'Note', :id => id, :text => text}
  RestClient.put "#{host}/#{database}/#{id}", note.to_json
end

Given /^a note with the text "([^\"]*)" for the outline "([^\"]*)"$/ do |text, title|
  note = {:kind => 'Note', :text => text, :outline_id => title}
  RestClient.post "#{host}/#{database}", note.to_json
end

Given /^a first note with the text "([^\"]*)" for the outline "([^\"]*)"$/ do |text, title|
  note = {:kind => 'Note', :text => text, :outline_id => title, :first_note => true}
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
    :kind => note['kind'],
    :updated_at => Time.now.to_json
  }.to_json
end 

When /^I hit "([^\"]*)" in a note textarea with text "([^\"]*)"$/ do |key, text|
  key_code = case key
    when 'enter'
      13
    when 'up'
      38
    when 'down'
      40
    when 'tab'
      9
    when 'shift+tab'
      9
    else
      0
    end
  shift = (key == "shift+tab")
  $browser.execute_script('event = document.createEvent("KeyboardEvent");')
  $browser.execute_script('event.initKeyEvent("keydown", true, false, document.window, false, false, ' + shift + ', false, ' + key_code.to_s + ', 0)')
  $browser.execute_script("document.getElementsByClassName('edit-note')[0].dispatchEvent(event)")
  When 'I wait for the AJAX call to finish'
end

Then /^I should see "([^\"]+)" in a note li$/ do |text|  
  li = $browser.li(:class, "edit-note")
  # puts li.html
  unless li.html.match(/text/im) 
    raise("#{text} can't be found in a note li") 
  end
 # puts  find_element(kind.to_sym, name).html
 #  find_element(kind.to_sym, name).html should include(text)
end


Then /^I should see a blank note li$/ do 
  li = $browser.li(:class, "edit-note")
  unless li.html.match(/>\s*<\/textarea>/) 
    raise("No blank note li found") 
  end  
end

Then /^I should see a blank text input in a div with id "([^\"]+)"$/ do |id|
  div = $browser.div(:id, id)
  unless div.html.match(/<input(.*)type="text"(.*)\/>/) 
    raise("paragraph #{id} is not blank") 
  end  
end
