const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;
let server;

connectDB().then(() => {
    server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

});

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
  });