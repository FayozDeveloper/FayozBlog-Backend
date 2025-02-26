import PostModel from "../model/Post.js";
import UserModel from "../model/User.js";

export const createPosts = async (req, res) => {
    try{
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            author: req.userId,
        })

        const post = await doc.save();
        res.json(post)
    } catch (e){
        console.log(e)
        res.status(500).json({
            message: 'Не удалось создать статью',
        })
    }
}

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(4).exec();
        const tags = posts.map(obj => obj.tags).flat().slice(0, 5);
        res.json(tags);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Не удалось получить теги',
        })
    }
}
export const getAllPosts = async (req, res) => {
    try{
        const {tab} = req.query
        const sortBy = tab === "1" ? {views: -1} : {createdAt: -1};

        const posts = await PostModel.find()
            .sort(sortBy)
            .populate('author', '-passwordHash').exec();

        res.json(posts)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}
export const getPostByTag = async (req, res) => {
    try {
        const {tag} = req.params;
        const posts = await PostModel.find({tags: { $in: [tag]}});
        res.status(200).json(posts)
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Не удалось получить статьи через теги',
        })
    }
}
export const getOnePost = async (req, res) => {
    try{
        const postId = req.params.id;
        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: {views: 1},
            },
            {
                returnDocument: 'after',
            },
            (err, doc) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Не удалось получить статью'
                    })
                }

                if (!doc){
                    return res.status(404).json({
                        message: 'Статья не найдено'
                    });
                }
                res.json(doc);
            },
        ).populate('author')
            .populate({
            path: 'comments.user',
            select: 'fullName avatarUrl'
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Can\'t get a post'
        })
    }
}

export const removePost = async (req, res) => {
    try{
        const postId = req.params.id;

        PostModel.findByIdAndDelete(
            {
                _id: postId,
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        message: 'Не удалось удалить статью'
                    });
                }
                if (!doc){
                    res.status(404).json({
                        message: 'Статья не найдено'
                    });
                }

                res.json({
                    success: true
                });
            },
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статью'
        });
    }
}

export const updatePost = async (req,res) => {
    try{
        const postId = req.params.id
        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags.split(','),
                author: req.userId,
            },
        );

        res.json({
            success: true
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось обновить статью'
        });
    }
}

export const addComment = async (req, res) => {
    try{
        const { postId, text } = req.body;
        const userId = req.userId;

        const post =  await PostModel.findById(postId);
        if (!post){
            return res.status(404).json({ message: 'Пост не найден' })
        }

        const user = await UserModel.findById(userId)
            .select('-email -passwordHash -updatedAt')
        if (!user){
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const newComment = {
            user: user,
            text,
        }

        post.comments.push(newComment);
        await post.save()

        res.json(newComment)
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Не удалось добавить коментарий'
        })
    }
}