"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const BaseEvent_1 = tslib_1.__importDefault(require("@structures/BaseEvent"));
const glob_1 = tslib_1.__importDefault(require("glob"));
const util_1 = require("util");
class Ready extends BaseEvent_1.default {
    data = {
        name: 'ready',
        once: true
    };
    async run(client) {
        await this.loadCommands(client, `${__dirname}/../commands/**/**/*{.js,.ts}`);
        console.info('Bot is ready');
    }
    async loadCommands(client, path) {
        const globPromise = (0, util_1.promisify)(glob_1.default);
        const commandsFiles = await globPromise(path);
        commandsFiles.forEach(async (commandFile) => {
            try {
                const file = await Promise.resolve(`${commandFile}`).then(s => tslib_1.__importStar(require(s)));
                const command = new file.default(client);
                if (!command.run)
                    return;
                client.application?.commands.create(command.data);
                client.commands.set(command.data.name, command);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = Ready;
//# sourceMappingURL=Ready.js.map