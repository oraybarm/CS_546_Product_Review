const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {
    getAllPosts,
    createPost,
    getPostsWithUser,
    getPost,
    likePost,
    replyToPost,
    getRepliesById,
    getPostRepliesWithUser,
} = require("../data/community");
const { getUser, getUserById } = require("../data/users");
const { authMiddleware } = require("../middlewares/auth");
const { isValidString, isValidObject, isValidObjectId } = require("../utils");
const { ObjectId } = require("mongodb");
const xss = require("xss");

router.get("/", async (req, res) => {
    let posts, src;
    if (!req.session.user) {
        src = "/public/images/guest-user.jpg";
        posts = await getPostsWithUser();
    } else {
        const user = await getUser(req.session.user);
        posts = await getPostsWithUser();
        src = !_.isEmpty(user.photo)
            ? `/public/images/upload/${user.photo}`
            : "/public/images/guest-user.jpg";
    }
    res.render("community/community", {
        title: `Community ${posts.length}`,
        authenticated: req.session.user ? true : false,
        user: req.session.user || "",
        src,
        posts,
    });
});

router.post("/", authMiddleware, async (req, res) => {
    try {
        const user = await getUser(req.session.user);
        let {
            post: { title },
        } = req.body;

        title = xss(title);

        if (!user) {
            req.session.error = "You must be logged in to post";
            return res.redirect("/community");
        }
        isValidString(title, "postName", 1);
        const post = {
            title,
            user,
        };
        const newPost = await createPost(user._id, title);
        req.session.updateSuccessful = true;
        return res.json(newPost);
    } catch (error) {
        console.log(`error`, error);
        res.status(404).render("errorPage/404");
    }
});

router.get("/post/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) throw "No postId provided";
        isValidObjectId(ObjectId(id));

        const post = await getPost(id);
        if (!post) throw "No post found";
        const user = await getUserById(post.creator.toString());
        const src = !_.isEmpty(user.photo)
            ? `/public/images/upload/${user.photo}`
            : "/public/images/guest-user.jpg";

        const replies = await getPostRepliesWithUser(id);
        res.render("community/post", {
            title: `${post.name}`,
            authenticated: req.session.user ? true : false,
            user: req.session.user || "",
            src,
            post,
            replies: replies.reverse(),
            isSameUser: req.session.user === user.email ? true : false,
        });
    } catch (error) {
        console.log(`error`, error);
        res.status(404).render("errorPage/404");
    }
});

router.post("/post/:id/like", async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) throw "No postId provided";
        isValidObjectId(ObjectId(id));
        id = xss(id);

        const post = await getPost(id);
        if (!post) throw "No post found";
        const user = await getUser(req.session.user);
        const updatedLike = await likePost(id, user._id);
        return res.json(updatedLike);
    } catch (error) {
        console.log(`error in post like`, error);
        res.status(404).render("errorPage/404");
    }
});

router.post("/post/:id/reply", async (req, res) => {
    try {
        const { id } = req.params;
        let { reply } = req.body;
        reply = xss(reply);
        id = xss(id);
        if (!id) throw "No postId provided";
        isValidObjectId(ObjectId(id));

        const post = await getPost(id);
        if (!post) throw "No post found";
        const user = await getUser(req.session.user);
        const returnedReply = await replyToPost(id, user._id, reply);
        const lastReply = returnedReply.pop();

        const replyWithUser = await getRepliesById(lastReply["_id"].toString());
        return res.json({
            replyWithUser,
            replyCount: returnedReply.length,
        });
    } catch (error) {
        console.log(`error in post reply: `, error);
        res.status(404).render("errorPage/404");
    }
});

module.exports = router;
