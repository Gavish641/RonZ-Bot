const { ActivityType, EmbedBuilder, Embed } = require('discord.js');
const config = require('../../config.json')
const axios = require('axios');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Ready!');
        setInterval(() => {
            const guild = client.guilds.cache.get(config.serverId)
            axios.get(`http://${config.serverIp}:${config.serverPortal}/players.json`).then(async function (response) {
                client.user.setActivity(`(${response.data.length}/${config.maxPlayers}) | (${guild.memberCount})`, { type: ActivityType.Playing })
                let playerlist = `**\`📊\`Status: Online**\n**\`👨\`Players: [${response.data.length}/${config.maxPlayers}]**\n**\`🌌\`Space: ${parseInt((response.data.length * 100) / parseInt(config.maxPlayers))}%**\n\n`

                let serverManager = ""
                let management = ""
                let headStaff = ""
                let staff = ""

                for(let i = 1; i <= response.data.length; i++) {
                    let memberId = ""
                    for(j in response.data[i-1].identifiers) {
                        if(response.data[i-1].identifiers[j].startsWith('discord')) {
                            playerlist += `**\`(ID: ${response.data[i-1].id})\`  |  <@${response.data[i-1].identifiers[j].substring(8,)}>  \`${response.data[i-1].name}\`** \n`
                            memberId = response.data[i-1].identifiers[j].substring(8,)
                            
                        }
                    }

                    if(client.guilds.cache.get(config.serverId).members.cache.get(memberId).roles.cache.find(role => role.id === config.serverManagerRole)) {
                        serverManager += `**\`(ID: ${response.data[i-1].id})\` |  <@${memberId}>  \`${response.data[i-1].name}\`**\n`
                    }
                    else if(client.guilds.cache.get(config.serverId).members.cache.get(memberId).roles.cache.find(role => role.id === config.managementRole)) {
                        management += `**\`(ID: ${response.data[i-1].id})\` |  <@${memberId}>  \`${response.data[i-1].name}\`**\n`
                    }
                    else if(client.guilds.cache.get(config.serverId).members.cache.get(memberId).roles.cache.find(role => role.id === config.headStaffRole)) {
                        headStaff += `**\`(ID: ${response.data[i-1].id})\` |  <@${memberId}>  \`${response.data[i-1].name}\`**\n`
                    }
                    else if(client.guilds.cache.get(config.serverId).members.cache.get(memberId).roles.cache.find(role => role.id === config.staffRole)) {
                        staff += `**\`(ID: ${response.data[i-1].id})\` |  <@${memberId}>  \`${response.data[i-1].name}\`**\n`
                    }
                    
                }

                const embed = new EmbedBuilder()
                .setColor('#8a018c')
                .setFooter({ text: "Developed By Gavish" , iconURL: `${config.server_img}`})
                .setTitle('Crazy Party RolePlay | Playerlist')
                .setDescription(playerlist)
                .setThumbnail(`${config.server_img}`)
                .setTimestamp()
                const msg = await client.guilds.cache.get(config.serverId).channels.cache.get(config.playerlist_channel).messages.fetch(config.playerlist_msg)
                msg.edit({ content: "", embeds: [embed]})

            }).catch(async function (error) {
                client.user.setActivity(`Server Offline | (${guild.memberCount})`, { type: ActivityType.Playing })
                const embed = new EmbedBuilder()
                .setColor('Red')
                .setFooter({ text: "Developed By Gavish" })
                .setTitle('Crazy Party RolePlay | Playerlist')
                .setDescription(`**\`📊\`**Status: Offline**\n**`)
                .setTimestamp()
                const msg = await client.guilds.cache.get(config.serverId).channels.cache.get(config.playerlist_channel).messages.fetch(config.playerlist_msg)
                msg.edit({ embeds: [embed] })
            })
        }, 5 * 1000)

    },
};

