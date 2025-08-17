const { Op, fn, col } = require("sequelize");
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

            const {height, diameter} = req.body
            const data = {height, diameter}
            const date = new Date().toLocaleDateString('en-EN')

            const rules = {
                height: 'required',
                diameter: 'required',
            }
                        
            const validation = new Validator(data,rules)
                        
            if (validation.fails()){
                return res.status(400).json(validation.errors.all());
            }

            const validateDate = await GrowthLog.findOne({where:{PlantId:id, date}}) 
            
            if (validateDate){
                return res.status(400).json({message:`You have been create log today`})
            }

            const plantName = await Plant.findOne({where:{id}})

            const createLog = await GrowthLog.create({ name: plantName.name, height, diameter, date, UserId: farmerId, PlantId:id})
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

            let heightLog = readLog.map((x) => {
                return parseInt(JSON.stringify(x.height))
            })

            let diameterLog = readLog.map((x) => {
                return parseInt(JSON.stringify(x.diameter))
            })

            const averageLog = (arr) => {
                if(arr.length === 0) {
                    return res.status(404).json({message : "No Data"})
                }
                const sumLog = arr.reduce((total, value) => total + value, 0)
                return sumLog/arr.length
            }

            return res.status(200).json({message : `average height = ${averageLog(heightLog)} & average diameter ${averageLog(diameterLog)}`})
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async compareGrowth(req,res) {
        try {
            const farmerId = req.user.id;

            const {name, otherFarmerId, startDate, endDate} = req.body
            const data = {name, otherFarmerId}
            const rules = {
                name: 'required',
                otherFarmerId: 'required',
                // startDate: 'required',
                // endDate: 'required'
            }
            
            const validation = new Validator(data,rules)
                        
            if (validation.fails()){
                return res.status(400).json(validation.errors.all());
            }

            const readLogYourPlant = await GrowthLog.findAll({where: {UserId: farmerId, name, date:{[Op.between]:[startDate, endDate]}}})

            if (!readLogYourPlant) {
                return res.status(404).json({ message: "You don't have this plant" });
            }

            let heightLogYourPlant = readLogYourPlant.map((x) => {
                return parseInt(JSON.stringify(x.height))
            })

            let diameterLogYourPlant = readLogYourPlant.map((x) => {
                return parseInt(JSON.stringify(x.diameter))
            })

            const readLogOtherPlant = await GrowthLog.findAll({where: {UserId: otherFarmerId, name, date:{[Op.between]:[startDate, endDate]}}})

            if (!readLogOtherPlant) {
                return res.status(404).json({ message: "The Farmer don't have this plant" });
            }

            let heightLogOtherPlant = readLogOtherPlant.map((x) => {
                return parseInt(JSON.stringify(x.height))
            })

            let diameterLogOtherPlant = readLogOtherPlant.map((x) => {
                return parseInt(JSON.stringify(x.diameter))
            })

            return res.status(200).json(
                {message : 
                    `Your Plant : height ${heightLogYourPlant} & diameter ${diameterLogYourPlant}, Other Farmer Plant : height ${heightLogOtherPlant} & diameter ${diameterLogOtherPlant}`}
            )
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message });
        }
    }
    static async top5(req,res) {
        try {
            const top5 = await GrowthLog.findAll({
                attributes:[
                    "PlantId",
                    "UserId",
                    "name",
                    [fn("AVG", col("height")), "avgHeight"],
                ],
                group:[ "PlantId", "UserId", "name"],
                order: [["avgHeight", "DESC", ]],
                limit:5,
            })
            return res.status(200).json(top5)
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = Controller