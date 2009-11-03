Feature: CRUD for notes
  In order to write things down
  As a user
  I want to create, read, update and delete notes
  
  Scenario: create a note
    When I go to the start page
    And I fill in "text" with "This is a note."
    And I hit enter
    And I should see "This is a note."
    And I should see "Created:"
    
    When I follow "Notes by Date"
    Then I should not see "Note successfully created!"
      
  Scenario: edit a note
     Given a note with the text "This is a basic note."
     And a note with the text "Another note."
     
     When I go to the start page
     And I follow "Notes by Date"
     And I follow "This is a basic note."
     And I follow "Edit"
     And I fill in "text" with "This is an updated note."
     And I press "Save"
     And I wait for the AJAX call to finish
     
     # Then I should see "Note successfully updated!"
     And I update the text of the note "This is a basic note." with "This is an updated note."
     
     And I follow "Notes by Date"
     And I follow "This is an updated note."
     Then I should see "Created:"
     And I should see "Updated:"
     
     # When I follow "Notes by Date"
     # Then I should not see "Note successfully updated!"
  
   Scenario: delete a note
     Given a note with the text "This is a basic note."
     And a note with the text "Second note."
     
     When I go to the start page
     And I follow "Notes by Date"
     And I follow "This is a basic note."
     And I press "Delete"
     Then I should see "Note deleted."
     And I should see "Second note."
     And I should not see "This is a basic note."
       
     When I follow "Notes by Date"
     Then I should not see "Note deleted."
       
   Scenario: sort notes
     Given a note with the text "Alpha" created "3" minutes ago
     And a note with the text "Beta" created "1" minutes ago
     And a note with the text "Gamma" created "2" minutes ago
     And I save
     When I go to the start page
     
     When I follow "Notes by Text"
     Then I should see "Alpha" before "Beta"
     And I should see "Beta" before "Gamma"
     And I should see "Alpha" before "Gamma"
     
     And I follow "Notes by Date"
     Then I should see "Beta" before "Alpha"
     And I should see "Gamma" before "Alpha"
     And I should see "Beta" before "Gamma"
       
  
