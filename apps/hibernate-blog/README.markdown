hibernate-blog Application
===========================

hibernate-blog is a very simple, basic blog app using Helma NG in a
somewhat "Rails-ish" way and Hibernate as its ORM/persistence layer.


How to Run
==========

1. Start your MySQL server and create the DB & user with:

   hibernate-blog/build/db.sql

2. Issue, e.g., the following command in the hibernate-blog directory:

   hibernate-blog> java -jar ../../run.jar app modules config

   Or, alternatively, e.g., the following one in the helma-ng dir:

   helma-ng> java -jar run.jar apps/hibernate-blog/app apps/hibernate-blog/modules apps/hibernate-blog/config

3. Then point your browser to:

   http://localhost:8080/


Dependencies
============

* MySQL (5.0+): http://dev.mysql.com/