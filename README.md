# MMM-flatastic
A integration of the [flatastic](https://www.flatastic-app.com/en/) home / commune management app for the [MagicMirror²](https://magicmirror.builders/) 

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description
This is an implementation of the flatastic WG-App for the MagicMirror Project.

The flatastic app is for people who share appartments. You can use it to document what needs done when, to manage your finances and more.

Note: This project and the author of this project do not have any ties with the flatastic app or the company behind the app. 

At the moment you can display:
- Tasks that need to be done
- Statistics for chore points
- Statistics for cashflow

Currently, the module is only available in german.

Some of the code was taken from [Robin Glauser](https://www.robinglauser.ch/blog/2021/03/27/building-a-dashboard-in-a-pictureframe-for-my-flat/), Thank you!

## Screenshot
![image](https://user-images.githubusercontent.com/16883655/140921331-358bf3d4-fe97-48ef-8f7d-401b273ce0af.png)

## Installation
Run these commands at the root of your magic mirror install.

```shell
cd modules
git clone https://github.com/joschi27/MMM-flatastic
```
## Using the module
To use this module, add the following configuration blocks to the modules array in the `config/config.js` file:

```js
    modules: [{
            module: 'MMM-flatastic',
            position: 'bottom_left',
            config: {
                updateInterval: 300 * 1000, // update time in milliseconds -> updates every 5 minutes
                apiKey: "{{PLEASE FOLLOW GUIDE IN README.MD}}",
                taskListConfig: { show: false },
                statisticsConfig: { show: true, showMoney: true, showChorePoints: true },
            }
        },
        {
            module: 'MMM-flatastic',
            position: 'bottom_right',
            config: {
                updateInterval: 60 * 1000, // update time in milliseconds -> updates every minute
                apiKey: "{{PLEASE FOLLOW GUIDE IN README.MD}}",
                taskListConfig: { show: true, maxDisplayItems: 5, showOptionalChores: true },
                statisticsConfig: { show: false },
            }
        },
```

This creates two instances of the flatastic module. One displays the statistics, and one displays the task list.
You can also display everything in one module, but that can really fill up your screen quickly. The positioning of the different modules is up to you; check out the [MagicMirror documentation](https://docs.magicmirror.builders/modules/configuration.html)

## How to get your apiKey (to insert in config)
**Dont share this key with anyone!**
- Go over to the flatastic web-app at https://www.flatastic-app.com/webapp/
- Open the developer options on your browser
- Go to the network tab
- (Reload the browser if nothing is displayed)
- Find any request that goes to API
- Search for the x-api-key field in the request headers
- Insert the value in the module config.js file.

![key-flatastic](https://user-images.githubusercontent.com/16883655/140923784-7025e76b-e8aa-48b0-9cb3-7b044705162f.png)

# Developer information

## Current state of the project
Completed / Maintaining / Improving depending on free time

## Contributing
You are very welcome to contribute! 

### TODO's:
- Translations
- An option to scroll through any lists that are too long to display on the MM (-> the chore list can be very long and will overflow if not limited, so slowly scrolling through / pagination switch could be implemented.)
- Display of Shopping List
- Display of Bulletin Board
- Dark mode (css work)
- Design overhaul if somebody is a better designer than me :P

## API
The project is based on the undocumented flatastic API (https://api.flatastic-app.com/index.php/api). I have no idea if there are rate limits or similar, so use at your own discretion, and make sure that the update timer is not too high. The updateInterval counts for every module individually, and in the current state, every update cycle makes 4 requests to the api! Caching is also not supported yet. (See contributing if you'd like to fix that.)

## Configuration options
The following properties can be configured:

It is important to note that you can have multiple instances of this module on your screen (as shown in the default configuration above).
The configuration that's global for all modules (like the apiKey) will be taken from the first module.


<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>
		<tr>
			<td><code>apiKey</code></td>
			<td><ul>Sets the API key for the module to connect to flatastic.</ul>
				<br> <br> This value is <b>MANDATORY</b>
        <br><b>Default value:</b> <code>'none'</code> (60 Seconds)
			</td>
		</tr>
    <tr>
			<td><code>updateInterval</code></td>
			<td><ul>Sets the time in milliseconds to update the module.</ul>
				<br> <br> This value is <b>OPTIONAL</b>
        <br><b>Default value:</b> <code>'60000'</code> (60 Seconds)
			</td>
		</tr>
        <tr>
			<td><code>taskListConfig</code></td>
			<td><ul>Sets the configuration for the task list.</ul>
        <br><b>Values:</b>
        <br> show (true / false) -> Sets if the module should display the task list.
        <br> maxDisplayItems (number from 1 to infinity (don't quote me on this)) -> Sets how many chores the module should display.
        <br> showOptionalChores (true / false) -> Sets wether optional chores (the ones that can be done whenever) should be displayed in the tasklist.
				<br> <br> This value is <b>OPTIONAL</b>
        <br><b>Default values:</b> <code>'{ show: true, maxDisplayItems: 10, shopOptionalChores: true }'</code>
			</td>
		</tr>
            <tr>
			<td><code>statisticsConfig</code></td>
			<td><ul>Sets the configuration for the statistics.</ul>
        <br><b>Values:</b>
        <br> show (true / false) -> Sets if the module should display the statistics list.
        <br> showMoney (true / false) -> Sets whether the money owed is displayed.
        <br> showChorePoints (true / false) -> Sets whether the chore points are displayed.
				<br> <br> This value is <b>OPTIONAL</b>
        <br><b>Default values:</b> <code>'{ show: true, showMoney: true, showChorePoints: true }</code>
			</td>
    <tr>
			<td><code>animationSpeed</code></td>
			<td><ul>Sets the time in milliseconds to animate module updates.</ul>
				<br> <br> This value is <b>OPTIONAL</b> and setting it could lead to funny glitches :P
        <br><b>Default value:</b> <code>'0'</code>
			</td>
		</tr>
	</tbody>
</table>
