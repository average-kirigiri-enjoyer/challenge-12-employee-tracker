/*
ethan (average-kirigiri-enjoyer)
SCS Boot Camp Module 12 Weekly Challenge - Employee Tracker
Created 2023/09/30
Last Edited 2023/09/30
*/

INSERT INTO department (name) VALUES
("Marketing"),
("Design"),
("Service"),
("Legal");

INSERT INTO role (title, salary, department_id) VALUES
("Sales Lead", 120000, 1),
("Sales Representative", 60000, 1),
("Marketing Lead", 120000, 1),
("Marketing Researcher", 80000, 1),
("Lead Designer", 100000, 2),
("Programmer", 60000, 2),
("Artist", 40000, 2),
("Writer", 40000, 2),
("Community Manager", 60000, 3), 
("Customer Service", 30000, 3),
("Chief Legal Officer", 120000, 4),
("Legal Representative", 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
("Kang", "Won-ki", 1, NULL),
("Hugh", "Man", 2, 1),
("Joe", "Bamba", 2, 1),
("Noah", "Katz", 3, NULL),
("John", "McAfee", 4, 4),
("Josh", "Strife", 5, NULL),
("John", "Smith", 6, 6),
("Dorian", "Voss", 7, 6),
("Jared", "Valdez", 8, 6),
("Kryndax", "Nexowned", 9, NULL),
("Ezrabell", "Kyrios", 10, 10),
("Devin", "Stone", 11, NULL),
("Jason", "Yoon", 12, 12);