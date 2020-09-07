const app = require('./src/app');
const PORT= process.env.PORT || 8088;
app.listen( PORT, () => { 
    console.log( `Inventory Server started at port ${PORT}` );
});
