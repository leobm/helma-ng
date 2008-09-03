alter table blog_articles drop foreign key FK21F64A3A42DE6E0B
alter table blog_comments drop foreign key FK474D55F15F676734
alter table blog_comments drop foreign key FK474D55F121011424
drop table if exists blog_articles
drop table if exists blog_comments
drop table if exists blog_users
create table blog_articles (article_id bigint not null auto_increment, article_title varchar(255) not null, article_text longtext not null, article_create_time datetime not null, article_update_time datetime, article_comments_count double precision, article_f_user_creator_id bigint not null, primary key (article_id)) type=InnoDB
create table blog_comments (comment_id bigint not null auto_increment, comment_f_article_parent_id bigint, comment_text longtext not null, comment_create_time datetime not null, comment_f_user_creator_id bigint not null, primary key (comment_id)) type=InnoDB
create table blog_users (user_id bigint not null auto_increment, user_name varchar(255) not null unique, user_password varchar(255) not null, user_website_url varchar(255), user_is_admin bit not null, user_create_time datetime not null, primary key (user_id)) type=InnoDB
alter table blog_articles add index FK21F64A3A42DE6E0B (article_f_user_creator_id), add constraint FK21F64A3A42DE6E0B foreign key (article_f_user_creator_id) references blog_users (user_id)
alter table blog_comments add index FK474D55F15F676734 (comment_f_user_creator_id), add constraint FK474D55F15F676734 foreign key (comment_f_user_creator_id) references blog_users (user_id)
alter table blog_comments add index FK474D55F121011424 (comment_f_article_parent_id), add constraint FK474D55F121011424 foreign key (comment_f_article_parent_id) references blog_articles (article_id)
