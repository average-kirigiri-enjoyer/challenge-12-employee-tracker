/*
ethan (average-kirigiri-enjoyer)
SCS Boot Camp Module 12 Weekly Challenge - Employee Tracker
Created 2023/09/30
Last Edited 2023/10/01
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
  if (data.menuChoice === "View All Departments")
  {
    db.query(`SELECT * FROM department`, (err, results) =>
    {
      if (err)
      {
        console.log(err);
      }
      else
      {
        console.log(results);
      }
    });
  }
  else if (data.menuChoice === "View All Roles")
  {
    db.query(`SELECT * FROM role`, (err, results) =>
    {
      if (err)
      {
        console.log(err);
      }
      else
      {
        console.log(results);
      }
    });
  }
  else if (data.menuChoice === "View All Employees")
  {
    db.query(`SELECT * FROM employee`, (err, results) =>
    {
      if (err)
      {
        console.log(err);
      }
      else
      {
        console.log(results);
      }
    });
  }
  else
  {
    console.log("haven't added that yet");
  }
}

//function to initialize the application's main menu
const initializeMainMenu = () =>
{
  //presents the user with a list of main menu options
  inquirer.prompt(mainMenu)
  .then(function(data)
  {
    processMenuChoice(data);
  });
}

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

//initializes application main menu
initializeMainMenu();