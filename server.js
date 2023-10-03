/*
ethan (average-kirigiri-enjoyer)
SCS Boot Camp Module 12 Weekly Challenge - Employee Tracker
Created 2023/09/30
Last Edited 2023/10/03
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
      const [rows, fields] = await db.promise().query(`SELECT * FROM department`);
      const departments = rows.map(department => department.name);
      
      //uses the departments list as an array of department options to add the new role to, and returns the set of questions
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
    catch(err)
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

    //adds "None" to the top of the list of employees, indicated that the employee does not have an assigned manager
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
    db.promise().query(`SELECT * FROM ?`, [menuChoice])
    .then(([rows]) => console.log(rows))
    .then(() => displayMainMenu()) //returns to main menu
    .catch((err) => console.log(err));
  }
  else if (menuType === "add")
  {
    if (menuChoice === "department")
    {
      inquirer.prompt(addDepartment)
      .then((data) =>
      {
        //attempts to add new role to database
        db.promise().query(`INSERT INTO department (name) VALUES (?)`, [data.departmentName])
        .then(() => displayMainMenu()) //returns to main menu
        .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
    }
    else if (menuChoice === "role")
    {
      let addRole = await updateInquirerPrompts(menuChoice);

      inquirer.prompt(addRole)
      .then(async (data) =>
      {
        let department_id = await db.promise().query(`SELECT id FROM department WHERE name = ?`, [data.roleDepartment])
        .then(([rows]) => rows[0].id) //returns the ID of the department the user chose the new role to fall under
        .catch((err) => console.log(err));

        //attempts to add new role to database
        await db.promise().query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [data.roleName, data.roleSalary, department_id])
        .then(() => displayMainMenu()) //returns to main menu
        .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
    }
    else if (menuChoice === "employee")
    {
      let addEmployee = await updateInquirerPrompts(menuChoice);

      inquirer.prompt(addEmployee)
      .then(async (data) =>
      {
        let role_id = await db.promise().query(`SELECT id FROM role WHERE title = ?`, [data.employeeRole])
        .then(([rows]) => rows[0].id) //returns the ID of the role the user chose the new employee to have
        .catch((err) => console.log(err));

        let manager_id; //initializes manager_id variable

        if (data.employeeManager === "None") //if the user did not assign a manager to the new employee, set the manager_id to NULL
        {
          manager_id = "NULL";
        }
        else //otherwise (i.e. the user assigned a manager to the new employee), retrieve the manager's ID
        {
          manager_id = await db.promise().query(`SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = ?`, [data.employeeManager])
          .then(([rows]) => rows[0].id) //returns the ID of the department the user chose the new role to fall under
          .catch((err) => console.log(err));
        }

        //attempts to add new role to database
        await db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [data.employeeFirstName, data.employeeLastName, role_id, manager_id])
        .then(() => displayMainMenu()) //returns to main menu
        .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
    }
  }
  else if (menuType === "update")
  {
    let updateEmployee = await updateInquirerPrompts(menuType);

    inquirer.prompt(updateEmployee)
    .then(async (data) =>
    {
      let newRole_id = await db.promise().query(`SELECT id FROM role WHERE title = ?`, [data.roleName])
      .then(([rows]) => rows[0].id) //returns the ID of the role the user chose the new employee to have
      .catch((err) => console.log(err));

      await db.promise().query(`UPDATE employee SET role_id = ? WHERE CONCAT(first_name, " ", last_name) = ?`, [newRole_id, data.employeeName])
      .then(() => displayMainMenu()) //returns to main menu
      .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
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