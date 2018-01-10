module.exports.index = function (req, res) {
  res.send(`
    <html>
      <head>
        <meta charset="UTF-8">
	    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	    <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Яндекс: Переговорки</title>
        <script src="/scripts/test.js"></script>
      </head>
      <body class="app">
        <h1>Hello</h1>
	    <div class="app__wrapper" id="app"></div>
      </body>
    </html>
    `);
};