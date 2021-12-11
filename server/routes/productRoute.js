const express = require("express");
const router = express.Router();
const productData = require("../data/products");
const { authMiddleware } = require("../middlewares/auth");
const session = require("express-session");
const xss = require("xss");
const multer = require("multer");
const userData = require("../data/users");
const { ObjectId } = require("mongodb");

const reviews = require("../data/reviews");
const { getUser } = require("../data/users");
const { isValidObjectId } = require("../utils");
const _ = require("lodash");
const { check } = require("express-validator");

//Multer Functions required
const storage = multer.diskStorage({
    //destination for files
    destination: function (request, file, callback) {
        callback(null, "./public/images/upload");
    },

    //add back the extension
    filename: function (request, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});

//upload parameters for multer
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3,
    },
});
function checkId(id) {
    if (!id) throw "Error: Please provide argument id";
    //if (typeof id !== "string") throw "Error:ID is not of string type.";
    if (typeof id === "string" && id.trim().length < 1) {
        throw "Error: ID is a blank string has been passed as argument";
    }
    if (!ObjectId.isValid(id))
        throw "Error: Provided ID is not valid argument ";
}
router.post("/search", async (req, res) => {
    const body = req.body;

    let searchTerm = body.searchInput;
    let searchValue = body.searchSelect;
    searchTerm = xss(searchTerm);
    searchValue = xss(searchValue);
    if (!searchTerm || searchTerm.trim().length == 0) {
        res.status(404).render("errorPage/noSearch", {
            message: "Search bar should not be blank",
        });
        return "Error: Search term blank";
    } else {
        searchTerm = searchTerm.toLowerCase();

        if (searchValue === "name" || searchValue === "Search product by") {
            try {
                let search_List = await productData.getProductByProductName(
                    searchTerm
                );
                res.status(200).render("searchPage/searchPage", {
                    title: "Search",
                    products: search_List,
                });
            } catch (e) {
                return res.status(404).render("errorPage/noSearch", {
                    title: "Error",
                });
            }
        }
        if (searchValue === "tag") {
            try {
                let search_List = await productData.getProductbyTag(searchTerm);
                res.status(200).render("searchPage/searchPage", {
                    title: "Search",
                    products: search_List,
                });
            } catch (e) {
                return res
                    .status(404)
                    .render("errorPage/noSearch", { title: "Error" });
            }
        }
    }
});

router.get("/search/:id", async (req, res) => {
    let searchTerm = req.params.id;
    let searchValue = "tag";
    searchTerm = xss(searchTerm);
    searchValue = xss(searchValue);
    if (!searchTerm || searchTerm.trim().length == 0) {
        res.status(404).render("errorPage/noSearch", {
            message: "Search bar should not be blank",
        });
        return "Error: Search term blank";
    } else {
        searchTerm = searchTerm.toLowerCase();
        //console.log(searchTerm);
        //console.log(searchValue);
        if (searchValue === "name" || searchValue === "Search product by") {
            try {
                let search_List = await productData.getProductByProductName(
                    searchTerm
                );
                //console.log(search_List);
                //return only the json
                console.log(search_List);
                res.status(200).render("searchPage/searchPage", {
                    title: "Search",
                    products: search_List,
                });
            } catch (e) {
                return res.status(404).render("errorPage/noSearch", {
                    title: "Error",
                });
            }
        }
        if (searchValue === "tag") {
            try {
                let search_List = await productData.getProductbyTag(searchTerm);
                //console.log(search_List);
                res.status(200).render("searchPage/searchPage", {
                    title: "Search",
                    products: search_List,
                });
            } catch (e) {
                return res
                    .status(404)
                    .render("errorPage/noSearch", { title: "Error" });
            }
        }
    }
});

router.get("/addProducterror", (req, res) => {
    const { addProductError } = req.session;
    const error = addProductError;
    req.session.addProductError = false;
    return res.status(200).json({
        error: addProductError,
    });
});

