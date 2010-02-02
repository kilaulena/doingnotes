Feature: CRUD for outlines
  In order to sort my notes
  As a user
  I want to create, update and delete outlines
  
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
    Given an outline with the title "Songs"
      And a first note with the text "Rambling" for the outline "Songs"
      And I save
    When I go to the start page
      And I follow "Songs"
      And I follow "Change title or delete this outline"
      And I press "Delete this outline"
    Then I should see "Outline deleted."
      And I should not see "Songs"

  Scenario: edit an outline's title
    Given an outline with the title "Songs"
      And I save
    When I go to the start page
      And I follow "Songs"
      And I follow "Change title or delete this outline"
      And I fill in "title" with "Tunes"
      And I press "Save"
    Then I should see "Title successfully changed"
      When I go to the start page
    Then I should see "Tunes"
      And I should not see "Songs"