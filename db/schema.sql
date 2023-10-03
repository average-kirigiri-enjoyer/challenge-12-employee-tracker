/*
ethan (average-kirigiri-enjoyer)
SCS Boot Camp Module 12 Weekly Challenge - Employee Tracker
Created 2023/09/30
Last Edited 2023/10/01
*/

-- Initializes employees database
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;

-- Creates department table
CREATE TABLE department
(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

-- Creates role table, with an ID linked to the department the role falls under
CREATE TABLE role
(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

-- Creates employee table, with an ID linked to the job title of that employee, and also their manager, if applicable
CREATE TABLE employee
(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
  FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);