"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function CommandInteraction(client, interaction) {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command)
            return;
        try {
            if (command.settings.cooldown && command.settings.cooldown > 0) {
                const id = `${interaction.command?.id}-${interaction.user.id}`;
                const cooldown = client.cooldown.get(id);
                if (cooldown) {
                    if (cooldown && cooldown > Date.now()) {
                        return interaction.reply({ content: `You are on cooldown. Please wait ${Math.ceil((cooldown - Date.now()) / 1000)} seconds.`, ephemeral: true });
                    }
                }
                if (!cooldown) {
                    client.cooldown.set(id, Date.now() + command.settings.cooldown * 1000);
                }
            }
            command.run(client, interaction);
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.default = CommandInteraction;
//# sourceMappingURL=CommandInteraction.js.map