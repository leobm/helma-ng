hibernate-blog Application
===========================

hibernate-blog is a very simple, basic blog app using Helma NG in a
somewhat "Rails-ish" way and Hibernate as its ORM/persistence layer.


How to Run
==========

1. Start your MySQL server and create the DB & user with:

   hibernate-blog/build/db.sql

2. Put MySQL Connector/J into the Helma NG lib dir, e.g.:

   helma-ng> cp apps/hibernate-blog/build/lib/mysql-connector-java-5.1.6-bin.jar lib/

3. Issue, e.g., the following command in the hibernate-blog directory:

   hibernate-blog> java -jar ../../run.jar app modules config

   Or, alternatively, e.g., the following one in the helma-ng dir:

   helma-ng> java -jar run.jar apps/hibernate-blog/app apps/hibernate-blog/modules apps/hibernate-blog/config

4. Then point your browser to:

   http://localhost:8080/


Dependencies
============

* MySQL (5.0+): http://dev.mysql.com/