const inquire = require('inquirer');
const db = require('./config/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');

function run() {
    inquire
        .prompt([
            {
                type: "list",
                name: "selection",
                question: "What would you like to do?",
                choices: [
                    "View All Departments",
                    "View All Roles",
                    "View All Employees",
                    "Add a Department",
                    "Add a Role",
                    "Add an Employee",
                    "Update an Employee Role",
                    "Quit"
                ]
            }
        ]).then((data) => {
            if (data.selection === "View All Departments") {
                viewAllDepartments();
            } else if (data.selection === "View All Roles") {
                viewAllRoles();
            } else if (data.selection === "View All Employees") {
                viewAllEmployees();
            } else if (data.selection === "Add a Department") {
                createDepartment();
            } else if (data.selection === "Add a Role") {
                createRole();
            } else if (data.selection === "Add an Employee") {
                createEmployee();
            } else if (data.selection === "Update an Employee Role") {
                updateEmployeeRole();
            } else {
                return;
            }
        })
}