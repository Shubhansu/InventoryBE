const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const _ = require('lodash');
const tokenValidator =  require('./helper').tokenValidator;
const apiResponse = require('./utils').apiResponse;

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const envConfig = require('./config').envConfig;

const routes = require('./routes');
const app = express();
const authRouter = express.Router();
app.disable('x-powered-by');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(cors());

authRouter.post('/login', routes.login);
authRouter.post('/signUp', routes.signUp);
authRouter.get('/getProducts', tokenValidator, routes.getProducts);
authRouter.get('/getProductById', tokenValidator, routes.getProductById);
authRouter.post('/addProduct', tokenValidator, routes.addProduct);
app.use('/inv', authRouter);
// Api to be used for health check.
app.get('/', async (req, res) => {
    res.status(200).send(`Inventory Server is up...`);
});

app.get('*', async (req, res) => {
    res.status(404).send(apiResponse.error('Service not found.'));
});

module.exports = app;
