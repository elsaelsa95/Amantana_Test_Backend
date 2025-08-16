const { where, Op } = require("sequelize");
const { Plant, Treatment, GrowthLog} = require("./../models")
const Validator  = require('validatorjs')

class Controller {
    static async myPlant(req,res){
        try {
            const farmerId = req.user.id;
            const myPlant= await Plant.findAll({where: {UserId: farmerId}});
            if (!myPlant) {
                return res.status(404).json({ message: "Empty" });
            }
                return res.status(200).json(myPlant);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async plantedDate(req,res){
        try {
            const farmerId = req.user.id;
            const id = req.params.id;

            const myPlant= await Plant.findOne({where: {UserId: farmerId, id}});
            if (!myPlant) {
                return res.status(404).json({ message: "It is not your plant" });
            }
            const {plantedDate} = req.body; 

            await myPlant.update({plantedDate});
            return res.status(200).json(myPlant)

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async createTreatment(req,res){
        try {
            const farmerId = req.user.id;
            const id = req.params.id;

            const myPlant= await Plant.findOne({where: {UserId: farmerId, id}});
            if (!myPlant) {
                return res.status(404).json({ message: "It is not your plant" });
            }

            await Treatment.create({UserId: farmerId, PlantId:id})
            return res.status(201).json({ message: `Treatment for plant with ID ${id} has been created` })

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async readTreatment(req,res){
        try {
            const farmerId = req.user.id;
            const id = req.params.id;

            const treatment= await Treatment.findOne({where: {UserId: farmerId, PlantId:id}});
            if (!treatment) {
                return res.status(404).json({ message: "It is not your plant" });
            }
            return res.status(200).json(treatment)

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async updateTreatment(req,res){
        try {
            const farmerId = req.user.id;
            const id = req.params.id;

            const myPlant= await Treatment.findOne({where: {UserId: farmerId, PlantId:id}});
            if (!myPlant) {
                return res.status(404).json({ message: "It is not your plant" });
            }

            const {firstTreatment, lastTreatment, fertilizer, note} = req.body

            await myPlant.update(req.body);
            return res.status(200).json({message :`Treatment has been updated`})

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async deleteTreatment(req,res){
        try {
            const farmerId = req.user.id;
            const id = req.params.id;

            const myPlant= await Treatment.findOne({where: {UserId: farmerId, PlantId:id}});
            if (!myPlant) {
                return res.status(404).json({ message: "It is not your plant" });
            }

            await myPlant.destroy();
            return res.status(200).json({message :`Treatment has been deleted`})

        } catch (error) {
             res.status(500).json({ message: error.message });
        }
    }
    static async createGrowthLog(req,res){
        try {
            const farmerId = req.user.id;
            const id = req.params.id;

            const myPlant= await Plant.findOne({where: {UserId: farmerId, id}});
            if (!myPlant) {
                return res.status(404).json({ message: "It is not your plant" });
            }

            const {height, diameter, date} = req.body
            const data = {height, diameter, date}
            const rules = {
                height: 'required',
                diameter: 'required',
                date: 'required|date',
            }
                        
            const validation = new Validator(data,rules)
                        
            if (validation.fails()){
                return res.status(400).json(validation.errors.all());
            }

            const validateDate = await GrowthLog.findOne({where:{PlantId:id, date:req.body.date}}) 
            
            if (validateDate){
                return res.status(400).json({message:`You have been create log today`})
            }

            const createLog = await GrowthLog.create({ height, diameter, date, UserId: farmerId, PlantId:id})
            return res.status(201).json(createLog)

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async readGrowthLog(req,res){
        try {
            const farmerId = req.user.id;
            const id = req.params.id;

            const myPlant= await Plant.findOne({where: {UserId: farmerId, id}});
            if (!myPlant) {
                return res.status(404).json({ message: "It is not your plant" });
            }

            const readLog = await GrowthLog.findAll({where: {UserId: farmerId, PlantId: id}})
            return res.status(201).json(readLog)

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async readGrowthLogByPeriod(req, res){
        try {
            const farmerId = req.user.id;
            const id = req.params.id;

            const myPlant= await Plant.findOne({where: {UserId: farmerId, id}});
            if (!myPlant) {
                return res.status(404).json({ message: "It is not your plant" });
            }

            const {startDate, endDate} = req.body

            const readLog = await GrowthLog.findAll({where: {UserId: farmerId, PlantId: id, date:{[Op.between]:[startDate, endDate]}}})
            return res.status(201).json(readLog)

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = Controller