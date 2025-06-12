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

// Função para enviar a embed com os botões
async function sendRulesEmbed() {
  try {
    // Obter o canal do ID definido no .env
    const channel = await client.channels.fetch(process.env.RULES_CHANNEL_ID);

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
      .setTitle("Regras do Servidor")
      .setDescription(
        "Este servidor é um espaço **seguro e acolhedor** para pessoas interessadas em **programação**, **tecnologia** e **aprendizado colaborativo**. Para manter a ordem e o respeito entre todos os membros, siga atentamente as regras abaixo:\n\n" +
          "- **Respeite todos os membros**\n" +
          "Não serão tolerados **insultos**, **ataques pessoais**, **assédio**, **discriminação**, **bullying** ou **qualquer forma de discurso de ódio** (racismo, machismo, homofobia, xenofobia, etc.).\n" +
          "Trate todas as pessoas com **educação**, mesmo quando discordar.\n" +
          "Brincadeiras são bem-vindas, **mas saiba a hora de parar e respeite os limites dos outros**.\n\n" +
          "- **Mantenha os canais limpos e organizados**\n" +
          "Cada canal tem uma finalidade. **Respeitar isso ajuda todo mundo**.\n" +
          "Poste dúvidas nos **canais de ajuda**, assuntos no **chat geral** e memes no **canal apropriado**.\n\n" +
          "- **Proibido conteúdo ilegal ou impróprio**\n" +
          "Respeite os _[Termos de Serviço](https://discord.com/terms)_ e as _[Diretrizes da Comunidade](https://discord.com/guidelines)_ do Discord. Não compartilhe **conteúdos NSFW** (pornografia, nudez, violência gráfica, etc.). Pirataria, cracks, cheats, engenharia reversa ilegal e afins são **terminantemente proibidos**. Conteúdo sensível (política, religião, etc.) deve ser evitado — **esse não é o foco aqui**.\n\n" +
          "-# O descumprimento dessas regras poderá resultar em advertência, mute ou banimento, conforme a gravidade do caso."
      )
      .setImage("https://pbs.twimg.com/media/FXE6VKBVUAAt_I4.jpg")
      .setColor(0x0c1aae)
      .setFooter({ text: guildName, iconURL: guildIconURL });

    await channel.send({
      embeds: [embed],
    });

    console.log("Embed de Regras enviada com sucesso!");

    client.destroy();
  } catch (error) {
    console.error("Erro ao enviar embed de Regras:", error);
    client.destroy();
  }
}

// Login e envio da embed quando o cliente estiver pronto
client.once("ready", async () => {
  console.log(`Bot conectado como ${client.user.tag}`);
  await sendRulesEmbed();
});

// Login com o token do bot
client
  .login(process.env.BOT_TOKEN)
  .then(() => console.log("Conectando para enviar embed de Regras..."))
  .catch((error) => {
    console.error("Erro ao fazer login:", error);
    process.exit(1);
  });

// Para executar este arquivo diretamente
if (require.main === module) {
  console.log("Iniciando envio da embed de Regras...");
}
