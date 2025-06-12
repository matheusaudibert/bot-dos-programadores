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

// Função para enviar as embeds de cargos
async function sendRolesEmbeds() {
  try {
    // Obter o canal do ID definido no .env
    const channel = await client.channels.fetch(process.env.ROLES_CHANNEL_ID);

    if (!channel) {
      console.error("Canal não encontrado");
      return;
    }

    // Criar a primeira embed - Cargos por Experiência
    const experienceEmbed = new EmbedBuilder()
      .setTitle("Cargos por Experiência")
      .setDescription(
        "O servidor possui um **sistema de cargos por XP**, via <@297153970613387264>.\nCada nível específico atingido libera um **cargo extra** que te **destaca** no servidor.\nPara ganhar **XP** você deve **interagir nos chats** do servidor.\n\nPara verificar o seu nível, digite ***+xp***.\nPara verificar o rank do servidor, digite ***+rank***.\n-# Todos os comandos devem ser executados no canal ⁠<#1224155518604542182>.\n\n**Nível 3** *(3k xp)* - <@&1363936413271331118>\n**Nível 5** *(5k xp)* - <@&1382161343725047971> \n**Nível 10** *(10k xp)* - <@&1381776837599952976> \n**Nível 15** *(15k xp)* - <@&1381729961311735920>\n**Nível 20** *(20k xp)* - <@&1381652936626798717>\n\n-# Após liberar o cargo <@&1363936413271331118>, você irá receber **2x mais XP**."
      )
      .setColor(0x738ad8);

    // Criar a segunda embed - Cargos Especiais
    const specialEmbed = new EmbedBuilder()
      .setTitle("Cargos Especiais")
      .setDescription(
        "Além dos cargos por **XP**, o servidor conta com** cargos especiais**.\n\n<@&1363939241486319788>\nRecebido após comprovar que você é um criador de conteúdo.\n-# Para mais informações consulte algum membro da <@&1382436765410791565>.\n\n<@&1115446339661221980>\nRecebido após impulsionar o servidor.\n-# Para mais informações acesse <#1363964628639551498>.\n\n<@&1381652802908065812>\nRecebido após apoiar o servidor.\n-# Para mais informações acesse <#1382450201301745824>.\n\n-# Após liberar um cargo especial, você também irá receber **2x mais XP**."
      )
      .setColor(0x738ad8);

    await channel.send({
      embeds: [experienceEmbed, specialEmbed],
    });

    console.log("Embeds de Cargos enviadas com sucesso!");

    client.destroy();
  } catch (error) {
    console.error("Erro ao enviar embeds de Cargos:", error);
    client.destroy();
  }
}

// Login e envio das embeds quando o cliente estiver pronto
client.once("ready", async () => {
  console.log(`Bot conectado como ${client.user.tag}`);
  await sendRolesEmbeds();
});

// Login com o token do bot
client
  .login(process.env.BOT_TOKEN)
  .then(() => console.log("Conectando para enviar embeds de Cargos..."))
  .catch((error) => {
    console.error("Erro ao fazer login:", error);
    process.exit(1);
  });

// Para executar este arquivo diretamente
if (require.main === module) {
  console.log("Iniciando envio das embeds de Cargos...");
}
