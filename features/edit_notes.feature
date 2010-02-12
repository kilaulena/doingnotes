Feature: add and update notes
  In order to write things down
  As a user
  I want to add and update notes
  
  Scenario: add a note
    Given an outline with the title "Songs"
      And a first note with the text "Misirlou" and the id "1234" for "Songs"
      And I save
    When I go to the start page 
      And I follow "Songs" 
      And I hit "enter" in a note textarea with id "1234"
    Then I should see "Misirlou" in a note li
      And "1234" should have no child notes
      And the new note li should be blank
      And I should see "2" notes
    When I refresh 
    Then I should see "Misirlou" in a note li
      And "1234" should have no child notes
      And the new note li should be blank
      And I should see "2" notes
    
  Scenario: update a note
    Given an outline with the title "Songs"
      And a first note with the text "Misirlou" and the id "1234" and the next "5678" for "Songs"
      And a note with the text "So Long" and the id "5678" for "Songs"
      And I save
    When I go to the start page
      And I follow "Songs"
      And I fill in "edit_text_5678" with "Waiting"      
      And I hit "up" in a note textarea with id "5678"
    Then I should see "Misirlou" in a note li
      And "1234" should have no child notes
      And I should see "Waiting" in a note li
      And I should see "2" notes
    When I refresh
    Then I should see "Misirlou" in a note li
      And "1234" should have no child notes
      And I should see "Waiting" in a note li
      And I should see "2" notes

  
