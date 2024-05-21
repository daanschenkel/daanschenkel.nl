<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { page as pageStore } from '$app/stores';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faEnvelope, faHeadphones, faFile } from '@fortawesome/free-solid-svg-icons';
	import { faDiscord, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
	import { io } from 'socket.io-client';
	import { env } from '$env/dynamic/public';
	import { goto } from '$app/navigation';
	const cursor = io(env.PUBLIC_CURSORS_SOCKET);

	let page;
	let mounted = false;
	let socket = io(env.PUBLIC_SOUNDS_SOCKET);
	let socketConnected = false;
	let sounds = [];
	let socketUsers = 0;
	let navigated = false;
	let devices = [];
	let cachedAudios = {};
	let mouseCursors = [];

	function drawCanvas() {
		const canvas = document.getElementById('emailCanvas');
		var ctx = canvas.getContext('2d');

		//clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		var email = 'daan@daanschenkel.nl';

		// Set the font and size
		ctx.font = '20px Roboto';

		//background
		ctx.fillStyle = 'white';

		//nmake background out of random characters in the email, position from top left to bottom right
		for (let i = 0; i < 200; i++) {
			ctx.fillText(
				email[Math.floor(Math.random() * email.length)],
				Math.random() * canvas.width,
				Math.random() * canvas.height
			);
		}
		//draw the text big and bold, with each letter in a different color and a black border around it
		ctx.font = 'bold 20px Roboto';
		for (let i = 0; i < email.length; i++) {
			ctx.fillStyle = `hsl(${(Math.random() * 360) | 0}, 100%, 50%)`;
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 10;
			ctx.strokeText(email[i], i * 20, 30);
			ctx.fillText(email[i], i * 20, 30);
		}
	}

	//page specific code
	socket.on('connect', () => {
		socketConnected = true;
	});
	socket.on('disconnect', () => {
		socketConnected = false;
		sounds = [];
	});
	socket.on('list', (data) => {
		sounds = data;
	});
	socket.on('play', (data) => {
		//load audio file
		if (!cachedAudios[data])
			cachedAudios[data] = new Audio(`${env.PUBLIC_SOUNDS_SOCKET}/${data}.wav`);

		//play audio file
		cachedAudios[data].play();
	});
	socket.on('users', (data) => {
		socketUsers = data;
	});
	onMount(() => {
		mounted = true;
		if ($pageStore.url.searchParams.get('page'))
			switchPage($pageStore.url.searchParams.get('page'));
		else switchPage('home');

		cursor.on('connect', () => {
			console.log('connected to cursor server');
		});

		cursor.on('new', (data) => {
			mouseCursors = [
				...mouseCursors,
				{
					id: data,
					x: 0,
					y: 0
				}
			];
		});
		cursor.on('left', (data) => {
			mouseCursors = mouseCursors.filter((cursor) => cursor.id !== data);
		});
		cursor.on('move', (data) => {
			let found = false;
			mouseCursors = mouseCursors.map((cursor) => {
				if (cursor.id === data.id) {
					//generate x and y position based on remote and current screen size
					cursor.x = (data.x / data.screenX) * window.innerWidth;
					cursor.y = (data.y / data.screenY) * window.innerHeight;
					cursor.page = data.page;
					found = true;
				}
				return cursor;
			});
			if (!found) {
				mouseCursors = [
					...mouseCursors,
					{
						id: data.id,
						x: (data.x / data.screenX) * window.innerWidth,
						y: (data.y / data.screenY) * window.innerHeight,
						page: data.page
					}
				];
			}
		});

		let lastMouse = new Date().getTime();

		window.addEventListener('mousemove', (e) => {
			if (new Date().getTime() - lastMouse < 100) return;
			lastMouse = new Date().getTime();

			cursor.emit('move', {
				x: e.clientX,
				y: e.clientY,
				screenX: window.innerWidth,
				screenY: window.innerHeight,
				page: page
			});
		});
	});
	function switchPage(newPage) {
		cursor.emit('move', {
			x: 0,
			y: 0,
			screenX: window.innerWidth,
			screenY: window.innerHeight,
			page: newPage
		});

		page = null;
		mounted = false;
		navigated = true;
		if (newPage == 'home') goto(`/`);
		else goto(`?page=${newPage}`);
		setTimeout(() => {
			page = newPage;
			mounted = true;
			if (newPage == 'choices') goto(`/thingbattle`);

			if (newPage === 'contact') {
				setTimeout(async () => {
					drawCanvas();
				}, 1000);
			}
		}, 501);
	}
	function daysUntilNext(month, day) {
		var tday = new Date(),
			y = tday.getFullYear(),
			next = new Date(y, month - 1, day);
		tday.setHours(0, 0, 0, 0);
		if (tday > next) next.setFullYear(y + 1);
		return Math.round((next - tday) / 8.64e7);
	}

	const links = [
		{
			icon: faGithub,
			name: 'GitHub',
			url: 'https://github.com/daanschenkel'
		},

		{
			icon: faHeadphones,
			name: 'Last.fm',
			url: 'https://www.last.fm/user/DannyDanDan_'
		},

		{
			icon: faDiscord,
			name: 'Discord',
			url: 'https://discord.com/users/654390669472694284'
		},

		{
			icon: faLinkedin,
			name: 'LinkedIn',
			url: 'https://www.linkedin.com/in/daan-schenkel-b65726226/'
		},

		{
			icon: faFile,
			name: 'Resume',
			onClick: () => {
				alert(
					'I guess my project page is kind of my resume? Fun fact: You can do Ctrl+P to print it!'
				);
				switchPage('projects');
			},
			url: '#'
		}
	];

	const projects = [
		{
			name: 'Starling Days',
			description:
				'Designed and created a band website for the band "Starling Days".<br/><a href="https://starlingdays.com" target="_blank" class="underline">Visit the website</a>'
		},

		{
			name: 'Karen.pics',
			description:
				'A website where people can upload images and share them easily.<br/><a href="https://karen.pics" target="_blank" class="underline">Visit the website</a>'
		},

		{
			name: 'P.E.T.S',
			description:
				'Made and maintains the online learning environment and website for P.E.T.S.<br/><a href="https://petsproject.nl" target="_blank" class="underline">Visit the website</a>'
		},
		{
			name: 'VIPS TV',
			description:
				"Made and maintains the website for VIPS TV.<br/><a href='https://vipstv.nl' target='_blank' class='underline'>Visit the website</a>"
		},
		{
			name: 'is-a.dev',
			description:
				'Developed an open-source register site, linked with analytics and web hosting.<br/><a href="https://manage.is-a.dev" target="_blank" class="underline">Visit the website</a>'
		},
		{
			name: 'Cycling 4 Climate',
			description:
				"Doing voluntary work for Cycling 4 Climate. Managing GSuite/Google Workspace, servers, AWS, etc.<br/><a href='https://cycling4climate.nl' target='_blank' class='underline'>Visit the website</a>"
		},
		{
			name: 'League-FM',
			description:
				"Wrote the internal management system and the backend for the public site.<br/><a href='https://league-fm.nl' target='_blank' class='underline'>Visit the website</a>"
		},
		{
			name: 'Fit in a Box',
			description:
				"Developed an app for Fit in a Box, a company that makes custom boxes to keep you fit.<br/><a href='https://kickboksengroningen.nl/fit-in-a-box' target='_blank' class='underline'>Visit the website</a>"
		},
		{
			name: 'Hexi Development',
			description:
				"Developed multiple applications & reverse-engineered APIs for Hexi Development.<br/><a href='https://hexidev.nl' target='_blank' class='underline'>Visit the website</a>"
		},
		{
			name: 'LangsteStream.nl',
			description:
				"Made an interactive app for Dutch livestreamer <a href='https://twitch.tv/henRYANand'>henRYANand</a> that i developed for April fools 2024. It allowed users to upload short videos, that would then be processed and placed in a long stream. <br/><a href='https://langstestream.nl' target='_blank' class='underline'>Visit the website</a>"
		},
		{
			name: 'StreamStreaks.com',
			description: `Developed an app in partnership with twitch streamer <a href="https://twitch.tv/henRYANand">henRYANand</a> that allows users to have streaks in streamers chats, to keep them active and engaged. <br/><a href="https://streamstreaks.com" target="_blank" class="underline">Visit the website</a>`
		},
		{
			name: 'CrewHL.nl',
			description: `Made an internal app integrated with WhatsApp and the user's school schedules, to manage the schools music crew administration. <br/> <a href="https://crewhl.nl" target="_blank" class="underline">Visit the website</a>`
		}
	];
</script>

{#each mouseCursors as cursor}
	{#if !(cursor.x === 0 && cursor.y === 0) && cursor.page === page}
		<img
			src="/cursor.png"
			style="position: absolute; left: {cursor.x}px; top: {cursor.y}px; overflow: hidden; pointer-events: none;"
			out:fade={{ duration: 500 }}
			width="16"
			height="16"
		/>
		/>
	{/if}
{/each}

{#if !page}
	<noscript>
		<div class="bg-black min-h-screen flex justify-center items-center flex-col">
			<img src="https://media4.giphy.com/media/Pjs1kqtH1KTaU/giphy.gif" alt="funny gif" />
			<p class="text-white text-center text-3xl p-4">
				Please enable JavaScript to load 3tb of animations, thanks!
			</p>
		</div></noscript
	>
{/if}
<div>
	{#if socketConnected}
		<button
			class="text-white text-center text-xl p-4 notif"
			on:click={() => {
				socket.disconnect();
			}}
		>
			Disconnect from soundserver
		</button>
	{/if}
	{#if page == 'home'}
		<div
			class="flex justify-center items-center min-h-screen flex-col"
			out:fade={{
				duration: 500
			}}
			in:fade={{ duration: 2000 }}
		>
			<span
				in:fade={{ duration: navigated ? 0 : 1000, delay: navigated ? 0 : 300 }}
				class="flex items-center gap-2 lg:flex-row flex-col p-4"
			>
				<h1 class="text-5xl font-bold text-white wave">👋</h1>
				<h1 class="text-5xl font-bold text-white text-center">
					Hi, welcome to my little website!
				</h1></span
			>
			<span
				in:fade={{ duration: navigated ? 0 : 1000, delay: navigated ? 0 : 1500 }}
				class="flex items-center"
			>
				<h1 class="text-3xl text-white text-center">What brings you here today?</h1>
			</span>
			<span class="mt-2 gap-2 flex flex-row items-center flex-wrap justify-center">
				<button
					class="bg-white text-black font-bold py-2 px-4 rounded"
					on:click={() => switchPage('about')}
					in:fly={{ duration: navigated ? 0 : 500, delay: navigated ? 0 : 2500, x: 50 }}
				>
					About
				</button>
				<button
					class="bg-white text-black font-bold py-2 px-4 rounded"
					on:click={() => switchPage('projects')}
					in:fly={{ duration: navigated ? 0 : 500, delay: navigated ? 0 : 2800, x: 50 }}
				>
					Projects
				</button>

				<button
					class="bg-white text-black font-bold py-2 px-4 rounded"
					on:click={() => switchPage('sounds')}
					in:fly={{ duration: navigated ? 0 : 500, delay: navigated ? 0 : 3400, x: 50 }}
				>
					Sounds
				</button>
				<button
					class="bg-white text-black font-bold py-2 px-4 rounded"
					on:click={() => switchPage('choices')}
					in:fly={{ duration: navigated ? 0 : 500, delay: navigated ? 0 : 3400, x: 50 }}
				>
					Choices
				</button>
				<button
					class="bg-white text-black font-bold py-2 px-4 rounded"
					on:click={() => switchPage('contact')}
					in:fly={{ duration: navigated ? 0 : 500, delay: navigated ? 0 : 3700, x: 50 }}
				>
					Contact
				</button>
			</span>
		</div>
	{/if}
	{#if page == 'about'}
		<div
			class="flex justify-center items-center min-h-screen flex-col"
			out:fade={{
				duration: 500
			}}
			in:fade={{
				duration: 1000
			}}
		>
			<span class="flex items-center"> <h1 class="text-5xl font-bold text-white">About</h1></span>

			<span class="flex items-center mt-2 gap-2">
				<span class="text-white max-w-3xl text-center m-3">
					Heya! My name is Daan, better known online as dandandev/DannyDanDan. I live in The
					Netherlands. I also grew up and go to school there. I quickly discovered my obsession to
					everything tech related when i was about 5-6. I've been tinkering with everything that
					makes those beep boop sounds ever since.<br /><br />

					My journey started with Scratch, where i made a lot of games and animations. After that i
					started learning Processing and some Arduino. After this i discovered Node.js, which i've
					been using for a while now. I've also tried some Java, Python & Skript.
					<br /><br />
					Nowadays i mainly spend my time building webapps with SvelteKit. I ❤️ Svelte(kit) and use it
					to build all my websites, even the one you're looking at right now!<br />
					<br />
					Before Svelte, i used React, which i now use to build mobile apps.

					<br /><br />My birthday is on the 22nd of November (in {daysUntilNext(11, 22)} days).
				</span>
			</span>
			<button
				class="bg-white text-black font-bold py-2 px-4 rounded mt-2"
				on:click={() => switchPage('home')}
			>
				Back
			</button>
		</div>
	{/if}
	{#if page == 'projects'}
		<div
			class="flex justify-center items-center min-h-screen flex-col p-4"
			out:fade={{
				duration: 500
			}}
		>
			<span in:fade={{ duration: 1000 }} class="flex items-center">
				<h1 class="text-5xl font-bold text-white">Projects</h1></span
			>

			<span in:fade={{ duration: 1000, delay: 1000 }} class="flex items-center mt-2 gap-2">
				<span class="text-white text-3xl text-center"> Here's a list of all of my projects. </span>
			</span>
			{#if mounted}
				<div class="flex justify-center items-center flex-col gap-4 mt-4">
					{#each projects as project (project)}
						<span
							in:fly|global={{
								duration: 500,
								delay: 2000 + 200 * projects.indexOf(project),
								x: 50
							}}
							class="flex items-center flex-col text-center m-1 max-w-lg"
						>
							<h1 class="text-xl font-bold text-white">{project.name}</h1>
							<h1 class="text-md text-white">
								{@html project.description}
							</h1>
						</span>
					{/each}
				</div>
			{/if}

			<button
				class="bg-white text-black font-bold py-2 px-4 rounded mt-2"
				in:fade={{ duration: 500, delay: 1500 + 200 * projects.length }}
				on:click={() => switchPage('home')}
			>
				Back
			</button>
		</div>
	{/if}
	{#if page == 'sounds'}
		<div
			class="flex justify-center items-center min-h-screen flex-col p-4"
			out:fade={{
				duration: 500
			}}
			in:fade={{
				duration: 1000
			}}
		>
			<span class="flex items-center"> <h1 class="text-5xl font-bold text-white">Sounds</h1></span>

			<span class="flex items-center mt-2 gap-2">
				<span class="text-white text-3xl text-center">
					Annoy me by playing sounds on my computer!
				</span>
			</span>
			<span class="flex items-center mt-2 gap-2">
				<div class="flex justify-center items-center flex-col">
					{#if !socketConnected || sounds.length < 1}
						<span class="flex items-center mt-2 gap-2">
							<button class="text-white text-center mt-2 text-xl" on:click={() => socket.connect()}>
								I cant seem to connect to the soundserver. Danny's probably asleep/offline. Click to
								retry
							</button>
						</span>
					{/if}
				</div>
			</span>
			<span class="grid grid-cols-3 gap-4 mt-4">
				{#each sounds as sound (sound)}
					<button
						target="_blank"
						class="bg-white text-black font-bold py-2 px-4 rounded"
						on:click={() => socket.emit('play', sound.split('.')[0])}>{sound.split('.')[0]}</button
					>
				{/each}
			</span>

			<input
				type="text"
				class="bg-white text-black font-bold py-2 px-4 rounded mt-2"
				placeholder="Leave a message for Danny!"
				on:keydown={(e) => {
					if (e.key === 'Enter') {
						socket.emit('msg', e.target.value);
						e.target.value = '';
					}
				}}
			/>

			{#if socketConnected && socketUsers > 0}
				<p class="text-white text-center text-md p-4">
					There are currently {socketUsers} users connected.
				</p>
			{/if}

			<button
				class="bg-white text-black font-bold py-2 px-4 rounded mt-2"
				on:click={() => switchPage('home')}
			>
				Back
			</button>
		</div>
	{/if}
	{#if page == 'contact'}
		<div
			class="flex justify-center items-center min-h-screen flex-col p-4"
			out:fade={{
				duration: 500
			}}
		>
			<span in:fade={{ duration: 1000 }} class="flex items-center">
				<h1 class="text-5xl font-bold text-white">Contact</h1></span
			>

			<span in:fade={{ duration: 1000, delay: 1000 }} class="flex items-center mt-2 gap-2">
				<span class="text-white text-3xl text-center">
					Only for real humans, no robots allowed!
				</span>
			</span>
			<canvas
				class="mt-2"
				width="400"
				height="50"
				id="emailCanvas"
				in:fade={{ duration: 1000, delay: 1000 }}
			/>
			<button
				class="text-white text-center mt-2 text-md"
				on:click={() => {
					drawCanvas();
				}}
				in:fade={{ duration: 1000, delay: 1000 }}
			>
				unreadable?
			</button>

			<h2
				class="text-white text-center mt-2 text-3xl font-bold"
				in:fade={{ duration: 1000, delay: 3000 }}
			>
				Links
			</h2>

			<span in:fade={{ duration: 1000, delay: 4000 }} class="flex items-center mt-2 gap-4 mb-4">
				{#each links as link (link.url)}
					<a
						href={link.url || '#'}
						on:click={link.onClick}
						target="_blank"
						class="text-white text-2xl"
						in:fade={{ duration: 1000, delay: 4500 }}><Fa icon={link.icon} /></a
					>
				{/each}
			</span>

			<button
				class="bg-white text-black font-bold py-2 px-4 rounded mt-2"
				on:click={() => switchPage('home')}
				in:fade={{ duration: 1000, delay: 5000 }}
			>
				Back
			</button>
		</div>
	{/if}
</div>

<style>
	.wave {
		animation-name: wave-animation;
		animation-timing-function: linear;
		animation-duration: 3s;
		animation-iteration-count: infinite;
	}
	@keyframes wave-animation {
		0% {
			transform: rotate(0deg);
		}
		10% {
			transform: rotate(14deg);
		}
		20% {
			transform: rotate(-8deg);
		}
		30% {
			transform: rotate(14deg);
		}
		40% {
			transform: rotate(-4deg);
		}
		50% {
			transform: rotate(10deg);
		}
		60% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(0deg);
		}
	}

	.rotatehover {
		animation-name: spin-animation;
		animation-timing-function: linear;
		animation-duration: 20s;
		animation-iteration-count: infinite;
	}

	.rotatehover:hover {
		animation-play-state: paused;
	}

	@keyframes spin-animation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(-365deg);
		}
	}

	.notif {
		/*show small notification on top of the screen, when hovering, reveal entire thing*/
		transition: all 0.5s ease-in-out;
		top: -40px;

		background-color: red;
		position: fixed;
		left: 0;
		right: 0;
		z-index: 999;
		text-align: center;
		max-height: 200px;

		overflow: hidden;
	}
	.notif:hover {
		top: 0px;
	}
</style>
