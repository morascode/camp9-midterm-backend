"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateBody = void 0;
const validateBody = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (err) {
        return res.status(422).send(err);
    }
};
exports.validateBody = validateBody;
const validateParams = (schema) => (req, res, next) => {
    try {
        schema.parse(parseInt(req.params.id));
        next();
    }
    catch (err) {
        return res.status(422).send(err);
    }
};
exports.validateParams = validateParams;
