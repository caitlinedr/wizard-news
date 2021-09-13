const express = require("express");
const morgan = require("morgan")
const postBank = require("./postBank")
const timeAgo = require("node-time-ago")
const html = require("html-template-tag")

const app = express();
app.use(morgan('dev'));
app.use(express.static('public'))

app.get("/", (req, res) => {
  const posts = postBank.list()
  const pageHtml = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(post => html`
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
            <a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${timeAgo(post.date)}
          </small>
        </div>`
      ).join('')}
    </div>
  </body>
</html>`;
    res.send(pageHtml)
});

app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);

  if (!post.id) {
    res.status(404)
    const pageHtml = html`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header><img src="/logo.png"/>Wizard News</header>
      <div class="not-found">
        <p>Accio Page! 🧙‍♀️ ... Page Not Found</p>
      </div>
    </body>
    </html>`
    res.send(pageHtml)
  } else {
    const pageHtml = html`<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      <p>
        ${post.title}
        <small>(by ${post.name})</small>
      </p>
      <p>
        ${post.content}
      </p>
  </body>
</html>`;

  res.send(pageHtml);
  }
});

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
