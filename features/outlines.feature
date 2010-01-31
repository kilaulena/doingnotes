Feature: CRUD for outlines
  In order to sort my notes
  As a user
  I want to create, read, update and delete outlines
  
  Scenario: create an outline
    When I go to the start page 
    And I follow "New Outline" 
    Then I should see a blank text input in a div with id "new-outline" 
    When I fill in "title" with "Songs"    
    And I press "Save"
    Then I should see "Here is your new outline"
    And I should see "Songs"
    And I should see a blank li with id "new-note"