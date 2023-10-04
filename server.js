/*
ethan (average-kirigiri-enjoyer)
SCS Boot Camp Module 12 Weekly Challenge - Employee Tracker
Created 2023/09/30
Last Edited 2023/10/04
*/

//importing packages
const inquirer = require("inquirer");
const mysql = require("mysql2");
const figlet = require("figlet");
require('dotenv').config();

//defining main menu option list
const mainMenu = [
{
  type: "list",
  message: "What would you like to do?",
  name: "menuChoice",
  choices: ["View All Departments", "View All Roles", "View All Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role"]
}];

//defining prompts to add a new department to database
const addDepartment = [
{
  type: "input",
  message: "What should the new department's name be?",
  name: "departmentName"
}];

//function to return inquirer prompts where retrieving information from the database is necessary
const updateInquirerPrompts = async (category) =>
{
  if (category === "role") //checks if the user is attempting to add to the 'role' table
  {
    try //we learned about try / catch statements in class yesterday; i'm gonna try it out!
    {
      const [rows] = await db.promise().query(`SELECT * FROM department`); //retrieves a list of all departments from the database
      const departments = rows.map(department => department.name); //maps each department's name to a new 'departments' array
      
      //uses the above 'departments' list as an array of department options to add the new role to, and returns the set of questions
      return [
      {
        type: "input",
        message: "What should the new role's name be?",
        name: "roleName"
      },
      {
        type: "input",
        message: "What should the new role's salary be?",
        name: "roleSalary"
      },
      {
        type: "list",
        message: "Which department should the new role fall under?",
        name: "roleDepartment",
        choices: departments
      }];
    }
    catch(err) //if an error occurs, catch it & log it to console
    {
      console.log(err);
    }
  }
  else if (category === "employee") //checks if the user is attempting to add to the 'employee' table
  {
    //perform SQL query to save list of role names to a variable
    let roles = await db.promise().query(`SELECT * FROM role`)
    .then(([rows]) => rows.map(role => role.title))
    .catch((err) => console.log(err));

    //perform SQL query to save list of employee first & last names to a variable
    let employees = await db.promise().query(`SELECT * FROM employee`)
    .then(([rows]) => rows.map(employee => `${employee.first_name} ${employee.last_name}`))
    .catch((err) => console.log(err));

    //adds "None" to the top of the list of employees, indicating that the employee does not have an assigned manager
    employees.unshift("None");

    //uses the above variables as lists for role & manager options to assign to the new employee, and returns the set of questions
    return [
    {
      type: "input",
      message: "What is the new employee's first name?",
      name: "employeeFirstName"
    },
    {
      type: "input",
      message: "What is the new employee's last name?",
      name: "employeeLastName"
    },
    {
      type: "list",
      message: "What is the new employee's role?",
      name: "employeeRole",
      choices: roles
    },
    {
      type: "list",
      message: "Who is the new employee's manager?",
      name: "employeeManager",
      choices: employees
    }];
  }
  else if (category === "update")
  {
    //perform SQL query to save list of role names to a variable
    let roles = await db.promise().query(`SELECT * FROM role`)
    .then(([rows]) => rows.map(role => role.title))
    .catch((err) => console.log(err));
    
    //perform SQL query to save list of employee first & last names to a variable
    let employees = await db.promise().query(`SELECT * FROM employee`)
    .then(([rows]) => rows.map(employee => `${employee.first_name} ${employee.last_name}`))
    .catch((err) => console.log(err));

    //uses the above variables as lists for role & manager options to assign to the new employee, and returns the set of questions
    return [
    {
      type: "list",
      message: "Which employee do you want to re-assign?",
      name: "employeeName",
      choices: employees
    },
    {
      type: "list",
      message: "What should their new role be?",
      name: "roleName",
      choices: roles
    }];
  }
}

