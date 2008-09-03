hibernate-blog Application
===========================

hibernate-blog is a very simple, basic blog app using Helma NG in a
somewhat "Rails-ish" way and Hibernate as its ORM/persistence layer.


How to Run the App
==================

1. Start your MySQL server and create the DBs (dev & test) + user with:

   hibernate-blog/build/init.mysql.sql

2. Optional: put the jars (needed to make feeds work) which are located in
   hibernate-blog/build/extra into helma-ng/lib/ext.

3. Issue, e.g., the following command inside the hibernate-blog directory:

   hibernate-blog> ./run script/app.js

4. Then point your browser to:

   http://localhost:8080/


How to Run the Unit Tests
=========================

1. You need the test DB to be setup (see above).

2. Issue, e.g., the following command inside the hibernate-blog dir:

   hibernate-blog> ./run script/test.js


How to Rebuild the DB Schema
============================

1. You need the dev DB to be setup (see above).

2. Issue, e.g., the following command inside the hibernate-blog dir:

   hibernate-blog> ./run script/db/rebuild.js

Note: Keep in mind that this will delete any data stored in the DB.


Dependencies
============

* MySQL (5.0+): http://dev.mysql.com/