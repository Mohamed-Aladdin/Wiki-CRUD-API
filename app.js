const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI);

const articleSchema = {
  title: String,
  content : String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
  .get((req, res) => {
    Article.find().then((articleList) => {
      if(articleList.length === 0) {
        res.send("There're no articles to be displayed currently.");
      } else {
        res.send(articleList);
      }
    }).catch((err) => {
      res.send(err);
    })
  })

  .post((req, res) => {
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });
    article.save().then(()=> {
      res.send("Successfully added a new article.");
    }).catch((err) => {
      res.send(err);
    });
  })

  .delete((req, res) => {
    Article.deleteMany().then(() => {
      res.send("Successfully deleted all articles.");
    }).catch((err) => {
      res.send(err);
    });
  });

app.route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({title: req.params.articleTitle}).then((foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles found matching the current selection!");
      }
    }).catch((err) => {
      res.send(err);
    })
  })

  .put((req, res) => {
    Article.update(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true}
    ).then(() => {
      res.send("Successfully updated the article.")
    }).catch((err) => {
      res.send(err);
    });
  })

  .patch((req, res) => {
    Article.update(
      {title: req.params.articleTitle},
      {$set: req.body} 
    ).then(() => {
      res.send("Successfully updated the article.");
    }).catch((err) => {
      res.send(err);
    });
  })

  .delete((req, res) => {
    Article.deleteOne({title: req.params.articleTitle}).then(() => {
      res.send("Successfully deleted the article.");
    }).catch((err) => {
      res.send(err);
    });
  });

  const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started on port 3000.")
});