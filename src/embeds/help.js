const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  GatewayIntentBits,
} = require("discord.js");

// Criar cliente do Discord com as intents necessárias
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Função para enviar a embed de apoiador
async function sendHelpEmbed() {
  try {
    // Obter o canal do ID definido no .env
    const channel = await client.channels.fetch(process.env.HELP_CHANNEL_ID);

    if (!channel) {
      console.error("Canal não encontrado");
      return;
    }

    // Obter a guild (servidor) a partir do canal
    const guild = channel.guild;
    const guildName = guild.name;
    const guildIconURL = guild.iconURL({ dynamic: true }) || null;

    // Criar a embed
    const embed = new EmbedBuilder()
      .setTitle("Apoie o Servidor")
      .setDescription(
        "O **Servidor dos Programadores** é uma **iniciativa independente e sem fins lucrativos**, feita por __***devs***__ para __***devs***__. \n\nSe você curte o servidor, considera ele útil ou simplesmente quer ver essa comunidade crescer ainda mais, **considere apoiar com uma doação via Pix**.\n\nCom a sua ajuda, conseguimos:\n\n- Manter o servidor e bots funcionando 24 horas por dia.\n- Criar eventos, desafios, sorteios e premiações.\n- Investir em melhorias, conteúdos e ferramentas para todos.\n\nPara fazer uma doação escaneie o QR Code ou acesse [esse link](https://livepix.gg/audibert)!\n\n-# Doações acima de R$5 recebem o cargo especial <@&1381652802908065812>.\n-# Após fazer uma doação consulte algum membro da <@&1382436765410791565>."
      )
      .setImage(
        "https://cdn.discordapp.com/attachments/1366961734908117044/1382477803332698153/image.png?ex=684b4c49&is=6849fac9&hm=16fb0a9467603dfa3567ea16efbe66efcedd783f9a008956ffdfdda7647698b0&"
      )
      .setColor(0x71ff9e)
      .setFooter({ text: guildName, iconURL: guildIconURL });

    await channel.send({
      embeds: [embed],
    });

    console.log("Embed de Apoiador enviada com sucesso!");

    client.destroy();
  } catch (error) {
    console.error("Erro ao enviar embed de Apoiador:", error);
    client.destroy();
  }
}

// Login e envio da embed quando o cliente estiver pronto
client.once("ready", async () => {
  console.log(`Bot conectado como ${client.user.tag}`);
  await sendHelpEmbed();
});

// Login com o token do bot
client
  .login(process.env.BOT_TOKEN)
  .then(() => console.log("Conectando para enviar embed de Apoiador..."))
  .catch((error) => {
    console.error("Erro ao fazer login:", error);
    process.exit(1);
  });

// Para executar este arquivo diretamente
if (require.main === module) {
  console.log("Iniciando envio da embed de Apoiador...");
}
