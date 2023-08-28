const Employee = require('../models/Employee');

// get all employees
const getAllEmployees = async (req, res) => {
        const employees = await Employee.find({}).exec();
        if(!employees) {
            return res.status(204).json({ message: 'Employees not found' }); // 204 No Content
        }
        return res.status(200).json(employees); // 200 OK
}

// create a new employee
const createEmployee = async (req, res) => {
    if(!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ message: 'Firstname and Lastname are required'} ); // 400 Bad Request
    }
    try {
        const {firstname, lastname} = req.body;
        const newEmployee = new Employee({ firstname: firstname, lastname: lastname });
        const result = await Employee.create(newEmployee);
        return res.status(201).json(result);  // 201 Created
    } catch (error) {
        return res.status(500).json({message: error.message}); //! 500 Internal Server Error
    }
}

// update an employee
const updateEmployee = async (req, res) => {
    if(!req?.body?.id) {
        return res.status(400).json({message: 'Employee ID is required'}); // 400 Bad Request
    }
    const employee = await Employee.findById(req.body.id).exec();
    if(!employee) {
        return res.status(404).json({message:`Employee with ID ${ req.body.id } not found`}); // 404 Not Found
    }
    if(req?.body?.firstname) {
        employee.firstname = req.body.firstname;
    }
    if(req?.body?.lastname) {
        employee.lastname = req.body.lastname;
    }
        const result = await employee.save();
        return res.status(200).json(result); // 200 OK 
}

// delete an employee
const deleteEmployee = async (req, res) => {
    if(!req?.body?.id) {
        return res.status(400).json({message: 'Employee ID is required'}); // 400 Bad Request
    }
        const employee = await Employee.findById(req.body.id).exec();
        if(!employee) {
            return res.status(404).json({message:`Employee with ID ${ req.body.id } not found`}); // 404 Not Found
        }
        const result = await employee.deleteOne({ _id: req.body.id });
        return res.status(200).json(result); // 200 OK 
}

const getEmployee = async (req, res) => {
    if(!req?.params?.id) {
        return res.status(400).json({message: 'Employee ID is required'}); // 400 Bad Request
    }
    const employee = await Employee.findById(req.params.id).exec();
    if(!employee) {
        return res.status(404).json({message:`Employee with ID ${ req.params.id } not found`});
    }
    return res.status(200).json(employee);
}

module.exports = { 
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee 
};

