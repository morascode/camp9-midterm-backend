"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const movies_routes_1 = __importDefault(require("./routes/movies.routes"));
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
app.use(express_1.default.json({ limit: '1mb' }));
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use('/api/1.0/user', user_routes_1.default);
app.use('/api/1.0/booking', booking_routes_1.default);
app.use('/api/1.0/movies', movies_routes_1.default);
app.get('/', (req, res) => {
    res
        .status(200)
        .send('<p>This is the server for CineScape.</p><p><a href="https://camp9-midterm-frontend.vercel.app">Visit CineScape</a></p>');
});
app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});
exports.default = app;
