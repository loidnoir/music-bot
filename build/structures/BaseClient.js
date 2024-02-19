"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ClientOptions_1 = tslib_1.__importDefault(require("@constants/ClientOptions"));
const ClientSecrets_1 = tslib_1.__importDefault(require("@constants/ClientSecrets"));
const client_1 = require("@prisma/client");
const discord_js_1 = require("discord.js");
const glob_1 = tslib_1.__importDefault(require("glob"));
const util_1 = require("util");
const discord_player_1 = require("discord-player");
const discord_player_deezer_1 = tslib_1.__importDefault(require("discord-player-deezer"));
class BaseClient extends discord_js_1.Client {
    player;
    commands = new discord_js_1.Collection();
    cooldown = new discord_js_1.Collection();
    events = new discord_js_1.Collection();
    prisma = new client_1.PrismaClient();
    constructor() {
        super(ClientOptions_1.default);
    }
    async start() {
        await this.prisma.$connect();
        await this.loadEvents(`${__dirname}/../events/**/**/*{.js,.ts}`);
        await this.loadPlayer();
        await this.login(ClientSecrets_1.default.token);
        this.handleErrors();
    }
    async loadPlayer() {
        this.player = new discord_player_1.Player(this);
        this.player.extractors.loadDefault();
        this.player.extractors.register(discord_player_deezer_1.default, {});
        this.player.events.on('playerStart', (queue, track) => {
            queue.metadata.channel?.send(`Started playing **${track.title}**!`);
        });
    }
    async loadEvents(path) {
        const globPromisify = (0, util_1.promisify)(glob_1.default);
        const eventFiles = await globPromisify(path);
        eventFiles.forEach(async (eventFile) => {
            try {
                const file = await Promise.resolve(`${eventFile}`).then(s => tslib_1.__importStar(require(s)));
                const event = new (file).default(this);
                if (!event.run)
                    return;
                this.events.set(event.data.name, event);
                if (event.data.once) {
                    this.once(event.data.name, (...args) => event.run(this, ...args));
                }
                else {
                    this.on(event.data.name, (...args) => event.run(this, ...args));
                }
            }
            catch (err) {
                return;
            }
        });
    }
    handleErrors() {
        process.on('uncaughtException', (error) => {
            console.log('Uncaught exception\n', error);
        });
        process.on('unhandledRejection', (error) => {
            console.log('Unhandled rejection\n', error);
        });
    }
}
exports.default = BaseClient;
//# sourceMappingURL=BaseClient.js.map