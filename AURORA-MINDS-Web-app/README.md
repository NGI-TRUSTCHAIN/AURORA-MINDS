# AURORA-MINDS

## Project Setup with Docker

<u>Option 1</u>: Run the project through Docker including the latest database (dated 08.07.2024)

<u>Option 2</u>: Manually configure the database using Docker's pgAdmin

<u>Notes</u>:

* Ensure that the (repository's) project folder name is `aurora-minds` (**IMPORTANT!!!**)

* Place the `.env` file inside the folder. This file should be provided to you by the project's supervisor

<br>
**Option 1: Run the Project through Docker with the latest database**

A. In the project's directory, open the **PowerShell** terminal and execute the following command: <br>
`docker run --rm -v aurora-minds_postgres_data:/volume -v ${PWD}:/backup alpine sh -c "cd /volume && tar xvf /backup/aurora-minds_postgres_data.tar.gz --strip 1"`

* The required file `aurora-minds_postgres_data.tar.gz` should be given by the project's supervisor

B. Finally, run the following command to build and start the project:  `docker compose up --build`

<br>
**Option 2: Manually configure the database using Docker's pgAdmin**

A. First, run only the `db` and `pgadmin` (sub) containers `docker-compose up --build db pgadmin`

B. Navigate to pgAdmin page (e.g `http://localhost:5050/`)

* The login credentials are included in the `.env` file, in the `pgAdmin` section

1.Under the `Object Explorer`, right-click on `Servers` --> `Register` --> `Server...`

2.Under the `General` tab, set any name you want (e.g., `aurora-minds-dbs`)

3.In the same window, under the `Connection` tab, type `db` in the `Host name\address` field

* The `username` and `password` are included in the `.env` file, in the `PostgreSQL` section (then, press `Save`)

4.Under the `aurora-minds-dbs`, right-click on `Databases` --> `Create` --> `Database`

* Set the `Database` field named as `aurora-minds` and press `Save`

5.Under the new `aurora-minds` database, navigate to the `Schemas` section and delete the `public` schema

6.Right-click on the new `aurora-minds` database --> `Restore` --> choose your `.sql` backup file (e.g., `backup-aurora-minds-db.sql`)

* Usually, all the latest `.sql` backup files are provided by the project's supervisor

7.Repeat the steps '4', '5' and '6' for creating a second database called `aurora-minds-mobile`

* and using another backup file e.g., `backup-mobile-aurora-minds-db.sql`

C. Finally, run the command to re-build and restart the whole project `docker compose up --build`

D. If it did not work, try to delete the (parent) container called `aurora-minds` and run again `docker compose up --build`

E. **(Optional)** Export the latest DB data by running the command: <br>
`docker run --rm -v aurora-minds_postgres_data:/volume -v ${PWD}:/backup alpine sh -c "cd /volume && tar cvf /backup/aurora-minds_postgres_data.tar.gz ."`

* Again, you can import the latest volume by running the command: <br>
  `docker run --rm -v aurora-minds_postgres_data:/volume -v ${PWD}:/backup alpine sh -c "cd /volume && tar xvf /backup/aurora-minds_postgres_data.tar.gz --strip 1"` 