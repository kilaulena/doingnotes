require 'restclient'
require 'json'

Given /^a note with the text "([^\"]*)" and the id "([^\"]*)" for "([^\"]*)"$/ do |text, id, title|
  note = {
    :kind       => 'Note', 
    :text       => text, 
    :outline_id => title
  }
  RestClient.put "#{host}/#{database}/#{id}", note.to_json
end

Given /^a note with the text "([^\"]*)" and the id "([^\"]*)" and the next "([^\"]*)" for "([^\"]*)"$/ do |text, id, next_id, title|
  note = {
    :kind       => 'Note', 
    :text       => text, 
    :outline_id => title, 
    :next_id    => next_id
  }
  RestClient.put "#{host}/#{database}/#{id}", note.to_json
end

Given /^a note with the text "([^\"]*)" and the id "([^\"]*)" and the parent "([^\"]*)" for "([^\"]*)"$/ do |text, id, parent_id, title|
  note = {
    :kind       => 'Note', 
    :text       => text, 
    :outline_id => title, 
    :parent_id  => parent_id
  }
  RestClient.put "#{host}/#{database}/#{id}", note.to_json
end

Given /^a first note with the text "([^\"]*)" and the id "([^\"]*)" for "([^\"]*)"$/ do |text, id, title|
  note = {
    :kind       => 'Note', 
    :text       => text, 
    :outline_id => title, 
    :first_note => true
  }
  RestClient.put "#{host}/#{database}/#{id}", note.to_json
end

Given /^a first note with the text "([^\"]*)" and the id "([^\"]*)" and the next "([^\"]*)" for "([^\"]*)"$/ do |text, id, next_id, title|
  note = {
    :kind       => 'Note', 
    :text       => text, 
    :outline_id => title, 
    :first_note => true, 
    :next_id    => next_id
  }
  RestClient.put "#{host}/#{database}/#{id}", note.to_json
end


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

When /^I hit "([^\"]*)" in a note textarea with id "([^\"]*)"$/ do |key, id|
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
  if(key == "shift+tab") 
    shift = 'true'
  else 
    shift = 'false'
  end
  $browser.execute_script('event = document.createEvent("KeyboardEvent");')
  $browser.execute_script('event.initKeyEvent("keydown", true, false, document.window, false, false, ' + shift + ', false, ' + key_code.to_s + ', 0)')
  $browser.execute_script("document.getElementById('edit_text_" + id + "').dispatchEvent(event)")
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


Then /^the last note li should be blank$/ do 
  li = $browser.lis().last
  unless li.html.match(/>\s*<\/textarea>/) 
    raise("No blank note li found") 
    # problem es findet die erste!! TODO
  end  
end

Then /^I should see a blank text input in a div with id "([^\"]+)"$/ do |id|
  div = $browser.div(:id, id)
  unless div.html.match(/<input(.*)type="text"(.*)\/>/) 
    raise("paragraph #{id} is not blank") 
  end  
end

Then /^I should see "([^\"]*)" notes$/ do |number|
  pending
end
