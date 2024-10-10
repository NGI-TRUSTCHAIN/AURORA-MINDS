PART 0 - Folder setup:
1. Create a folder called "tmp" to the "C:\tmp" path
2. Add the 'adhd.csv' file there 

PART 1 - DB_MOBILE:
1. Create "aurora-minds-mobile" database 		<-- In pgAdmin
2. Run the "create-db-mobile-aurora-minds.sql"		<-- Create its tables/database schema 
2. Run the "insert-db-mobile-aurora-minds.sql" 		<-- Add the rest dummy data

PART 2 DB_WEB_APP:
1. Create "aurora-minds" database 			<-- In pgAdmin
2. Run the "create-db-aurora-minds.sql" 		<-- Create its tables/database schema
3. Run the following 2 (migration) python commands 	<-- Django Project (adds Django tables)
* python manage.py makemigrations
* python manage.py migrate   
4. Run "manage.py runner"				<-- Run Django Project
5. Run "generate_login_user.py" 			<-- Add login users (parent, clinicians, admin)
6. Run the "insert-db-aurora-minds.sql" 		<-- Add the rest dummy data (a file called "child_parent_ids.csv" should be created in the "C:\tmp" folder)
* (UPDATE LINES 9, 10 ACCORDINGLY!!!)
7. Run the "fix-id-sequences-aurora-minds.sql"		<-- Otherwise, you will not be able to add records through Django

PART 3 - DB_MOBILE (Update parent_ids)
1. Connect back again with the "aurora-minds-mobile" database 					<-- In pgAdmin 
2. Run the "update-parent-ids-aurora-minds-mobile.sql" from the "mobile-app-db" folder		<-- Update parent IDs (since ADHD records have been assigned in the web app in part 2)
3. Run the "fix-id-sequences-mobile-aurora-minds.sql" from the "mobile-app-db" folder		<-- Otherwise, you will not be able to add new records through Django


* After all the above are done, you can safely delete the "C:\tmp" folder.