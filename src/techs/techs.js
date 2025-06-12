const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { setRole } = require("./setRole");
const { removeRole } = require("./removeRole");
require("dotenv").config();

const TECHS = [
  {
    name: "JavaScript",
    emoji: "<:JavaScript:1381370650903445544>",
    roleId: process.env.JAVASCRIPT_ROLE_ID,
  },
  {
    name: "TypeScript",
    emoji: "<:TypeScript:1381370724568141854>",
    roleId: process.env.TYPESCRIPT_ROLE_ID,
  },
  {
    name: "HTML",
    emoji: "<:HTML:1381370851068481647>",
    roleId: process.env.HTML_ROLE_ID,
  },
  {
    name: "CSS",
    emoji: "<:CSS:1381370901618233344>",
    roleId: process.env.CSS_ROLE_ID,
  },

  {
    name: "Python",
    emoji: "<:Python:1381370968374771782>",
    roleId: process.env.PYTHON_ROLE_ID,
  },
  {
    name: "PHP",
    emoji: "<:PHP:1381371029078933564>",
    roleId: process.env.PHP_ROLE_ID,
  },
  {
    name: "Java",
    emoji: "<:Java:1381371080526004355>",
    roleId: process.env.JAVA_ROLE_ID,
  },
  {
    name: "C++",
    emoji: "<:CPP:1381371126470676520>",
    roleId: process.env.CPP_ROLE_ID,
  },
  {
    name: "C",
    emoji: "<:C_:1381371177045327892>",
    roleId: process.env.C_ROLE_ID,
  },
  {
    name: "C#",
    emoji: "<:CSharp:1381371194816856104>",
    roleId: process.env.CSHARP_ROLE_ID,
  },
  {
    name: "Go",
    emoji: "<:Go:1381371321950146590>",
    roleId: process.env.GO_ROLE_ID,
  },
  {
    name: "Kotlin",
    emoji: "<:Kotlin:1381371358054715555>",
    roleId: process.env.KOTLIN_ROLE_ID,
  },
  {
    name: "Swift",
    emoji: "<:Swift:1381371449373098094>",
    roleId: process.env.SWIFT_ROLE_ID,
  },
  {
    name: "Rust",
    emoji: "<:Rust:1381371519707517009>",
    roleId: process.env.RUST_ROLE_ID,
  },
  {
    name: "Discord",
    emoji: "<:Discord:1381371570441814136>",
    roleId: process.env.DISCORD_ROLE_ID,
  },
];

// Função para criar o embed de tecnologias
function createTechsEmbed() {
  const embed = new EmbedBuilder()
    .setTitle("Painel de Tecnologias")
    .setDescription(
      "**Selecione abaixo as tecnologias com as quais você se identifica.**\n\n" +
        "Cada botão **adiciona** ou **remove** um cargo correspondente à tecnologia escolhida.\n" +
        "Os cargos aparecem no seu perfil e destacam suas preferências dentro do servidor.\n" +
        "-# Use os botões para atualizar sua seleção quando quiser.\n"
    )

    .setColor(0x738ad8);

  return embed;
}

function createTechButtons() {
  const rows = [];

  const numRows = Math.ceil(TECHS.length / 5);

  for (let i = 0; i < numRows; i++) {
    const row = new ActionRowBuilder();

    const startIndex = i * 5;
    const techsForRow = TECHS.slice(startIndex, startIndex + 5);

    techsForRow.forEach((tech) => {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`tech_${tech.name.toLowerCase().replace(/[\s,.]/g, "")}`) // Remove espaços, vírgulas e pontos
          .setLabel(tech.name)
          .setEmoji(tech.emoji.replace(/[<>]/g, ""))
          .setStyle(ButtonStyle.Secondary)
      );
    });

    rows.push(row);
  }

  return rows;
}

async function handleTechButtonClick(interaction) {
  const customId = interaction.customId;

  if (!customId.startsWith("tech_")) return;

  const techName = customId.replace("tech_", "");
  const tech = TECHS.find(
    (t) => t.name.toLowerCase().replace(/[\s,.]/g, "") === techName
  );

  if (!tech) return;

  // Verificar se a interação já foi respondida ou expirou
  if (interaction.replied || interaction.deferred) {
    console.log("Interação já foi respondida ou está diferida");
    return;
  }

  // Deferimos a interação para evitar o erro de tempo limite
  try {
    await interaction.deferReply({ ephemeral: true });
  } catch (error) {
    console.error("Erro ao deferir a interação:", error);
    return; // Se não conseguirmos deferir, é porque a interação já expirou
  }

  const member = interaction.member;
  const hasRole = member.roles.cache.has(tech.roleId);

  try {
    const role = interaction.guild.roles.cache.get(tech.roleId);

    if (hasRole) {
      await removeRole(member, tech.roleId);

      const embed = new EmbedBuilder()
        .setColor(0x111214)
        .setDescription(`Cargo ${role} removido do seu perfil.`);

      await interaction.editReply({
        embeds: [embed],
        ephemeral: true,
      });
    } else {
      await setRole(member, tech.roleId);

      const embed = new EmbedBuilder()
        .setColor(0x111214)
        .setDescription(`Cargo ${role} adicionado ao seu perfil.`);

      await interaction.editReply({
        embeds: [embed],
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error(`Erro ao gerenciar cargo ${tech.name}:`, error);

    const errorEmbed = new EmbedBuilder()
      .setColor(0x111214)
      .setTitle(`Erro ao gerenciar cargo`)
      .setDescription(
        `Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.`
      );

    try {
      await interaction.editReply({
        embeds: [errorEmbed],
        ephemeral: true,
      });
    } catch (replyError) {
      console.error("Erro ao responder com erro para o usuário:", replyError);
    }
  }
}

async function sendTechEmbed(client) {
  try {
    const techsChannel = await client.channels.fetch(
      process.env.TECHS_CHANNEL_ID
    );

    const messages = await techsChannel.messages.fetch({ limit: 10 });
    if (messages.size > 0) {
      await techsChannel.bulkDelete(messages);
    }

    const guild = techsChannel.guild;
    // Garante que serverName seja uma string, com um fallback.
    const serverName = guild.name
      ? String(guild.name)
      : "Servidor dos Programadores";

    // Garante que serverIcon seja uma string (URL do ícone) ou null.
    const rawIcon = guild.iconURL({ dynamic: true });
    const serverIcon =
      rawIcon === undefined || rawIcon === null ? null : String(rawIcon);

    const embed = createTechsEmbed();

    embed.setFooter({
      text: serverName,
      iconURL: serverIcon,
    });

    const buttons = createTechButtons();

    await techsChannel.send({
      embeds: [embed],
      components: buttons,
    });

    console.log("Embed de tecnologias enviado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar embed de tecnologias:", error);
  }
}

module.exports = {
  TECHS,
  handleTechButtonClick,
  sendTechEmbed,
};
