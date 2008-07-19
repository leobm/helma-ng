DROP DATABASE IF EXISTS blog_ng;

CREATE DATABASE blog_ng;

USE blog_ng

GRANT ALL ON blog_ng.* TO helma_ng@localhost IDENTIFIED BY 'secret';
