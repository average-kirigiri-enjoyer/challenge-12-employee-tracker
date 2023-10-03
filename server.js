/*
ethan (average-kirigiri-enjoyer)
SCS Boot Camp Module 12 Weekly Challenge - Employee Tracker
Created 2023/09/30
Last Edited 2023/10/02
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
const updateInquirerPrompts = (category) =>
{
  if (category === "role")
  {
    //save sql query for list of all departments to a variable

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
      choices: [/*template literal to insert the array of departments from database here*/]
    }];
  }
  else if (category === "employee")
  {
    //save sql query for list of all roles to a variable
    //save sql query for list of all employees to a variable

    return [
    {
      type: "input",
      message: "What is the new employee's first name?",
      name: "employeeFirstName"
    },
    {
      type: "input",
      message: "What is the new employee's last name?",
      name: "employeeFirstName"
    },
    {
      type: "list",
      message: "What is the new employee's role?",
      name: "employeeRole",
      choices: [/*template literal to insert the array of roles from database here*/]
    },
    {
      type: "list",
      message: "Who is the new employee's manager?",
      name: "employeeManager",
      choices: [/*template literal to insert the array of employees from database here*/]
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
const processMenuChoice = (data) =>
{
  let menuType; //variable to hold type of menu choice selected by user
  let menuChoice; //variable to hold the specific menu choice selected by the user, within the scope of the above type

  if (data.menuChoice === "View All Departments") //assigns variables to set up an SQL query to retrieve all department data
  {
    menuType = "view";
    menuChoice = "department";
  }
  else if (data.menuChoice === "View All Roles") //assigns variables to set up an SQL query to retrieve all role data
  {
    menuType = "view";
    menuChoice = "role";
  }
  else if (data.menuChoice === "View All Employees") //assigns variables to set up an SQL query to retrieve all employee data
  {
    menuType = "view";
    menuChoice = "employee";
  }
  else if (data.menuChoice === "Add Department") //assigns variables to set up an inquirer prompt to add a new department to the database
  {
    menuType = "add";
    menuChoice = "department";
  }
  else if (data.menuChoice === "Add Role") //assigns variables to set up an inquirer prompt to add a new role to the database
  {
    menuType = "add";
    menuChoice = "role";
  }
  else if (data.menuChoice === "Add Employee") //assigns variables to set up an inquirer prompt to add a new employee to the database
  {
    menuType = "add";
    menuChoice = "employee";
  }
  else if (data.menuChoice === "Update Employee Role") //assigns variable to set up an inquirer prompt to update an employee's role
  {
    menuType = "update";
    menuChoice = "employee"; //even though this is unnecessary, assignde for future proofing
  }

  //if the user chose an option involving viewing data, query the database as per their menu choice
  if (menuType === "view")
  {
    db.promise().query(`SELECT * FROM ${menuChoice}`)
    .then(([rows, fields]) => console.log(rows))
    .then(() => displayMainMenu()) //returns to main menu
    .catch((err) => console.log(err));
  }
  else if (menuType === "add")
  {
    console.log(`added to ${menuChoice} table! i definitely did! not a placeholder!`);
    let fields;
    let newEntry;

    if (menuChoice === "department")
    {

    }
    else if (menuChoice === "role")
    {
      
    }
    else if (menuChoice === "employee")
    {
      
    }
    //if statements to filter between adding department, role, and employee, as they have different fields
      //if statements determine the fields to be added, e.g. const fields = `(id, name)` -> INSERT INTO ${menuchoice} ${fields} VALUES etc...
      //within each if statement, also runs the associated set of inquirer prompts to retrieve the data needed to add to database
    //returns to main menu
  }
  else if (menuType === "update")
  {
    console.log(`updated the employee table! i definitely did! not a placeholder!`);
    //queries list of employees, adds them to an array, and uses that as a list of choices in an inquirer prompt
    //after the user chooses an employee to update;
      //saves the chosen employee's ID to a variable X
      //queries list of roles, adds them to an array, and uses that as a list of choices in an inquirer prompt
    //UPDATE [...] WHERE id = X to change the appropriate employee's role
    //returns to main menu
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
  .then(function(data) //processes the user's menu choice
  {
    processMenuChoice(data);
  });
}

//initializes application main menu
initializeMainMenu();