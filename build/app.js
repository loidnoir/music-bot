"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const BaseClient_1 = tslib_1.__importDefault(require("@structures/BaseClient"));
async function start() {
    const client = new BaseClient_1.default();
    await client.start();
}
start();
//# sourceMappingURL=app.js.map