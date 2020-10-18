const express = require('express');
const bodyParser = require('body-parser');
const routerUser = require('./controllers/productController');
const cors = require('cors');
const app = express();
const port = 3000;

const corsOption = {
    origin: true,
    credential: true
}

app.use(cors(corsOption));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

routerUser.assignRouterUser(app);

app.listen(port, () => {
    console.log(`Server On : ${port}`);
});