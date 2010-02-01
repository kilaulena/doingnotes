Feature: add and update notes
  In order to write things down
  As a user
  I want to add and update notes
  
  Scenario: add a note
    When I go to the start page 
    And I follow "New Outline" 
    Then I should see a blank text input in a div with id "new-outline" 
    When I fill in "title" with "Songs"    
    And I press "Save"
    And I fill in "text" with "No Ceiling"
    And I hit "enter" in a note textarea with text "No Ceiling"
    Then I should see "2" notes 
    And I should see "No Ceiling" in a note li
    And I should see a blank note li
      
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
  


  
