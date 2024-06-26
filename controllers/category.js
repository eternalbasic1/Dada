const Category = require("../models/category");

exports.getCategoryById = async (req,res,next,id) => {
    try{
        const cate = await Category.findById(id).exec();
        if (!cate) {
            return res.status(400).json({
                    error: "Category not found in DB"
                });
        }
        req.category = cate;
        next();
    }catch (err) {
        return res.status(500).json({
            error: "Internal server error"
        });
    }

};

exports.createCategory = (req,res) =>{
    const category = new Category(req.body);
    category.save((err,category) => {
        if(err){
            return res.status(400).json({
                error: " No Able to save Category in DB"
            });
        }
        res.json({category});
    })
}

exports.getCategory = (req,res) => {
    return res.json(req.category);
}

exports.getAllCategory = (req,res) => {
    Category.find().exec((err,categories)=>{
        if(err){
            return res.status(400).json({
                error: " No Categories found in DB"
            });
        }
        res.json(categories);
    })
};

exports.updateCategory = (req,res) => {
    const category = req.category;
    category.name = req.body.name;
    
    category.save((err,updatedCategory)=> {
        if(err){
            return res.status(400).json({
                error: " Failed to update the category"
            });
        }
        res.json(updatedCategory);
    })
};

exports.removeCategory = (req,res) => {
    const category = req.category;
    category.remove((err,category) => {
        if(err){
            return res.status(400).json({
                error: " Failed to delete this category"
            });
        }
        res.json({
            message: `Successfully deleted ${category}`
        })
    })
}