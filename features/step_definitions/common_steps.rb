Given 'I save' do
  system "couchapp push #{database}"
end

When /^show the "([^\"]*)" div$/ do |name|
  p $browser.div(name).html
end


Then /^I should see "([^\"]*)" before "([^\"]*)"$/ do |first, second|
  div = $browser.div('container')
  unless div.html.match(/#{first}.*#{second}/im) 
    raise("#{first} can't be found before #{second}") 
  end
end

# Then /^I should see "([^\"]*)" twice$/ do |text|
#   regexp = Regexp.new(text + "(.+)" + text)
#   response.body.should contain(regexp)
# end


# Then /^"([^\"]*)" should have the class "([^\"]*)"$/ do |element_id, css_class|
#   find_element(:text_field, element_id).attribute_value(:class).should include(css_class)
# end
# 
# Then /^"([^\"]*)" should not have the class "([^\"]*)"$/ do |element_id, css_class|
#   find_element(:text_field, element_id).attribute_value(:class).should_not include(css_class)
# end

def find_element(kind, attribute)
  matchers = [[attribute, :id], [attribute, :name]]
  matchers << [$browser.label(:text, attribute).for, :id] if $browser.label(:text, attribute).exist?
  matchers.map{ |field, matcher| 
    $browser.send(kind, matcher, field)
  }.find(&:exist?) ||  raise("#{kind} '#{attribute}' not found")
end
