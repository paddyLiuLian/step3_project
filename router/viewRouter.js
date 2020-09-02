
const router = require('express').Router();
const db = require("./sqlHelper");
router.get("/",(req,res)=>{
    res.redirect("/index.html");
})

router.get("/index.html",(req,res)=>{
    let sql="select * from banner where keyName='lun'";
    db.query(sql,[],function(err,data){
        let sql2 =`SELECT product.*,productrule.Id AS rid FROM product JOIN productrule ON product.Id = productrule.productId WHERE isDefault =1 
AND isNew=1`;
        db.query(sql2,[],function(err2,data2){
            if(req.session.user){
                res.render("index",{user:req.session.user,
                    headImage:req.session.info.HeadImage,
                    lunbo:data,
                    newList:data2
                })
            }else{
                res.render("index",{user:req.session.user,
                    lunbo:data,
                    newList:data2
                });
            }
        })
    })


})
function getBanner(){
    return new Promise((resolve,reject)=>{
        let sql = "select * from banner where keyName = 'lun'";
        db.query(sql,[],(err,data)=>{
            if (err){
                reject(err);
            }else {
                resolve(data);
            }
        })
    })
}
function getNewList(){
    return new Promise((resolve, reject) => {
        let sql2 = 'SELECT DISTINCT product.Id FROM product JOIN productrule' +
            ' ON product.Id = productrule.productId WHERE  isNew = 1 AND isDefault = 1';
        db.query(sql2,[],(err,data)=>{
            if (err){
                reject(err);
            }else {
                resolve(data);
            }
        })
    })
}
router.get("/product.html",(req,res)=>{
    res.render("product")
})
router.get("/user.html",(req,res)=>{
    let sql = "select * from user";
    db.query(sql,[],function (err,data) {
        res.render("user",{userList:data})
    })

})
router.get("/productDetail.html",(req,res)=>{
    let rid = req.query.id;
    let sql = `SELECT *,r.Id AS rid FROM product AS  p JOIN productrule AS r
     ON p.Id = r.productId WHERE r.Id=?`;
    db.query(sql,[rid],function (err,data) {
        console.log(data);
        res.render("productDetail",{
            info:data[0],
            user:req.session.user,
            headImage:req.session.headImage
        })
    })

})
router.get("/cart.html",(req,res)=>{
    if (req.session.user){
        let userId = req.session.info.id;
        let sql = "select * from shopoart where userid=?";
        db.query(sql,[userId],(err,data)=>{
            res.render("cart",{
                user:req.session.user,
                headImage:req.session.headImage,
                productList:data
            })
        })
        res.render("cart",{user:req.session.user,headImage:req.session})
    }else {
        res.redirect("/index.html");
    }
})
module.exports = router;