Then /^I should see a blank text input in a div with id "([^\"]+)"$/ do |id|
  div = $browser.div(:id, id)
  unless div.html.match(/<input(.*)type="text"(.*)\/>/) 
    raise("paragraph #{id} is not blank") 
  end  
end
