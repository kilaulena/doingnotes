Feature: CRUD for notes
  In order to write things down
  As a user
  I want to create, read, update and delete notes
  
  Scenario: write an outline and a note
    When I go to the start page   
      And I follow "New Outline" 
    Then I should see a blank text input in a div with id "new-outline" 
    When I fill in "title" with "Songs"
      And I press "Save"
      And I should see "Here is your new outline"
      And I should see "Songs"
      And I should see a blank li with id "new-note" 
    When I fill in "new-text" with "No Ceiling"
      And I hit "enter" in a text_field with id "new-text"
    Then I should see "No Ceiling" in a li with class "edit-note" 
      And I should see a blank li with id "new-note" 
      
  Scenario: edit a note
    Given a note with the text "Ten Thousand Miles" and the id "1234"
      And a note with the text "So Long" and the id "5678"
      And I save
    When I go to the start page
      And I fill in "edit_text_5678" with "Waiting"      
      And I hit "enter" in a text_field with id "edit_text_5678"
    Then I should see "Ten Thousand Miles" in a li with class "edit-note" 
    Then I should see "Waiting" in a li with class "edit-note" 
      And I should see a blank li with id "new-note"  
  
  Scenario: delete a note
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
       
  Scenario: sort notes
    Given a note with the text "Alpha" created "1" minutes ago
      And a note with the text "Beta" created "3" minutes ago
      And a note with the text "Gamma" created "2" minutes ago
      And I save
    When I go to the start page
    And I follow "Notes by Text"
      Then I should see "Alpha" before "Beta"
      And I should see "Beta" before "Gamma"
      And I should see "Alpha" before "Gamma"
    When I follow "Notes by Date"
    Then I should see "Beta" before "Alpha"
      And I should see "Gamma" before "Alpha"
      And I should see "Beta" before "Gamma"
       
  
