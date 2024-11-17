import express from 'express'
import upload from '../../midellwares/upload.js'
import { createDB, updateDB } from './fileController.js'

const fileRouter = express.Router()

fileRouter.post('/create', upload.single('file'), createDB)

fileRouter.patch('/update', upload.single('file'), updateDB)

export default fileRouter
