const inquire = require('inquirer');
const db = require('./config/connection');
const cTable = require('console.table');

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

async function viewAllDepartments() {

    const departments = await db.query('SELECT * FROM department');

    console.table(departments);

    run();

}

async function viewAllRoles() {

    const roles = await db.query('SELECT * FROM roles INNER JOIN department ON roles.department_id=department.id');

    console.table(roles);

    run();

}

async function viewAllEmployees() {

    const employees = await db.query('SELECT * FROM employee INNER JOIN roles ON employee.roles_id=roles.id');

    console.table(employees);

    run();

}

async function createDepartment() {
    
    inquire
        .prompt([
            {
                type: "input",
                name: "department_name",
                message: "Provide a department name."
            }
        ])
        .then((data) => {
            console.log(data);
            const sql = `INSERT INTO department (department_name) 
                VALUES ("${data.department_name}")`;
            db.query(sql, (err, result) => {
                if (err) throw err; 
                console.log('New department added to departments.');
                if (result) {
                    run();
                }
            });
        })  
}

async function createRole() {

    const departments = await db.query('SELECT * FROM department')

    const departmentChoices = departments.map(department => {
        return {
            name: department.department_name,
            value: department.id
        }
    })

    inquire
        .prompt([
            {
                type: "input",
                name: "title",
                message: "Provide a role title."
            },
            {
                type: "number",
                name: "salary",
                message: "Provide a salary."
            },
            {
                type: "list",
                name: "department_id",
                message: "Select a department.",
                choices: departmentChoices
            }    
        ])
        .then((data) => {
            console.log(data);
            const sql = `INSERT INTO roles (title, salary, department_id) 
                VALUES ("${data.title}", ${data.salary}, ${data.department_id})`;
            db.query(sql, (err, result) => {
                if (err) throw err; 
                console.log('New role added to roles.');
                if (result) {
                    run();
                }
            });
        })  
}

async function createEmployee() {
    const roles = await db.query('SELECT * FROM roles');

    const roleSelection = roles.map(roles => {
        return {
            name: roles.title,
            value: roles.id
        }
    })

    console.log(roleSelection);
    const employees = await db.query('SELECT * FROM employee');

    const managers = employees.map(employees => {
        return {
            name: employees.first_name + " " + employees.last_name,
            value: employees.id
        }
    });

    inquire
        .prompt([
            {
                type: "input",
                name: "first_name",
                message: "Provide a first name."
            },
            {
                type: "input",
                name: "last_name",
                message: "Provide a last name."
            },
            {
                type: "list",
                name: "roles_id",
                message: "Select the employee's role.",
                choices: roleSelection
            },
            {
                type: "list",
                name: "manager_id",
                message: "Select the employee's manager.",
                choices: managers
            }    
        ]).then((data) => {
            const sql = `INSERT INTO employee (first_name, last_name, roles_id, manager_id) 
                VALUES ("${data.first_name}", "${data.last_name}", ${data.roles_id}, ${data.manager_id})`;
            db.query(sql, (err, result) => {
                if (err) throw err; 
                console.log('New employee added to employees.');
                if (result) {
                    run();
                }
            });
        })
}
