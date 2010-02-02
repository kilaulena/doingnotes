Given /^an outline with the title "([^\"]*)"$/ do |title|
  outline = {:kind => 'Outline', :title => title}
  RestClient.put "#{host}/#{database}/#{title}", outline.to_json
end


# 
# Given /^a note with the text "([^\"]*)" created "([^\"]*)" minutes ago$/ do |text, minutes|
#   note = {:kind => 'Note', :created_at => (Time.now - minutes.to_i).strftime("%Y/%m/%d %H:%M:%S +0000"), :text => text}
#   RestClient.post "#{host}/#{database}", note.to_json
# end