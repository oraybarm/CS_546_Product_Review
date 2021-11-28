const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
var pjax = require("express-pjax");
const constructorMethod = require("./routeConstructor");
require("dotenv").config();

const handlebarsInstance = exphbs.create({
    defaultLayout: "main",
    // Specify helpers which are only registered on this instance.
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === "number")
                return new Handlebars.SafeString(
                    JSON.stringify(obj, null, spacing)
                );

            return new Handlebars.SafeString(JSON.stringify(obj));
        },
    },
    partialsDir: ["views/partials/"],
});
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(pjax());
app.use(
    session({
        name: "AuthCookie",
        secret: "some secret string!",
        resave: false,
        saveUninitialized: false,
    })
);

const static = express.static(__dirname + "/public");
app.use("/public", static);
app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

app.use("/", (req, res, next) => {
    console.log(
        "Req URL",
        req.url,
        "Auth Status :",
        req.session.user ? "User is authenticated" : "User is not authenticated"
    );
    next();
});
constructorMethod(app);

const PORT = process.env.BACKENDPORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
