CREATE DATABASE Main;

/*CREATE DATABASE Users; 
CREATE DATABASE Posts;
CREATE DATABASE Chats;*/

/* Install/Setup UUID as needed: (command below)*/
/* create extension if not exists "uuid-ossp"; */

CREATE TABLE users (
    user_id uuid NOT NULL PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_of_birth DATE NOT NULL,
    college VARCHAR(50) NOT NULL, 
    grad_year INTEGER NOT NULL,
    blocked_users uuid[],
    revealed_users uuid[]
); 

/* TODO: Should we also add post type?*/
 /* TODO: Should this be an array? */
    /*tags VARCHAR(40),*/
CREATE TABLE post (
    post_id BIGSERIAL,
    user_id uuid NOT NULL,
    post_text VARCHAR(250),
    time_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE comment (
    comment_id BIGSERIAL,
    post_id INTEGER NOT NULL,
    parent_comment_id INTEGER,
    user_id uuid NOT NULL,
    /*text VARCHAR(100) NOT NULL,*/
    comment_text VARCHAR(100),
    time_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT FK_post FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE
    /*FOREIGN KEY (parent_comment_id) REFERENCES comment(comment_id) ON DELETE CASCADE*/
);

/*CREATE TYPE voting AS ENUM (
    'like',
    'dislike'
);*/

/*
SELECT x, (ENUM_RANGE(NULL::voting))[x] 
    FROM generate_series(-1, 1) x
*/

CREATE TABLE post_votes (
    user_id uuid NOT NULL,
    post_id INTEGER NOT NULL,
    /*comment_id INTEGER NOT NULL,*/ 
    vote_value INTEGER NOT NULL CHECK (-1 <= vote_value AND vote_value <= 1), 
    PRIMARY KEY (user_id, post_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE
);

CREATE TABLE comment_votes(
  user_id uuid NOT NULL,
  comment_id INTEGER NOT NULL,
  vote_value INTEGER NOT NULL CHECK (-1 <= vote_value AND vote_value <= 1),
  PRIMARY KEY (user_id, comment_id),
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_comment FOREIGN KEY(comment_id) REFERENCES comment(comment_id) ON DELETE CASCADE
);

CREATE TABLE tags (
    tag_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    tag_text VARCHAR(10) NOT NULL,
    tag_color VARCHAR(7) NOT NULL,
    PRIMARY KEY (tag_id),
    FOREIGN KEY(post_id) REFERENCES post(post_id)
);



