- Currently we store as JSON files, maybe make it into MongoDB
- Need to review questions by, answer score (-1 = bad question, 0 |null = never answered, zero-90 => answered but still need practice, 91+ no reason to ask again)

- We keep secondary database/tables for answers

- We have the question/quiz interface already

- We need to be able to, for each database/quest list databases

  - List questions within the given database
    - Edit/Update/Delete any one question

- We probably want a question/database engine that takes a look at all the questions and makes a list of most important to answer (0 - 90).

- I guess then, we should continue to store answer separately. But each time we write an answer update the question, number of times asked, average score, last score.
