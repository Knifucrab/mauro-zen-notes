"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../dist/services/AuthService");
const authService = new AuthService_1.AuthService();
class AuthController {
    static async login(req, res) {
        try {
            const { username, password } = req.body;
            const result = await authService.login(username, password);
            res.json(result);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
    static async register(req, res) {
        try {
            const { username, password } = req.body;
            const result = await authService.register(username, password);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async setupDefaultUser(req, res) {
        try {
            const result = await authService.setupDefaultUser();
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
