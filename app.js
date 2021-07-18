const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const api = require('./routes');
const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors({ origin: process.env.FRONTEND_URL, credentials :  true}));
server.use(morgan('combined'));
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use((req, res, next)  => {
    // set default or minimum is 10 (as it was prior to v0.2.0)
    if (req.query.limit <= 10) req.query.limit = 10;
    next();
});

server.use('/api', api);

const PORT = process.env.PORT || 3300;
server.listen(PORT, () => console.log(`Server is live at http://localhost:${PORT}`));