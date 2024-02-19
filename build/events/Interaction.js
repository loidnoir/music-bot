"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CommandInteraction_1 = tslib_1.__importDefault(require("@helpers/CommandInteraction"));
const BaseEvent_1 = tslib_1.__importDefault(require("@structures/BaseEvent"));
class Interaction extends BaseEvent_1.default {
    data = {
        name: 'interactionCreate',
        once: false
    };
    async run(client, interaction) {
        (0, CommandInteraction_1.default)(client, interaction);
    }
}
exports.default = Interaction;
//# sourceMappingURL=Interaction.js.map