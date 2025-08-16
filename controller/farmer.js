const { Plant } = require("./../models")

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
}

module.exports = Controller