# Module 12 Weekly Challenge - Employee Tracker [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

Overseeing a company - especially a large one with lots of employees & tasks to complete - can be a very complicated and difficult task. This application intends to make managing a business much easier by allowing a user to track various departments, roles, & employees within a company.

## Installation

Download the repository files to your computer, and extract the zipped files to a dedicated folder. Navigate to the folder, and rename the ".env.EXAMPLE" file to ".env", and then fill in the empty strings with the appropriate details. DB_USER should contain your MySQL username, DB_PASSWORD your password, and DB_NAME the name of the database to use - in this case, "employees_db".

## Requirements

- Node; https://nodejs.org/en
- MySQL; https://www.mysql.com/

## Usage

Navigate to the repository a git bash shell (or equivalent), and type "npm install" to install the application's dependencies, then type "node server.js". You will be greeted by a text-graphic of the words "Employee Manager", followed by several menu options you can scroll through with the arrow keys, and select with enter.

If you choose one of the menu options to view from the database, you will be presented with the appropriate table. If you choose one of the menu options to add to the database, you will be presented with a series of questions to collect the data needed to add a new entry to the database to your chosen section, after which it will be submitted. If you choose to update an employee's role, you will be prompted to choose the employee whose role you want to update, and the role you want to reassign them to, after which their data will be updated as per your requested changes.

After each operation has been completed, you will be returned to the main menu.

## Demo

See a video demonstrating the application's functionality [here](https://drive.google.com/file/d/12SnqiEOu8HYwEJH0NTcpslRvM-v49KRt/view?usp=sharing)

## Credits

MIT License Badge (./README.md, line 1);
https://gist.github.com/lukas-h/2a5d00690736b4c3a7ba

## License

Operates under a standard MIT license. For more information, refer to the LICENSE file in the repository, or visit the following website; https://opensource.org/licenses/MIT.