//initalize connection to mySQL database
const db = mysql.createConnection(
{
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

//function to process the user's main menu choice
const processMenuChoice = async (data) =>
{
  let menuType; //variable to hold type of menu choice selected by user
  let menuChoice; //variable to hold the specific menu choice selected by the user, within the scope of the above type

  //assign the appropriate variables as per the user's menu option choice
  if (data.menuChoice === "View All Departments")
  {
    menuType = "view";
    menuChoice = "department";
  }
  else if (data.menuChoice === "View All Roles")
  {
    menuType = "view";
    menuChoice = "role";
  }
  else if (data.menuChoice === "View All Employees")
  {
    menuType = "view";
    menuChoice = "employee";
  }
  else if (data.menuChoice === "Add Department")
  {
    menuType = "add";
    menuChoice = "department";
  }
  else if (data.menuChoice === "Add Role")
  {
    menuType = "add";
    menuChoice = "role";
  }
  else if (data.menuChoice === "Add Employee")
  {
    menuType = "add";
    menuChoice = "employee";
  }
  else if (data.menuChoice === "Update Employee Role")
  {
    menuType = "update";
    menuChoice = "employee"; //assigning this is unnecessary, but is good future-proofing if functionality for updating other parts of the database were implemented
  }

  if (menuType === "view") //checks if the user is attempting to view from the database
  {
    if (menuChoice === "department") //checks if the user chose to view all departments
    {
      //attempts to print the ID & name of each department in a table to the console
      await db.promise().query(`SELECT id, name AS department_name FROM department`)
      .then(([rows]) => console.table(rows))
      .catch((err) => console.log(err)); //if an error occurs, log it to the console
    }
    else if (menuChoice === "role") //checks if the user chose to view all roles
    {
      //attempts to print the ID, title, salary, and department of each role to the console
      await db.promise().query(`SELECT role.id, role.title AS job_title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id`)
      .then(([rows]) => console.table(rows))
      .catch((err) => console.log(err)); //if an error occurs, log it to the console
    }
    else if (menuChoice === "employee")
    {
      //attempts to print the ID, first name, last name, job title, salary, department, and manager of each employee to the console
      await db.promise().query(`SELECT emp.id AS id, emp.first_name AS first_name, emp.last_name AS last_name, role.title AS job_title, role.salary, department.name AS department, CONCAT(mng.first_name, " ", mng.last_name) AS manager FROM employee emp JOIN role ON emp.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee mng ON emp.manager_id = mng.id`)
      .then(([rows]) => console.table(rows))
      .catch((err) => console.log(err)); //if an error occurs, log it to the console
    }

    //returns to main menu after the table is logged to console
    displayMainMenu();
  }
  else if (menuType === "add") //checks if the user is attempting to add to the database
  {
    if (menuChoice === "department") //checks if the user is attempting to add a department
    {
      inquirer.prompt(addDepartment) //begins inquirer prompts for adding a new department
      .then((data) =>
      {
        //attempts to add new department to database as per the user's input
        db.promise().query(`INSERT INTO department (name) VALUES (?)`, [data.departmentName])
        .then(() => displayMainMenu()) //return to the main menu
        .catch((err) => console.log(err)); //if an error occurs, log it to the console
      })
      .catch((err) => console.log(err)); //if an error occurs, log it to the console
    }
    else if (menuChoice === "role") //checks if the user is attempting to add a role
    {
      let addRole = await updateInquirerPrompts(menuChoice); //creates variable holding an inquirer question set for adding a new role

      inquirer.prompt(addRole) //begins inquirer prompts for adding a new role
      .then(async (data) =>
      {
        //retrieves the ID of the department the user wants to add the new role too
        let department_id = await db.promise().query(`SELECT id FROM department WHERE name = ?`, [data.roleDepartment])
        .then(([rows]) => rows[0].id) //returns the ID of the department the user chose the new role to fall under
        .catch((err) => console.log(err)); //if an error occurs, log it to the console

        //attempts to add new role to database as per the user's input
        await db.promise().query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [data.roleName, data.roleSalary, department_id])
        .then(() => displayMainMenu()) //returns to main menu
        .catch((err) => console.log(err)); //if an error occurs, log it to the console
      })
      .catch((err) => console.log(err)); //if an error occurs, log it to the console
    }
    else if (menuChoice === "employee") //checks if the user is attempting to add a new employee
    {
      let addEmployee = await updateInquirerPrompts(menuChoice); //creates variable holding an inquirer question set for adding a new employee

      inquirer.prompt(addEmployee) //begins inquirer prompts for adding a new employee
      .then(async (data) =>
      {
        //retrieves the ID of the role the user assigned to the new employee
        let role_id = await db.promise().query(`SELECT id FROM role WHERE title = ?`, [data.employeeRole])
        .then(([rows]) => rows[0].id) //returns the ID of the role the user chose the new employee to have
        .catch((err) => console.log(err)); //if an error occurs, log it to the console

        let manager_id; //variable to hold the ID of the new employee's manager

        if (data.employeeManager === "None") //if the user did not assign a manager to the new employee, set the manager_id to NULL
        {
          manager_id = "NULL";
        }
        else //otherwise (i.e. the user assigned a manager to the new employee), retrieve the manager's ID
        {
          manager_id = await db.promise().query(`SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = ?`, [data.employeeManager])
          .then(([rows]) => rows[0].id) //returns the ID of the department the user chose the new role to fall under
          .catch((err) => console.log(err)); //if an error occurs, log it to the console
        }

        //attempts to add new role to database
        await db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [data.employeeFirstName, data.employeeLastName, role_id, manager_id])
        .then(() => displayMainMenu()) //returns to main menu
        .catch((err) => console.log(err)); //if an error occurs, log it to the console
      })
      .catch((err) => console.log(err)); //if an error occurs, log it to the console
    }
  }
  else if (menuType === "update") //checks if the user is attempting to update an employee's role
  {
    let updateEmployee = await updateInquirerPrompts(menuType); //creates variable holding an inquirer question set for updating an employee's role

    inquirer.prompt(updateEmployee) //begins inquirer prompts for updating an employee's role
    .then(async (data) =>
    {
      //retrieves ID of role the user wants to reassign the employee to
      let newRole_id = await db.promise().query(`SELECT id FROM role WHERE title = ?`, [data.roleName])
      .then(([rows]) => rows[0].id) //returns the ID of the role the user chose the new employee to have
      .catch((err) => console.log(err)); //if an error occurs, log it to the console

      //attempts to update the role of the employee the user wants to reassign
      await db.promise().query(`UPDATE employee SET role_id = ? WHERE CONCAT(first_name, " ", last_name) = ?`, [newRole_id, data.employeeName])
      .then(() => displayMainMenu()) //returns to main menu
      .catch((err) => console.log(err)); //if an error occurs, log it to the console
    })
    .catch((err) => console.log(err)); //if an error occurs, log it to the console
  }
}

//function to initialize the application's main menu
const initializeMainMenu = () =>
{
  //attempts to print large ASCII text to console when application is first run
  figlet(`Employee\nManager`, (err, data) =>
  {
    if (err) //if there was an error in the text generation process, log that to the CLI
    {
      console.log(err);
    }
    else //otherwise, print the large ASCII text
    {
      console.log(data);
    }
  });

  //waits 50 milliseconds for figlet to be properly printed, to prevent conflicts with displaying the main menu via inquirer
  setTimeout(() =>
  {
    displayMainMenu();
  }, 50);
}

//function to display the main menu options via inquirer
const displayMainMenu = () =>
{
  //presents the user with a list of main menu options
  inquirer.prompt(mainMenu)
  .then((data) => //processes the user's menu choice
  {
    processMenuChoice(data);
  });
}

//initializes application main menu
initializeMainMenu();