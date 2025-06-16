import express from 'express';
import ShelfRepository from '../repositories/shelf.repository';
import datasource from '../db/data-source';
import { Shelf } from '../entities/shelf.entity';
import ShelfService from '../services/shelf.service';
import ShelfController from '../controllers/shelf.controller';
import OfficeRepository from '../repositories/office.repository';
import { Office } from '../entities/office.entity';

const shelfRouter=express.Router();

const shelfRepository=new ShelfRepository(datasource.getRepository(Shelf));
const officeRepository=new OfficeRepository(datasource.getRepository(Office))
const shelfService=new ShelfService(shelfRepository,officeRepository);
const shelfController=new ShelfController(shelfService,shelfRouter);

export {shelfService}
export default shelfRouter;