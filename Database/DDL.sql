create database todolist;
use todolist;

create table task(
	id int primary key auto_increment,
    description varchar(100),
    is_done boolean default(false),
    is_deleted boolean default(false)
);