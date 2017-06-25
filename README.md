# Alexa demos
## Node
This demo is a simple Alexa skill that pulls in the current market prices for the top three cryptocurrencies by value.

I didn't want to have more, as it meant Alexa would be yammering on for ages.
The Alexa skill pulls in its data from a Node based Lambda function that uses require to query the API at https://api.coinmarketcap.com for its content.


Not much else to say really, apart that when creating Node skills, you need to upload all the used modules alongside your package and index.js files.

I did this by hand, seeing as it was so simple, but for complex systems I'd most likely use the alexa-app server, running on ubuntu.

Next, I'm going to recreate this in C#, then python, then move onto another skill.
