/**
 * @param {GuildMember} member
 * @param {string} roleId
 * @returns {Promise<void>}
 */
async function removeRole(member, roleId) {
  try {
    await member.roles.remove(roleId);
    console.log(`Cargo ${roleId} removido de ${member.user.tag}`);
  } catch (error) {
    console.error(`Erro ao remover cargo ${roleId}:`, error);
    throw error;
  }
}

module.exports = { removeRole };
