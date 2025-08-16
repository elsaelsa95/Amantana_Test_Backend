const { Plant, Treatment} = require("./../models")

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

            const treatment = await Treatment.create({UserId: farmerId, PlantId:id})
            return res.status(201).json({ message: `Treatment for plant with ID ${id} has been created` })

        } catch (error) {
            console.log(error)
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
            console.log(error)
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
            console.log(error)
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
            console.log(error)
             res.status(500).json({ message: error.message });
        }
    }
}

module.exports = Controller