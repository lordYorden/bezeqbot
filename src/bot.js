require('dotenv').config()

const { Client, MessageEmbed, MessageAttachment, DiscordAPIError, Collection, Role } = require('discord.js')
const { MessageButton } = require('discord-buttons')
const client = new Client();

require('discord-buttons')(client)

client.on('ready', () => {
    console.log(`${client.user.username} Has logged in!`)
    client.user.setStatus('available')
    client.user.setPresence({
        activity: {
            name: 'Your Internet',
            type: "PLAYING",
            url: "https://youtu.be/dQw4w9WgXcQ"
        }
    });
})

let botImage = "https://i.imgur.com/lEWVxjF.png"
let sideColor = "#d93b7e"
let hiLoop = new Map();
let muteMembers = new Map();
let manageRole = "BezeqBotRoleManage"//"manage roles permission"//607889650136121365

function sendMenu (message) {
    const exampleEmbed = new MessageEmbed()
	.setColor(sideColor)
    .setTitle('Commends')
    .setAuthor('Bezeq Bot', botImage)
	.setDescription("Here's what you can do with Bezeq Bot!")
	.addFields(
        { name: '&test', value: 'A test will be shown!' },
        { name: '&say <Message>', value: 'Will repeat the given message!' },
        { name: '&role <@role>', value: `Will give you all the none admin roles!\nif you have the right prems!` },
        { name: '&picture <@User>', value: 'Sends the avatar of the mentioned user.' },
		// { name: '\u200B', value: '\u200B' },
        { name: '&hi <@User>', value: `Will toggle the HI loop for a given user!, Makes the user wish he wasn't born!` },
        { name: '&mute <@User>', value: `Will toggle Mute&Unmute a given user!, Makes the user wish he wasn't born!` },
        { name: '&help', value: 'kill you instantly IRL!'}
	)
	// .setImage('https://i.imgur.com/N6fMIYh.png')
	.setTimestamp()
    message.channel.send(exampleEmbed)
} 

function getUserFromMention(message){
    user = message.mentions.users.first()
    if(user === undefined){
        message.channel.send(`Error!...No mentions were found!`)
        return undefined;
    }
    if(user.bot){
        message.channel.send(`Dosen't work on bots, That would be too Chaotic!`);
        return undefined;
    }
    return user;

}

client.on('message', async (message) => {
    if(message.author.bot) return


    if(message.content.startsWith('&')){
        let command = message.content.split(' ')[0].substring(1).toLowerCase();
        switch (command)
        {
            case "test":
                const embed = new MessageEmbed()
                .setTitle("Test")
                .setDescription("This is a test!")

                const yes = new MessageButton()
                .setStyle("green")
                .setLabel("Yes")
                .setID("works")

                const no = new MessageButton()
                .setStyle("red")
                .setLabel("No")
                .setID("rickroll")

                message.channel.send({
                    buttons: [yes, no],
                    embed: embed
                })
                break;
            case "help":
                await sendMenu(message)
                break;
            case "say":
                await message.channel.send(message.content.replace('&say',''));
                break;
            case "hi":
                user = getUserFromMention(message)
                if(user !== undefined){
                    if(hiLoop[user.username] !== undefined){
                        // console.log("flip")
                        hiLoop[user.username] = !hiLoop[user.username];
                    }
                    else
                        hiLoop[user.username] = true;  
                    await message.channel.send(`Hi loop turned ${ hiLoop[user.username] ? "on" : "off" } ${user.username}!`);
                }
                //message.channel.send(`I now you wanted to annoy ${user.username} but, This feture isn't done yet so stay patient!`);
                break;
            case "picture":
                user = getUserFromMention(message)
                if(user !== undefined)
                    await message.channel.send(user.avatarURL());
                break;
            case "role":
                if(message.member.roles.cache.find(role => role.name === manageRole)){
                    role = message.mentions.roles.first();
                    if(role !== undefined){
                        console.log(`role ${role.name}, to ${message.member.displayName}!`)
                        try{
                        await message.member.roles.add(role)
                        }catch(err){
                            console.log(err)
                        }
                    }
                    else
                        console.log(`no role with the name ${data}!`)
                }
                else
                    await message.channel.send("You don't have the premisions to preform this action!")
                break;
            case "mute":
                user = getUserFromMention(message)
                if(user !== undefined){
                    if(muteMembers[user.username] !== undefined){
                        muteMembers[user.username] = !muteMembers[user.username];
                    }
                    else
                        muteMembers[user.username] = true;  
                    await message.channel.send(`${user.username} is now ${ muteMembers[user.username] ? "Muted" : "Unmuted" }!`);
                }
                break;
            default:
                await message.channel.send(`There is no such command as ${command}!`)
        }

        console.log(`Command ${command}!`)
    }
    else if(hiLoop[message.author.username] !== undefined && hiLoop[message.author.username] !== false)
    {
        await message.channel.send(`Hi ${message.author.tag}!`)
    }
    else if(muteMembers[message.author.username] !== undefined && muteMembers[message.author.username] !== false)
    {
        await message.delete()
    }
})

client.on('clickButton', async (button) => {
    button.defer()
    if(button.id == 'works'){
        button.channel.send("It works! Yay")
    }
    else if(button.id == 'rickroll')
    {
        const embed = new MessageEmbed()
        .setTitle("Test")
        .setDescription("This is a test!")

        const url = new MessageButton()
        .setStyle("url")
        .setLabel("enjoy!")
        .setURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ")

        button.message.edit({
            embed: embed,
            button: url});
    }
});

client.login(process.env.DISCORDJS_BOT_TOKEN)

