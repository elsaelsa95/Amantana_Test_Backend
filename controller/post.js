const { Post } = require("./../models")
const Validator  = require('validatorjs')

class Controller {
    static async createPost(req,res){
        try {
            const userId = req.user.id;

            const {title, image, caption} = req.body
            const data = {title, image, caption}
            const date = new Date().toLocaleDateString('en-EN')
            
            const rules = {
                title: 'required',
                image: 'required',
                caption: 'required',
            }
                        
            const validation = new Validator(data,rules)
                        
            if (validation.fails()){
                return res.status(400).json(validation.errors.all());
            }

            const createPost = await Post.create({title, image, caption, date, UserId: userId})
            return res.status(201).json(createPost)

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    static async readAllPost(req,res){
        try {
            const readAllPost = await Post.findAll()
            return res.status(200).json(readAllPost)
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    static async readPostById(req,res){
        try {
            const id = req.params.id
            const readPostDetail = await Post.findOne({where: {id}})
            return res.status(200).json(readPostDetail)
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    static async updatePostById(req,res){
        try {
            const userId= req.user.id
            const id = req.params.id
            const postById = await Post.findOne({where: {id, UserId:userId}})
            if(!postById){
                return res.status(403).json({message: "It is not your post"})
            }

            const {title, image, caption} = req.body
            const data = {title, image, caption}
            const date = new Date().toLocaleDateString('en-EN')
            
            const rules = {
                title: 'required',
                image: 'required',
                caption: 'required',
            }
                        
            const validation = new Validator(data,rules)
                        
            if (validation.fails()){
                return res.status(400).json(validation.errors.all());
            }

            await postById.update({title, image, caption, date, UserId: userId})
            return res.status(200).json(postById)
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    static async deletePostById(req,res){
        try {
            const userId= req.user.id
            const id = req.params.id
            const postById = await Post.findOne({where: {id, UserId:userId}})
            if(!postById){
                return res.status(403).json({message: "It is not your post"})
            }

            await postById.destroy()
            return res.status(200).json({message: "Post has been deleted"});
        } catch (error) {
             return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = Controller