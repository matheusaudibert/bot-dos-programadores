/**
 *
 * @param {GuildMember} member
 * @param {string} roleId
 * @returns {Promise<void>}
 */
async function setRole(member, roleId) {
  try {
    await member.roles.add(roleId);
    console.log(`Cargo ${roleId} adicionado para ${member.user.tag}`);
  } catch (error) {
    console.error(`Erro ao adicionar cargo ${roleId}:`, error);
    throw error;
  }
}

module.exports = { setRole };
