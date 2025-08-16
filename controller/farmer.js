class Controller {
    static async plant(req,res){
        try {
           res.status(200).json({ message: `masuk farmer` });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = Controller