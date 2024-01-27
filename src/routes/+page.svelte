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
			icon: faEnvelope,
			name: 'Email',
			url: 'mailto:web@dannydandan.anonaddy.com'
		},
		{
			icon: faFile,
			name: 'Resume',
			url: '/resume.pdf'
		}
	];
	let page;
	let mounted = false;
	let socket;
	let stuffSocket;
	let socketConnected = false;
	let sounds = [];
	let socketUsers = 0;
	let navigated = false;
	let stuffSocketConnected = false;
	let devices = [];
	let cachedAudios = {};
	//page specific code
	$: if (page == 'sounds') {
		socket = io(env.PUBLIC_SOUNDS_SOCKET);
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
	}
	$: if (page == 'stuff') {
		if (!stuffSocket) {
			stuffSocket = io(env.PUBLIC_DEVICES_SOCKET);
			stuffSocket.on('connect', () => {
				stuffSocketConnected = true;
			});
			stuffSocket.on('disconnect', () => {
				stuffSocketConnected = false;
			});
			stuffSocket.on('deviceUpdate', (data) => {
				let found = false;
				for (let i = 0; i < devices.length; i++) {
					if (devices[i].device.id == data.device.id) {
						found = true;
						devices[i] = data;
					}
				}
				if (!found) {
					devices = [...devices, data];
				}
			});
		}
	}

	onMount(() => {
		mounted = true;
		page = $pageStore.url.searchParams.get('page') || 'home';
	});
	function switchPage(newPage) {
		page = null;
		mounted = false;
		navigated = true;
		if (newPage == 'home') goto(`/`);
		else goto(`?page=${newPage}`);
		setTimeout(() => {
			page = newPage;
			mounted = true;
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
		}
	];
</script>

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
					on:click={() => switchPage('stuff')}
					in:fly={{ duration: navigated ? 0 : 500, delay: navigated ? 0 : 3100, x: 50 }}
				>
					My Stuff
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
	{#if page == 'stuff'}
		<div
			class="flex justify-center items-center min-h-screen flex-col"
			out:fade={{
				duration: 500
			}}
			in:fade={{
				duration: 1000
			}}
		>
			<span in:fade={{ duration: 1000 }} class="flex items-center">
				<h1 class="text-5xl font-bold text-white">My Stuff</h1></span
			>

			<span
				in:fade={{ duration: 1000, delay: 1000 }}
				class="flex items-center mt-4 gap-2 text-white"
			>
				{#if devices.length < 1}
					<p class="text-center">None of my devices are currently connected.</p>
				{:else}
					<div
						class="flex flex-col items-center justify-center p-2 rounded bg-white text-black w-96"
					>
						{#each devices as device}
							<div
								class="flex flex-col items-center justify-center p-2 rounded bg-white text-black w-96"
							>
								<h2 class="text-center font-bold text-3xl">{device.device.name}</h2>
								{#if !device.data.offline}
									<div class="grid grid-cols-2">
										{#each Object.entries(device.data) as [key, value]}
											<div class="p-2">
												<h2 class="text-center font-bold text-xl">{key}</h2>
												{#if typeof value !== 'object'}
													<p class="text-center">{value}</p>
												{:else}
													{#each Object.entries(value) as [key, value]}
														<p class="text-center">{key}: {value}</p>
													{/each}
												{/if}
											</div>
										{/each}
									</div>
								{:else}
									<p class="text-center">Connection to device lost</p>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</span>
			<button
				class="bg-white text-black font-bold py-2 px-4 rounded mt-2"
				in:fade={{ duration: 2000, delay: 2000 }}
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
		>
			<span in:fade={{ duration: 1000 }} class="flex items-center">
				<h1 class="text-5xl font-bold text-white">Sounds</h1></span
			>

			<span in:fade={{ duration: 1000, delay: 1000 }} class="flex items-center mt-2 gap-2">
				<span class="text-white text-3xl text-center">
					Annoy me by playing sounds on my computer!
				</span>
			</span>
			<span in:fade={{ duration: 1000, delay: 2000 }} class="flex items-center mt-2 gap-2">
				<div class="flex justify-center items-center flex-col">
					{#if !socketConnected || sounds.length < 1}
						<span in:fade={{ duration: 1000, delay: 2000 }} class="flex items-center mt-2 gap-2">
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
						in:fly={{ duration: 1000, delay: 2000 + 200 * sounds.indexOf(sound), x: 50 }}
						on:click={() => socket.emit('play', sound.split('.')[0])}>{sound.split('.')[0]}</button
					>
				{/each}
			</span>

			{#if socketConnected && socketUsers > 0}
				<p class="text-white text-center text-md p-4" in:fade={{ duration: 1000, delay: 3000 }}>
					There are currently {socketUsers} users connected.
				</p>
			{/if}

			<button
				class="bg-white text-black font-bold py-2 px-4 rounded mt-2"
				on:click={() => switchPage('home')}
				in:fade={{ duration: 1000, delay: 6000 }}
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
			<img
				src="/mail.png"
				class="mt-4 rotatehover overflow-hidden max-w-2xl"
				alt="mail icon"
				in:fade={{ duration: 1000, delay: 2000 }}
			/>

			<h2
				class="text-white text-center mt-2 text-3xl font-bold"
				in:fade={{ duration: 1000, delay: 4000 }}
			>
				Links
			</h2>

			<span in:fade={{ duration: 1000, delay: 5000 }} class="flex items-center mt-2 gap-4 mb-4">
				{#each links as link (link.url)}
					<a
						href={link.url}
						target="_blank"
						class="text-white text-2xl"
						in:fade={{ duration: 1000, delay: 4500 }}><Fa icon={link.icon} /></a
					>
				{/each}
			</span>

			<button
				class="bg-white text-black font-bold py-2 px-4 rounded mt-2"
				on:click={() => switchPage('home')}
				in:fade={{ duration: 1000, delay: 6000 }}
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
