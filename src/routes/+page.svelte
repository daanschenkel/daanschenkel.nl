<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { page as pageStore } from '$app/stores';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faEnvelope, faHeadphones, faFile } from '@fortawesome/free-solid-svg-icons';
	import { faDiscord, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
	import { io } from 'socket.io-client';
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
	//page specific code
	$: if (page == 'sounds') {
		socket = io('https://sounds.daanschenkel.nl');
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
			let audio = new Audio(`https://sounds.daanschenkel.nl/${data}.wav`);
			audio.play();
		});
		socket.on('users', (data) => {
			socketUsers = data;
		});
	}
	$: if (page == 'stuff') {
		if (!stuffSocket) {
			stuffSocket = io('https://devices.daanschenkel.nl');
			stuffSocket.on('connect', () => {
				stuffSocketConnected = true;
			});
			stuffSocket.on('disconnect', () => {
				stuffSocketConnected = false;
			});
			stuffSocket.on('deviceUpdate', (data) => {
				let found = false;
				for (let i = 0; i < devices.length; i++) {
					if (devices[i].id == data.id) {
						found = true;
						devices[i] = data;
					}
				}
				if (!found) {
					devices.push(data);
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
			name: 'SeasonMC',
			description:
				'Developer for the Minecraft server SeasonMC. Developed Minecraft plugins. Also made business decisions.'
		},
		{
			name: 'Snowcloud',
			description:
				'Created a web portal where users could notify of their absence, see the staff list, view banned users, Give users strikes, appeal them, Demote/promote them and much more.'
		},
		{
			name: 'Minecraft Quest',
			description:
				'Developing a website that shows users a bingocard, and lets them complete it in Minecraft. The 2 systems are linked to each other using Java and web APIs. This would automate (almost) the entire event.'
		},
		{
			name: 'P.E.T.S',
			description:
				'Made and maintains the online learning environment and website for P.E.T.S.<br/><a href="https://petsproject.nl" target="_blank" class="underline">Visit the website</a>'
		},
		{
			name: 'is-a.dev',
			description:
				'Working on the register site, analytics and web hosting.<br/><a href="https://manage.is-a.dev" target="_blank" class="underline">Visit the website</a>'
		},
		{
			name: 'Bakfiets',
			description:
				'Making an app with live follow feature, ordering, payments and more. Coming Soon'
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
<div class={`${socketConnected ? 'mt-4' : 'mt-0'} `}>
	{#if socketConnected}
		<div
			class="fixed top-0 left-0 right-0 z-50 min-w-full flex justify-center items-center bg-green-500"
		>
			<button
				class="text-white text-center text-xl p-4"
				on:click={() => {
					socket.disconnect();
				}}
			>
				You are connected to the soundserver, click here to disconnect.
			</button>
		</div>
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
				class="flex items-center gap-2 lg:flex-row flex-col"
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
			<span class="flex items-center mt-2 gap-2">
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
			<span in:fade={{ duration: 1000 }} class="flex items-center">
				<h1 class="text-5xl font-bold text-white">About</h1></span
			>

			<span in:fade={{ duration: 1000, delay: 1000 }} class="flex items-center mt-2 gap-2">
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
				in:fade={{ duration: 2000, delay: 5000 }}
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
								delay: 1500 + 200 * projects.indexOf(project),
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
				class="flex items-center mt-2 gap-2 text-white"
			>
				{#if devices.length < 1}
					<p class="text-center">None of my devices are currently connected.</p>
				{/if}
				{#each devices as device}
					<div
						class="flex flex-col items-center justify-center p-2 rounded bg-white text-black w-96"
					>
						<h2 class="text-center font-bold text-3xl">{device.device.name}</h2>
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
					</div>
				{/each}
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
</style>
