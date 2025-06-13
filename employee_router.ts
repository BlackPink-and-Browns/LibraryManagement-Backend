import express from "express";
import Employee from "./entities/employee.entity";
import datasource from "./db/data-source";
// import { Entity } from "typeorm";

const employeeRouter = express.Router();
let count = 2;

employeeRouter.get("/", async (req, res) => {
  const employeeRepository = datasource.getRepository(Employee);
  const employees = await employeeRepository.find()
  res.status(200).send(employees);
});

employeeRouter.get("/:id", async(req, res) => {
  const empId = Number(req.params["id"]);
  const employeeRepository = datasource.getRepository(Employee);
  // const employee = await employeeRepository.find({where:{id:empId}})
  const employee = await employeeRepository.findOneBy({id:empId}) //will return only one entry
  if (!employee) {
    res.status(404).send("Employee not found");
    return;
  }
  res.status(200).send(employee);
});

employeeRouter.post("/", async(req, res) => {
  const employeeRepository = datasource.getRepository(Employee);
  const newEmployee = new Employee();
  newEmployee.email = req.body.email;
  newEmployee.name = req.body.name;

  await employeeRepository.insert(newEmployee)
  res.status(201).send(newEmployee);
});

employeeRouter.delete("/:id", async(req, res) => {
  const empId = Number(req.params["id"]);
  const employeeRepository = datasource.getRepository(Employee);
  await employeeRepository.delete({id:empId})
  res.status(204).send();
});

employeeRouter.put("/:id", async(req, res) => {
  const empId = Number(req.params["id"]);
  const employeeRepository = datasource.getRepository(Employee);
  const employee = await employeeRepository.findOneBy({id:empId})
  employee.email = req.body.email;
  employee.name = req.body.name;
  await employeeRepository.save(employee)

  res.status(200).send(employee);
});

employeeRouter.patch("/:id", async(req, res) => {
  const empId = Number(req.params["id"]);
  const employeeRepository = datasource.getRepository(Employee);
  if(req.body.name) {
    await employeeRepository.update(empId , {name:req.body.name})
  }
  else if (req.body.email){
    await employeeRepository.update(empId,{email:req.body.email})
  }

  res.status(200).send(await employeeRepository.findOneBy({id:empId}));
});

export default employeeRouter;
