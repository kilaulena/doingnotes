Given 'I save' do
  system "couchapp push #{database}"
end

When /^show the "([^\"]*)" div$/ do |name|
  p $browser.div(name).html
end

Then /^I should see "([^\"]*)" before "([^\"]*)"$/ do |first, second|
  container = $browser.div('container')
  unless container.html.match(/#{first}.*#{second}/im) 
    raise("#{first} can't be found before #{second}") 
  end
end