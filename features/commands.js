const cooldown = require('./cooldown').default;

const commands = {
	triggers: [
		{
			words: [
				`!commands`,
			],
			help: `lists all available commands`,
			handleMessage: (msg) => {
				const payload = commands.triggers.map(trigger => {
					return `${trigger.words.join(', ')} - ${trigger.help}`;
				}).join("\n").trim();
				
				msg.channel.send(`We have a few commands available: \`\`\`${payload}\`\`\``, {
					reply: msg.author
				})
			}			
		},
		{
			words: [
				`!rrlinks`,
			],
			help: `shares a repository of helpful links regarding React and Redux`,
			handleMessage: (msg) => {
				msg.channel.send({
					embed: {
						title: 'Helpful links',
						type: 'rich',
						description: `Reactiflux's Mark Erikson has put together a curated list of useful React & Redux links for developers of all skill levels. Check out https://github.com/markerikson/react-redux-links`,
						color: 7506394,
					}
				});
			},
		},
		{
			words: [
				`!xy`,
			],
			help: `explains the XY problem`,
			handleMessage: (msg) => {
				msg.channel.send({
					embed: {
						title: 'Helpful links',
						type: 'rich',
						description: `You may be experiencing an XY problem: http://xyproblem.info/ - basically, try to explain your end goal, instead of the error you got stuck on. Maybe there's a better way to approach the problem.`,
						color: 7506394,
					}
				});
			},
		},
		{
			words: [
				`!ymnnr`,
			],
			help: `links to the You Might Not Need Redux article`,
			handleMessage: (msg) => {
				msg.channel.send({
					embed: {
						title: 'You Might Not Need Redux',
						type: 'rich',
						description: `People often choose Redux before they need it. “What if our app doesn’t scale without it?
						
https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367`,
						color: 7506394,
					}
				});
			},
		},
		{
			words: [
				`!derived`,
			],
			help: `links to the React docs regarding the getDerivedStateFromProps function (ab)use`,
			handleMessage: (msg) => {
				msg.channel.send({
					embed: {
						title: 'You might not need getDerivedStateFrom props or state at all!',
						type: 'rich',
						description: `React 16.4 included a bugfix for getDerivedStateFromProps which caused some existing bugs in React components to reproduce more consistently. If this release exposed a case where your application was using an anti-pattern and didn’t work properly after the fix...
						
https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html`,
						color: 7506394,
					}
				});
			},
		},
		{
			words: [
				`!bind`,
			],
			help: `explains how and why to bind in React applications`,
			handleMessage: (msg) => {
				msg.channel.send({
					embed: {
						title: 'Binding functions',
						type: 'rich',
						description: `In JavaScript, a class function will not be bound to the instance of the class, this is why you often see messages saying that you can't access something of undefined. 
						
In order to fix this, you need to bind your function, either in constructor:

\`\`\`js
class YourComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handle.click.bind(this);
  }

  handleClick() {
    // you can access \`this\` here, because we've 
    // bound the function in constructor
  }
}
\`\`\`

or by using class properties babel plugin (it works in create-react-app by default!)

\`\`\`js
class YourComponent extends React.Component {
  handleClick = () => {
    // you can access \`this\` here just fine
  }
}
\`\`\`

Check out https://reactkungfu.com/2015/07/why-and-how-to-bind-methods-in-your-react-component-classes/ for more informations`,
						color: 7506394,
					}
				});
			},
		},
		
		{
			words: [
				`!ask`,
			],
			help: `explains how to ask questions`,
			handleMessage: (msg) => {
				msg.channel.send({
					embed: {
						title: 'Asking to ask',
						type: 'rich',
						description: `Instead of asking to ask, ask your question instead. People can help you better if they know your question.

Example:

Bad: "Hey can anyone help me with some JS?"
Bad: "Anyone good with JS?"
Good: "I'm having trouble adding a class to a div using JS. Can I have some help?"

Please also provide any code that might help us using the following syntax:

\\\`\\\`\\\`js
// your code goes here
\\\`\\\`\\\``,
						color: 7506394,
					}
				});
			},
		},
		{			
			words: [
				`!move`
			],
			help: `allows you to move the conversation to another channel, usage: !move #toChannel @person1 @person2 @person3 ...`,
			handleMessage: msg => {
				const [_, newChannel] = msg.content.split(' ');
				const { author, channel, mentions } = msg;
				
				try {
					bot.channels.get(newChannel.replace('<#', '').replace('>','')).send(`${author} has opened a portal from ${channel} summoning ${mentions.members.map(i => i).join(' ')}`);
				} catch(e) {

				}
			}			
		}		
	],
	handleMessage: ({
    msg, 
    user,
  }) => {
		Object.keys(commands.triggers).map(trigger => {
			let hasWord = false;
			const words = commands.triggers[trigger].words;
			words.map(word => {
				if(msg.content.toLowerCase().indexOf(word) === 0) {
					hasWord = word;
				}
			});
			
			if(hasWord) {
				if(cooldown.hasCooldown(msg.author.id, `commands.${hasWord}`)) return;
				cooldown.addCooldown(msg.author.id, `commands.${hasWord}`);
				commands.triggers[trigger].handleMessage.call(this, msg);
			}
		});
	}
}


module.exports = {
  default: commands
};