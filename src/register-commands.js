require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const commands = [
  {
    name: "start-custom",
    description: "start a custom game",
    dm_permission: false,
    options: [
      {
        name: "team1-leader",
        description: "Team 1 Leader",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "team2-leader",
        description: "Team 2 Leader",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
  },
  {
    name: "random-map",
    description: "Choosed a random map",
    dm_permission: false,
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN2);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT2_ID,
        process.env.GUILD2_ID
      ),
      {
        body: commands,
      }
    );
    console.log("Successfully reloaded application (/) commands.");
  } catch (err) {
    console.log(err);
  }
})();
