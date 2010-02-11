Given /^an outline with the title "([^\"]*)"$/ do |title|
  outline = {:kind => 'Outline', :title => title}
  RestClient.put "#{host}/#{database}/#{title}", outline.to_json
end

Given /^an outline with the title "([^\"]*)" created "([^\"]*)" minutes ago$/ do |title, minutes|
  outline = {:kind => 'Outline', :title => title, :created_at => (Time.now - minutes.to_i*60).strftime("%Y/%m/%d %H:%M:%S +0000")}
  RestClient.put "#{host}/#{database}/#{title}", outline.to_json
end

