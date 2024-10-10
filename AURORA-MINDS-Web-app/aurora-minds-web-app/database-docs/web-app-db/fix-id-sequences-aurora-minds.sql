-- Fix id sequence (otherwise you will not be able to add through Django)
SELECT setval('questionnaire_questionnaire_id_seq', (SELECT MAX(questionnaire_id) FROM questionnaire) + 1);