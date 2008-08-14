/**
 * Creates DB for development.
 */
DROP DATABASE IF EXISTS blog_ng_dev;

CREATE DATABASE blog_ng_dev;

USE blog_ng_dev

GRANT ALL ON blog_ng_dev.* TO helma_ng@localhost IDENTIFIED BY 'secret';


/**
 * Creates DB for testing.
 */
DROP DATABASE IF EXISTS blog_ng_test;

CREATE DATABASE blog_ng_test;

USE blog_ng_test

GRANT ALL ON blog_ng_test.* TO helma_ng@localhost IDENTIFIED BY 'secret';
