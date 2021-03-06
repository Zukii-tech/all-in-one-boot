const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class SetModRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmodrole',
      aliases: ['setmr', 'smr'],
      usage: '<ROLE MENTION | ROLE NAME>',
      description: 'Sets the mod role for your server (provide no role to clear).',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message, args) {
    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.guildSettings.updateModRoleId.run(null, message.guild.id);
      return message.channel.send('Successfully **cleared** the `mod role`.');
    } 
    const roleName = args.join(' ').toLowerCase();
    let role = message.guild.roles.find(r => r.name.toLowerCase() === roleName);
    role = this.getRoleFromMention(message, args[0]) || role;
    if (!role) return message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that. Please mention a role or provide a role name.
    `);
    message.client.db.guildSettings.updateModRoleId.run(role.id, message.guild.id);
    message.channel.send(`Successfully updated the \`mod role\` to ${role}.`);
  }
};
