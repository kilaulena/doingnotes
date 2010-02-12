Feature: indent and unindent notes
  In order to structure my content
  As a user
  I want to indent and unindent notes
  
  Scenario: indent a note
    Given an outline with the title "Songs"
      And a first note with the text "Misirlou" and the id "1234" and the next "5678" for "Songs"
      And a note with the text "Ou est la liberte" and the id "5678" and the next "9012" for "Songs"
      And a note with the text "" and the id "9012" for "Songs"
      And I save
    When I go to the start page
      And I follow "Songs"
    Then "1234" should have no child notes
      And "5678" should have no child notes
    When I hit "tab" in a note textarea with id "5678"
    Then I should see "Misirlou" in a note li
      And the note li with id "9012" should be blank
      And "5678" should be a child note of "1234"
      And I should see "3" notes
    When I refresh
    Then I should see "Misirlou" in a note li
      And the note li with id "9012" should be blank
      And "5678" should be a child note of "1234"
      And I should see "3" notes
      
  Scenario: unindent a note
    Given an outline with the title "Songs"
      And a first note with the text "Misirlou" and the id "1234" and the next "9012" for "Songs"
      And a note with the text "Ou est la liberte" and the id "5678" and the parent "1234" for "Songs"
      And a note with the text "" and the id "9012" for "Songs"
      And I save
    When I go to the start page
      And I follow "Songs"
    Then "5678" should have no child notes
      And "5678" should be a child note of "1234"
    When I hit "shift+tab" in a note textarea with id "5678"
    Then "1234" should have no child notes
      And "5678" should have no child notes
      And I should see "3" notes
    When I refresh
    Then "1234" should have no child notes
      And "5678" should have no child notes
      And I should see "3" notes
      
  Scenario: indent a note
    Given an outline with the title "Songs"
      And a first note with the text "Misirlou" and the id "1234" and the next "5678" for "Songs"
      And a note with the text "Ou est la liberte" and the id "5678" and the next "9012" for "Songs"
      And a note with the text "" and the id "9012" for "Songs"
      And I save
    When I go to the start page
      And I follow "Songs"
    Then "1234" should have no child notes
      And "5678" should have no child notes
    When I hit "tab" in a note textarea with id "5678"
    Then I should see "Misirlou" in a note li
      And the note li with id "9012" should be blank
      And "5678" should be a child note of "1234"
      And I should see "3" notes
    When I refresh
    Then I should see "Misirlou" in a note li
      And the note li with id "9012" should be blank
      And "5678" should be a child note of "1234"
      And I should see "3" notes
