const {
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on("ready", (c) => {
  console.log(`Logged in as ${c.user.tag}!`);
});

client.on("messageCreate", (m) => {
  if (m.author.bot) return;
  if (m.content.includes("valo customs 9olo ")) {
    m.reply(m.content.split("valo customs 9olo ")[1]);
  }
});

client.on("interactionCreate", async (i) => {
  if (!i.isChatInputCommand()) return;

  if (i.commandName === "start-custom") {
    const map_choices = [
      {
        name: "Accent",
      },
      {
        name: "Breeze",
      },
    ];

    const player_choices = i.guild.channels.cache
      .find((channel) => channel.name === "Talk")
      .members.map((member) =>
        i.guild.members.cache.find((m) => m.id === member.id)
      );

    const team1Leader = i.guild.members.cache.find(
      (member) =>
        member.user.username === i.options.getUser("team1-leader").username
    );
    const team2Leader = i.guild.members.cache.find(
      (member) =>
        member.user.username === i.options.getUser("team2-leader").username
    );

    if (team1Leader.id === team2Leader.id) {
      i.reply({ content: "You can't play with yourself", ephemeral: true });
      return;
    }
    if (team2Leader.bot || team1Leader.bot) {
      i.reply({ content: "You can't play with a bot", ephemeral: true });
      return;
    }

    team1Leader.voice.setChannel(
      i.guild.channels.cache.find((channel) => channel.name === "team1").id
    );
    // team2Leader.voice.setChannel(
    //   i.guild.channels.cache.find((channel) => channel.name === "team2").id
    // );

    const embed = new EmbedBuilder()
      .setTitle("Custom Game")
      .setDescription("Choose Your team members")
      .setColor("Random")
      .setTimestamp(new Date());
    const players = player_choices.map((player) => {
      return new ButtonBuilder()
        .setCustomId(player.user.username)
        .setLabel(player.user.username)
        .setStyle("Primary");
    });
    const row = new ActionRowBuilder().addComponents(players);
    const reply = await i.reply({
      content: `**${team1Leader}** has started a custom game. It's ${team1Leader} turn to select a team member.`,
      embeds: [embed],
      components: [row],
    });

    const collector = await reply
      .awaitMessageComponent({
        filter: (i) => i.user.id === team1Leader.id,
        time: 30000,
      })
      .catch(async () => {
        embed.setDescription(`Timed out. ${team1Leader.id} didn't choose.`);
        await reply.edit({ embeds: [embed], components: [] });
      });

    if (!collector) return;

    const chosen_player = player_choices.find(
      (player) => player.name === i.customId
    );
    chosen_player.voice.setChannel(
      i.guild.channels.cache.find((channel) => channel.name === "Talk").id
    );

    // const embed = new EmbedBuilder()
    //   .setTitle("Custom Game")
    //   .setDescription("Choose Your map")
    //   .setColor("Random")
    //   .setTimestamp(new Date());
    // const buttons = choices.map((choice) => {
    //   return new ButtonBuilder()
    //     .setCustomId(choice.name)
    //     .setLabel(choice.name)
    //     .setStyle("Primary");
    // });
    // const maps_buttons = choices.map((choice) => {
    //   return new ButtonBuilder()
    //     .setCustomId(choice.name)
    //     .setLabel(choice.name)
    //     .setStyle("Primary");
    // });
  }
});

client.login(process.env.TOKEN);
