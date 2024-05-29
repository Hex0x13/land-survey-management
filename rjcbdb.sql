drop database if exists RJCBDB;
create database RJCBDb;
use RJCBDb;

create table Client(
	ID int not null auto_increment primary key,
    first_name text(50) not null,
    last_name text(50) not null,
    middle_name text(50),
    name_extension varchar(10),
    contact_number varchar(16) not null,
    email varchar(255) not null unique
);

create table Land_Parcel(
	ID int not null auto_increment primary key,
    Client_ID int not null,
    Legal_Description  varchar(520) not null,
    Street varchar(100) not null,
    Subdivision varchar(150) not null,
    City varchar(100) not null,
    Province varchar(100) not null,
    ZipCode varchar(10) not null,
    area varchar(100) not null,
	foreign key (Client_ID) references Client(ID) on delete cascade
);

create table Survey_project (
	ID int not null auto_increment primary key,
    Parcel_ID int not null,
    Name varchar(100) not null,
    Description varchar(1020) not null,
    time_started datetime not null,
    time_ended datetime,
    foreign key (Parcel_ID) references Land_Parcel(ID) on delete cascade
);

create table Surveyor (
	ID int not null auto_increment primary key,
    first_name text(50) not null,
    last_name text(50) not null,
    middle_name text(50),
    name_extension varchar(10),
    title varchar(50) not null,
    contact_number varchar(20) not null,
    email varchar(255) not null unique
);

create table Survey_Project_Surveyor (
	Surveyor_ID int not null,
    Survey_Project_ID int not null,
    foreign key (Survey_Project_ID) references Survey_Project(ID) on delete cascade,
    foreign key (Surveyor_ID) references Surveyor(ID) on delete cascade,
    primary key (Surveyor_ID, Survey_Project_ID)
);

create table Survey_Project_Image(
	ID int not null auto_increment primary key,
    Project_ID int not null,
    Image_URL varchar(255) not null,
	foreign key (Project_ID) references Survey_Project(ID) on delete cascade
);

create table User (
	ID INT NOT NULL primary key auto_increment,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    surveyor_id INT NOT NULL,
    foreign key (surveyor_id) references Surveyor(ID) on delete cascade
);

-- CLIENT TABLE CONFIG
create view Client_With_Fullname as 
select
	ID,
    concat(
		first_name, ' ',
        (case
			when middle_name is not null and length(middle_name) > 0
			then concat(substr(middle_name, 1, 1), '. ')
			else ''
		end),
        last_name, ' ',
        (case
			when name_extension is null
            then ''
            else name_extension
		end)
	) as full_name,
	email,
    contact_number
from Client;



DELIMITER //

CREATE PROCEDURE Edit_Client (
    IN in_id INT,
    IN in_first_name TEXT(50),
    IN in_last_name TEXT(50),
    IN in_middle_name TEXT(50),
    IN in_name_extension VARCHAR(10),
    IN in_contact_number VARCHAR(20),
    IN in_email VARCHAR(255)
)
BEGIN
    UPDATE Client 
    SET 
		first_name = CASE WHEN in_first_name != '' or in_first_name != NULL THEN in_first_name ELSE first_name END,
        last_name = CASE WHEN in_last_name != '' or in_last_name != NULL THEN in_last_name ELSE last_name END, 
        middle_name = in_middle_name,
        name_extension = in_name_extension,
        contact_number = CASE WHEN in_contact_number != '' or in_contact_number != NULL THEN in_contact_number ELSE contact_number END,
        email = CASE WHEN in_email != '' or in_email != NULL THEN in_email ELSE email END
    WHERE id = in_id;
END //

DELIMITER ;


-- SURVEYOR TABLE CONFIG
create view Surveyor_With_Fullname as 
select
	ID,
    concat(
		first_name, ' ',
        (case
			when middle_name is not null and length(middle_name) > 0
			then concat(substr(middle_name, 1, 1), '. ')
			else ''
		end),
        last_name, ' ',
        (case
			when name_extension is null
            then ''
            else name_extension
		end)
	) as full_name,
	email,
    title,
    contact_number
from Surveyor;


DELIMITER //

CREATE PROCEDURE Edit_Surveyor (
    IN in_id INT,
    IN in_first_name TEXT(50),
    IN in_last_name TEXT(50),
    IN in_middle_name TEXT(50),
    IN in_name_extension VARCHAR(10),
    IN in_title VARCHAR(50),
    IN in_contact_number VARCHAR(20),
    IN in_email VARCHAR(255)
)
BEGIN
    UPDATE Surveyor 
    SET 
		first_name = CASE WHEN in_first_name != '' or in_first_name != NULL THEN in_first_name ELSE first_name END,
        last_name = CASE WHEN in_last_name != '' or in_last_name != NULL THEN in_last_name ELSE last_name END, 
        middle_name = in_middle_name,
        name_extension = in_name_extension,
        title = CASE WHEN in_title != '' or in_title = NULL THEN in_title ELSE title END,
        contact_number = CASE WHEN in_contact_number != '' or in_contact_number != NULL THEN in_contact_number ELSE contact_number END,
        email = CASE WHEN in_email != '' or in_email != NULL THEN in_email ELSE email END
    WHERE id = in_id;
END //

DELIMITER ;


INSERT INTO Surveyor (
    first_name,
    last_name,
    middle_name,
    name_extension,
    title,
    contact_number,
    email
) VALUES (
	'Florante',
    'Benitez',
    'Conde',
    'jr.',
    'manager',
    '0943435555555',
    'benitez@mail.com'
);
SET @lastID = (SELECT LAST_INSERT_ID());
INSERT INTO USER (email, password, surveyor_id) VALUES ('admin@mail.com', 'root', @lastID);

