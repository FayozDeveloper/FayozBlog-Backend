import jwt from 'jsonwebtoken'

export default (req,res,next) => {
    const token  = (req.headers.authorization || '').replace(/Bearer\s?/,'');

    if (token){
        try{
            const decoded = jwt.verify(token, 'secretKey');
            req.userId = decoded._id;
            next()
        } catch (err) {
            console.log(err)
            res.status(403).json({
                message: 'Нет 1 доступа',
            })
        }
    } else {
        res.status(403).json({
            message: "Нет 2 доступа"
        })
    }
}