router.post(
    "/addProduct",
    authMiddleware,
    upload.single("photo"),
    async (req, res) => {
        if (!req.session.user) {
            res.status(401).redirect("/");
        } else {
            try {
                req.session.addProductError = false;
                usrId = req.session.user;
                let devDetails = await userData.getUser(usrId);
                let devId = devDetails._id;
                checkId(devId);
                let { productName, description, websiteUrl, tags, developer } =
                    req.body;
                productName = xss(productName);
                description = xss(description);
                websiteUrl = websiteUrl.toLowerCase().trim();
                websiteUrl = xss(websiteUrl);
                tags = xss(tags);
                developer = xss(developer);
                if (!req.file)
                    return res
                        .status(400)
                        .json({ error: "Please provide a file" });
                let photo = req.file.filename;
                photo = xss(photo);
                photo = photo.trim();

                if (req.file && !req.file.mimetype.includes("image")) {
                    return res
                        .status(400)
                        .json({ error: "Please upload an image" });
                }
                //Checking if input present in the first place
                if (
                    !productName ||
                    !description ||
                    !websiteUrl ||
                    !tags ||
                    !developer
                ) {
                    return res.status(400).json({
                        error: "Please provide all details of the product",
                    });
                }
                if (
                    productName.trim().length < 1 ||
                    description.trim().length < 1 ||
                    websiteUrl.trim().length < 1 ||
                    tags.trim().length < 1 ||
                    developer.trim().length < 1
                ) {
                    return res.status(400).json({
                        error: "Please provide ensure there are no blank details",
                    });
                }
                productName = productName.trim().toLowerCase();
                // String typecheck
                if (
                    typeof productName !== "string" ||
                    typeof description !== "string" ||
                    typeof websiteUrl !== "string" ||
                    typeof tags !== "string" ||
                    typeof developer !== "string"
                ) {
                    return res.status(400).json({
                        error: "Details provided are not of proper type string",
                    });
                }
                tags = tags.trim().toUpperCase();
                let tagsList = tags.split(",");
                tagsList = new Set(tagsList);
                tagsList = Array.from(tagsList);
                let re =
                    /^(http:\/\/|https:\/\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[‌​a-z]{2}\.([a-z]+)?$/gm;
                if (!re.test(websiteUrl)) {
                    return res.status(400).json({
                        error: "Website URL provided does not satisfy proper criteria (route)",
                    });
                }

                const newProduct = await productData.addProduct(
                    productName,
                    description,
                    websiteUrl,
                    photo,
                    tagsList,
                    developer,
                    devId
                );

                res.redirect("/");
            } catch (e) {
                console.log("error", e);
                req.session.addProductError = e;
                res.redirect("/");
                // res.redirect("/products/addProducterror");
                // return res.status(500).json({ message: e, errorMessage: e });
            }
        }
    }
);

router.get("/:id", async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: "You must provide product id" });
        return;
    }

    try {
        if (!ObjectId.isValid(req.params.id)) throw "id is not valid.";
        const product = await productData.getProductById(req.params.id);
        if (typeof product === "undefined") throw "Not found with that id";

        let prodLiked = false;
        let userLogged = false;
        if (req.session.user) {
            const user = await userData.getUser(req.session.user);
            prodLiked = await userData.checkLikedProduct(
                user._id.toString(),
                req.params.id
            );
            userLogged = true;
        }
        let usernow = "";
        if (req.session.user) {
            const user = await getUser(req.session.user);
            usernow = user._id;
        }

        const review = await reviews.getReviewbyProductId(req.params.id);
        const userlist = [];
        for (let i = 0; i < review.length; i++) {
            let userInfo = await reviews.getUserByReviewId(review[i]._id);
            userlist.push(userInfo);
        }
        let posts = [];
        let hasPost = false;
        for (let i = 0; i < review.length; i++) {
            let output = review[i];
            //output["username"] = userlist[i].firstName.concat(userlist[i].lastName);
            output["username"] = userlist[i].name;
            output["image"] = !_.isEmpty(userlist[i].img)
                ? `/public/images/upload/${userlist[i].img}`
                : "/public/images/guest-user.jpg";
            output["userId"] = userlist[i]._id;
            if (usernow.toString() == userlist[i]._id.toString()) {
                output["usernow"] = true;
            } else {
                output["usernow"] = false;
            }
            if (output) {
                posts.push(output);
            }
        }
        if (posts.length > 0) {
            hasPost = true;
        }
        res.render("products/product", {
            authenticated: req.session.user ? true : false,
            prodLiked: prodLiked,
            productName: product.productName,
            logo: product.logo,
            site: product.websiteUrl,
            tags: product.tags,
            developer: product.developer,
            rating: product.rating,
            likes: product.likes,
            description: product.description,
            userLogged: userLogged,
            posts: posts,
            hasPost: hasPost,
            productid: req.params.id,
            title: `${product.productName}`,
        });
        return;
    } catch (e) {
        console.log(e);
        res.render("errorPage/404");
    }
});

router.post("/updateLike", authMiddleware, async (req, res) => {
    if (!req.session.user) {
        res.redirect("users/signup");
        return;
    }

    try {
        let productId = req.body.productId;
        let liked = req.body.liked;
        liked = xss(liked);
        productId = xss(productId);
        let flag = false;
        if (liked === "true") flag = true;
        await productData.updateCount(productId, flag);
        const user = await userData.getUser(req.session.user);
        await userData.updateLikedProducts(user._id.toString(), productId);
    } catch (e) {
        res.redirect(`/products/${productId}`);
    }
});

