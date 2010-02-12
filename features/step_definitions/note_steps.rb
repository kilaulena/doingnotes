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

When 'I refresh' do
  $browser.execute_script('window.location.reload()')
end

Then /^I should see "([^\"]+)" in a note li$/ do |text|  
  li = $browser.li(:class, "edit-note")
  unless li.html.match(/text/im) 
    raise("#{text} can't be found in a note li") 
  end
end

Then /^the new note li should be blank$/ do 
  lis = $browser.div(:id, 'content').lis()
  note_lis = []
  lis.length.times do |i|
    if(lis[i].attribute_value(:id).match(/edit_note_\w{5}/))      
      note_lis.push(lis[i])
    end
  end
  li = note_lis.last
  unless li.html.match(/>\s*<\/textarea>/) 
    raise("No blank note li found") 
  end  
end

def findNoteLiById(id)
  lis = $browser.div(:id, 'content').lis()
  note_lis = []
  lis.length.times do |i|
    if(lis[i].attribute_value(:id).match(/edit_note_#{id}/))      
      note_lis.push(lis[i])
    end
  end
  return note_lis.last
end

Then /^the note li with id "([^\"]+)" should be blank$/ do |id|
  li = findNoteLiById(id)
  unless li.html.match(/edit_text_#{id}.*>\s*<\/textarea>/) 
    raise("No blank note li found") 
  end  
end

Then /^I should see "([^\"]*)" notes$/ do |number|
  lis = $browser.div(:id, 'content').lis()
  unless lis.length.to_s == number
    raise("#{lis.length} note lis found") 
  end
end

Then /^"([^\"]*)" should be a child note of "([^\"]*)"$/ do |child_id, parent_id|
  li = findNoteLiById(parent_id)
  
  children =  []
  li.uls.length.times do |i|
    children.push(li.uls[i])
  end
  
  child = ""
  children.length.times do |i|
    if(children[i].lis.length > 0)
      children[i].lis.length.times do |j|
        if(children[i].lis[j].attribute_value(:id).match(/edit_note_#{child_id}/))     
          child = children[i].lis[j]
        end
      end
    end
  end
  
  if(child == "")
    raise("Note with ID #{child_id} is not a child of #{parent_id}") 
  end
end

Then /^"([^\"]*)" should have no child notes$/ do |id|
  li = findNoteLiById(id)
  if(li.uls.length > 0)
    raise("Note with ID #{id} has at least one child note") 
  end  
end

