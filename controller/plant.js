const { Plant } = require("./../models")
const Validator  = require('validatorjs')

class Controller {
    static async createPlant(req,res){
        try {
            const {name, species, location} = req.body;
                const data = {name, species, location}
                const rules = {
                    name: 'required',
                    species: 'required',
                    location: 'required',
                }
            
                const validation = new Validator(data,rules)
            
                if (validation.fails()){
                    return res.status(400).json(validation.errors.all());
                }

                const createPlant = await Plant.create({name, species, location});
                    return res.status(201).json({message: `${createPlant.name} has been added to database`});
                }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    static async readPlant(req,res){
        try {
            const plant= await Plant.findAll();
                return res.status(200).json(plant);
            }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    static async readPlantById(req,res){
        try {
            const id = req.params.id;

            const plant= await Plant.findOne({where: {id}});
            if (!plant) {
                return res.status(404).json({ message: "Plant not found" });
            }
                return res.status(200).json(plant);
            }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    static async updatePlantById(req,res){
        try {
            const id = req.params.id;

            const plant = await Plant.findOne({where: {id}});
            if (!plant) {
                return res.status(404).json({ message: "Plant not found" });
            }

            const {name, species, location} = req.body; 
            const data = {name, species, location}
            const rules = {
                name: 'required',
                species: 'required',
                location: 'required',
            }
            
            const validation = new Validator(data,rules)
            
            if (validation.fails()){
                return res.status(400).json(validation.errors.all());
            }

            await plant.update(req.body);
            return res.status(200).json(plant)
            }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    static async deletePlantById(req,res){
        try {
            const id = req.params.id;

            const plant= await Plant.findOne({where: {id}});
            if (!plant) {
                return res.status(404).json({message: "Plant not found"});
            }

            await plant.destroy();
            return res.status(200).json({ message: "Plant deleted successfully" });
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async addingPlantForFarmer(req,res){
        try {
            const farmerId = req.user.id
            const id = req.params.id

            const plant= await Plant.findOne({where: {id}});
            if (!plant) {
                return res.status(404).json({message: "Plant not found"});
            }

            await plant.update({UserId : farmerId});
            return res.status(200).json(plant)
            }
            catch (error) {
            return res.status(500).json({ message: error.message });

        }
    }
}

module.exports = Controller