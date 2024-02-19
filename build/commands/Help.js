"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ChatCommand_1 = tslib_1.__importDefault(require("@structures/ChatCommand"));
class Help extends ChatCommand_1.default {
    data = {
        name: 'help',
        description: 'Get help message',
        defaultMemberPermissions: 'SendMessages',
        dmPermission: true,
    };
    settings = {
        category: 'utility',
        cooldown: 0
    };
    run(client, interaction) {
        interaction.reply('## Ինչ ասեմ ախպեր\n- Եմբեդ համարյա չկա\n- Սարքածա սիրով\n- Արփիներին մուտք չկա\n- Բագ տնողը վատ մարդա, Ալեն');
    }
}
exports.default = Help;
//# sourceMappingURL=Help.js.map