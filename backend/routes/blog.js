const { Router } = require("express");
const multer = require("multer");
const path = require('path');
const User = require("../mongoSchema/user");
const Blog = require('../mongoSchema/blog')
const Comment = require('../mongoSchema/comment')
const mongoose = require('mongoose');

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./public/uploads/`);
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage })

router.get("/add-new", (req, res) => {
    return res.render("addBlog", {
        user: req.user,
        editing: false
    });
})

router.get("/edit", async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
        editing: true
    });
})

router.post("/edit-blog", upload.single("coverImage"), async (req, res) => {
   
    const { title, body, blogId } = req.body
    console.log(blogId, typeof blogId);

    let n;
    if (blogId[blogId.length - 1] === ' ') n = blogId.slice(0, -1);
    n = blogId;
    console.log(n + 'in')
    try {
        const blog = await Blog.findById(n).exec();

        console.log(blog);

        blog.title = title
        if (req.file) {
            blog.coverImageURL = `/uploads/${req.file.filename}`;
        }
        blog.body = body;

        await blog.save();
        console.log(blog);

    } catch (error) {
        console.log(error.message)
    }

    res.redirect('/')
});

router.get("/edit-blog/:blogId", async (req, res) => {
    const blogId = req.params.blogId;
    let blog;
    try {
        blog = await Blog.findOne({ _id: blogId })
    }
    catch (err) {
        console.log(err)
    }


    if (!blog) {
        return res.redirect("/");
    }
    res.render("addBlog", {
        editing: true,
        blog: blog,
        user: req.user
    })
})

router.post("/delete", async (req, res) => {
    const blogId = req.body.blogId;
    try {
        await Blog.findByIdAndRemove(blogId);
        console.log("Blog Destroyed !!");
    } catch (err) {
        console.log(err);
    }
    res.redirect("/blog/edit");
})

router.get('/:id', async (req, res) => {
    console.log(req.params.id);
    const blog = await Blog.findById(req.params.id).populate("createdBy");

    // console.log(blog);
    const comments = await Comment.find({ blogId: req.params.id }).populate(
        "createdBy"
    );
    console.log("comments", comments);
    return res.render('blog', {
        user: req.user,
        blog,
        comments,
    });

});

router.post("/comment/:blogId", async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/", upload.single("coverImage"), async (req, res) => {
    const { title, body } = req.body
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`,
    });
    return res.redirect(`/blog/${blog._id}`);
});


module.exports = router;