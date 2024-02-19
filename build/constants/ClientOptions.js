"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ClientOptions = {
    intents: [
        'DirectMessages',
        'GuildMembers',
        'Guilds',
        'GuildMessageReactions',
        'GuildMessages',
        'GuildPresences',
        'GuildVoiceStates',
        'GuildWebhooks',
        'MessageContent'
    ],
    partials: [
        discord_js_1.Partials.Channel,
        discord_js_1.Partials.GuildMember,
        discord_js_1.Partials.Message,
        discord_js_1.Partials.User,
        discord_js_1.Partials.Reaction
    ],
    presence: {
        activities: [
            {
                name: '12 threat ni** like he 12',
                type: discord_js_1.ActivityType.Listening
            }
        ]
    }
};
exports.default = ClientOptions;
//# sourceMappingURL=ClientOptions.js.map