router.post("/delete/:productId", authMiddleware, async (req, res) => {
    if (!req.session.user) {
        res.redirect("users/signup");
        return;
    }
    try {
        let { productId } = req.params;
        productId = xss(productId);
        productId = productId.trim();
        isValidObjectId(productId);
        let usr = await userData.getUser(req.session.user);
        let usrId = usr._id;
        checkId(usrId);
        const prodList = await productData.getProductById(productId);
        if (!prodList) {
            return res.status(404).json({
                error: "Product to be deleted was not found in our database",
            });
        }
        if (usrId.toString() !== prodList.devId.toString()) {
            return res
                .status(403)
                .json({ error: "User cannot delete this product" });
        }
        productId = productId.toString();
        const delProd = await productData.deleteProduct(productId);
        return res.status(200).json({ message: `${delProd} was deleted` });
    } catch (e) {
        return res.status(400).json({ error: `${e}` });
    }
});

router.get(
    "/:id/details",
    authMiddleware,
    upload.single("photo"),
    async (req, res) => {
        if (!req.params.id) {
            res.status(400).json({ error: "You must provide product id" });
            return;
        }

        try {
            if (!ObjectId.isValid(req.params.id)) throw "id is not valid.";
            const product = await productData.getProductById(req.params.id);
            if (typeof product === "undefined") throw "Not found with that id";

            let usernow = "";
            if (req.session.user) {
                const user = await getUser(req.session.user);
                usernow = user._id;
            }

            return res.json({
                name: product.productName,
                logo: product.logo,
                site: product.websiteUrl,
                tags: product.tags,
                developer: product.developer,
                description: product.description,
            });
        } catch (e) {
            console.log(e);
            res.render("errorPage/404");
        }
    }
);

router.post(
    "/update/:productId",
    authMiddleware,
    upload.single("photo"),
    async (req, res) => {
        try {
            let { productId } = req.params;

            productId = xss(productId);
            productId = productId.trim();
            isValidObjectId(productId);
            let usr = await userData.getUser(req.session.user);
            let usrId = usr._id;
            checkId(usrId.toString());
            let { productName, description, websiteUrl, tags, developer } =
                req.body;
            let product = await productData.getProductById(productId);

            if (!product) {
                return res.status(404).json({
                    error: "Product to be updated was not found in our database",
                });
            }
            if (usrId.toString() !== product.devId.toString()) {
                return res.status(403).json({
                    error: "User cannot update this product",
                });
            }
            productName = xss(productName);
            description = xss(description);
            websiteUrl = websiteUrl.toLowerCase().trim();
            websiteUrl = xss(websiteUrl);
            tags = xss(tags);
            developer = xss(developer);
            console.log("test", req.file?.filename || product.logo);
            let photo = req.file?.filename || product.logo;
            photo = xss(photo);
            photo = photo.trim();

            if (req.file && !req.file.mimetype.includes("image")) {
                return res
                    .status(400)
                    .json({ error: "Please upload an image" });
            }
            //Checking if input present in the first place
            if (
                !productName ||
                !description ||
                !websiteUrl ||
                !tags ||
                !developer
            ) {
                return res.status(400).json({
                    error: "Please provide all details of the product",
                });
            }
            if (
                productName.trim().length < 1 ||
                description.trim().length < 1 ||
                websiteUrl.trim().length < 1 ||
                tags.trim().length < 1 ||
                developer.trim().length < 1
            ) {
                return res.status(400).json({
                    error: "Please provide ensure there are no blank details",
                });
            }
            productName = productName.trim().toLowerCase();
            // String typecheck
            if (
                typeof productName !== "string" ||
                typeof description !== "string" ||
                typeof websiteUrl !== "string" ||
                typeof tags !== "string" ||
                typeof developer !== "string"
            ) {
                return res.status(400).json({
                    error: "Details provided are not of proper type string",
                });
            }
            tags = tags.trim().toUpperCase();
            let tagsList = tags.split(",");
            tagsList = new Set(tagsList);
            tagsList = Array.from(tagsList);
            let re =
                /^(http:\/\/|https:\/\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[‌​a-z]{2}\.([a-z]+)?$/gm;
            if (!re.test(websiteUrl)) {
                return res.status(400).json({
                    error: "Website URL provided does not satisfy proper criteria (route)",
                });
            }
            const updProd = productData.updateProduct(
                productId,
                productName,
                description,
                websiteUrl,
                photo,
                tagsList,
                developer
            );
            return res
                .status(200)
                .json({ message: "Details successfulyl updated!" });
        } catch (e) {
            console.log(e);
            return res.status(400).json({ error: `${e}` });
        }
    }
);
module.exports = router;
