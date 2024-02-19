"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ChatCommand_1 = tslib_1.__importDefault(require("@structures/ChatCommand"));
const discord_player_1 = require("discord-player");
const discord_js_1 = require("discord.js");
class Play extends ChatCommand_1.default {
    data = {
        name: 'play',
        description: 'play a song',
        dmPermission: false,
        options: [
            {
                name: 'song',
                type: discord_js_1.ApplicationCommandOptionType.String,
                description: 'Song name or URL',
                required: true
            }
        ]
    };
    settings = {
        category: 'music',
        cooldown: 1
    };
    async run(client, interaction) {
        if (!interaction.guildId)
            return;
        const player = (0, discord_player_1.useMainPlayer)();
        const channel = interaction.member.voice.channel;
        if (!channel || !player) {
            interaction.reply('You need to be in a voice channel to use play command');
            return;
        }
        const query = interaction.options.getString('song', true);
        await interaction.deferReply();
        try {
            await player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction
                }
            });
            await interaction.followUp(`Playing **${query}**`);
        }
        catch (error) {
            await interaction.followUp('There was an error playing the song');
            console.log(error);
        }
    }
}
exports.default = Play;
//# sourceMappingURL=Play.js.map