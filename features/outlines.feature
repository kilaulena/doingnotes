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
    Then I should see "Songs"
    And I should see "Here is your new outline"
    And I should see a blank note li
    
  Scenario: delete an outline
    Given a note with the text "Jolene"
      And a note with the text "Rambling"
      And I save
    When I go to the start page
      And I follow "Notes by Date"
      And I follow "Jolene"
      And I press "Delete"
    Then I should see "Rambling"
      And I should not see "Jolene"
      And I should see "Note deleted."    
    When I follow "Notes by Text"
      Then I should not see "Note deleted."
