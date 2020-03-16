var express = require("express");

var hbs = require("hbs")

var bodyParser = require('body-parser');

var mongodb = require("mongodb");

var session = require('express-session')
var multiparty = require("multiparty")

var app = express();

app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static('public'))

app.use(session({
    secret: "secret-blog",

}));
var errorObj = {}
var url = 'mongodb://127.0.0.1:27017'
var dbName = 'blog';
var DB = "";

mongodb.MongoClient.connect(url, function (err, client) {
    if (err)
        console.log("server is not connected")
    else
        console.log("server is succesfully connected")
    DB = client.db(dbName);
})
//------------------------------------------------root url-----------------------------------------------------------//
app.get('/', function (req, res) {
    if (req.session.user)
        res.redirect('/home')
    else
        res.redirect('/login')
})
//--------------------------------------------------SIGN_UP-------------------------------------------------------------------------//
app.get('/signup', function (req, res) {
    res.render("signup", { emailexist: req.query.emailexist })
    
});

app.post('/signupsave', function (req, res) {
    var user = {
        name: req.body.fullname,
        email: req.body.email,
        password: req.body.password
    }
    DB.collection("users").findOne({ email: user.email }, function (err, result) {
        console.log('res', result)
        if (result == null) {
            DB.collection('users').insertOne(user, function (err, result) {
                res.redirect('/login')
            })
        }
        else {
            res.redirect("/signup?emailexist=true")
        }

    })
})
//--------------------------------------------------------LOGIN---------------------------------------------------------------------//
app.get('/login', function (req, res) {
    res.render('login.hbs', {
        errorObj: errorObj.pwderror
    })
    errorObj.pwderror = 0
})

app.post('/validateUser', function (req, res) {
    var email = req.body.email
    var password = req.body.password
    DB.collection('users').findOne({ email: email }, function (err, user) {
        console.log('result', user)
        if (user.password !== password) {
            errorObj.pwderror = "password incorrect"
            res.redirect('/login');
        }
        else {
            req.session.user = user
            res.redirect('/home')
        }

    })
})
//--------------------------------------------------------------HOMEPAGE-----------------------------------------------------------------------//
app.get('/home', function (req, res) {
    console.log("session", req.session.user)
    if (req.session.user) {
        DB.collection('posts').find({}).toArray(function (err, posts) {
            console.log("p1", posts)
            res.render("home.hbs", {
                posts: posts,
                username: req.session.user
            })
        })
    }
    else
        res.redirect('/login')
})
//------------------------------------------------------------CREATE POST----------------------------------------------------------------------//
app.get('/create', function (req, res) {
    res.render("create.hbs", {
        postCreated: req.query.postCreated
    })
})

app.post('/create', function (req, res) {
    if (!req.session.user)
        res.redirect('/login')
    else {
        var form = new multiparty.Form({ uploadDir: 'public' });
        form.parse(req, function (err, fields, files) {
            console.log(err, fields, files)
            var post = {
                title: fields.title[0],
                description: fields.description[0],
                url: files.pic[0].path.split('\\')[1],
                user_id: req.session.user._id,
                user_name: req.session.user.name
            }
            DB.collection('posts').insertOne(post, function (err, result) {
                console.log('result', result)
                res.redirect('/create?postCreated=true')
            })
        })
    }
})
//-------------------------------------------------------------view---------------------------------------------------------------------------//
app.get('/view', (req, res) => {
    if (req.session.user) {
        DB.collection("posts").find({ user_id: req.session.user._id }).toArray(function (err, posts) {
            console.log("p2", posts)
            res.render("view", { posts: posts })
        })
    }
    else
        res.redirect('/login');
})
//--------------------------------------------------------------update---------------------------------------------------------------------------//
app.get('/edit/:id', function (req, res) {
    if (!req.session.user)
        res.redirect("/login")
    else {
        DB.collection("posts").findOne({ _id: mongodb.ObjectID(req.params.id) }, function (err, result) {
            res.render("edit", { data: result })
        })
    }

})

app.post('/update', function (req, res) {
    if (!req.session.user)
        res.redirect('/home')
    else {
        var postId = req.body.id;
        var data = {
            title: req.body.title,
            description: req.body.description
        };
        DB.collection("posts").update({ _id: mongodb.ObjectId(postId) }, { $set: data }, function (err, result) {
            console.log("result: ", result);
            res.redirect("/home");
        });
    }

})
//---------------------------------------------------------------------delete--------------------------------------------------------------//
app.delete('/delete', function (req, res) {
    var userId = req.body.items.map(function (item) {
        return item = mongodb.ObjectID(item)
    })
    DB.collection("posts").deleteMany({ _id: { $in: userId } }, (err, result) => {
        console.log("delete data", result)
        res.send("data deleted")
    })
})
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/')
})



app.listen(3000);