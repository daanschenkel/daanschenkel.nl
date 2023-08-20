<script>
	import Fa from 'svelte-fa';
	import { faHeart, faBackward } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import io from 'socket.io-client';
	console.log(env.PUBLIC_SOCKET_URL);
	export let data;
	let theActualData = data.data;
	let takingLong = false;
	let sounds = [];
	let rateLimit = false;

	async function stuff() {
		let lanyard = await fetch('https://api.lanyard.rest/v1/users/654390669472694284');
		lanyard = await lanyard.json();
		theActualData = lanyard.data;
	}
	onMount(() => {
		let fetchInterval = setInterval(stuff, 5000);
		//remove interval on unmount
		document.getElementById('back').addEventListener('click', () => {
			clearInterval(fetchInterval);
		});
	});

	const socket = io(env.PUBLIC_SOCKET_URL);
	socket.on('connect', () => {
		console.log('connected');
	});
	socket.on('list', (data) => {
		sounds = [];
		for (let i = 0; i < data.length; i++) {
			sounds = [...sounds, data[i].split('.')[0]];
		}
	});
	socket.on('play', (data) => {
		let url = `${env.PUBLIC_SOCKET_URL}/${data}.wav`;
		let audio = new Audio(url);
		audio.play();
	});
</script>

<div class="text-white flex flex-col items-center justify-center h-screen w-full">
	{#if theActualData}
		<div class="flex flex-col items-center justify-center w-full px-4">
			<img
				src={`https://cdn.discordapp.com/avatars/${theActualData.discord_user.id}/${theActualData.discord_user.avatar}.png`}
				alt="Avatar"
				class={`rounded-full w-32 h-32 ${theActualData.discord_status}`}
			/>
			<h1 class="text-4xl font-bold mt-4">Danny</h1>
			<h2 class="text-gray-400 text-center mt-4 text-xl">Play sounds on my computer!</h2>
			<br />
			<div class="flex flex-row items-center justify-center">
				{#if sounds.length === 0}
					<p
						class="text-gray-400 text-center items-center justify-center flex flex-row text-xl mb-2"
					>
						Couldn't connect to the sound server, i'm probably offline.
					</p>
				{/if}
				{#each sounds as sound}
					<button
						on:click={() => {
							if (rateLimit) return;
							rateLimit = true;
							socket.emit('play', sound);
							setTimeout(() => {
								rateLimit = false;
							}, 2000);
						}}
						class="flex flex-row items-center justify-center bg-gray-800 rounded p-4 m-2"
					>
						<h2 class="text-xl font-bold flex items-center justify-center">
							{sound}
						</h2>
					</button>
				{/each}
			</div>

			<a
				href="/"
				class="flex flex-row items-center justify-center bg-gray-800 rounded p-4"
				id="back"
			>
				<h2 class="text-xl font-bold flex items-center justify-center">
					<Fa icon={faBackward} class="mr-2" /> Back
				</h2>
			</a>
			<br />
			<div class="flex flex-col items-center justify-center" />
			<br />

			<br />
			<p class="text-gray-400 text-center mt-4 items-center justify-center flex flex-row">
				Made with <Fa icon={faHeart} class="text-red-500 mr-1 ml-1" /> in The Netherlands
			</p>
		</div>
	{:else}
		<p class="text-center">
			Loading...
			<br />
			<span
				class="text-gray-400 text-center"
				style={`transition: opacity 0.5s; opacity: ${takingLong ? '1' : '0'};`}
				>This is taking a while, Lanyard is probably down. Please try again later.
			</span>
		</p>
	{/if}
</div>

<style>
	.online {
		border: 4px solid #43b581;
	}
	.idle {
		border: 4px solid #faa61a;
	}
	.dnd {
		border: 4px solid #f04747;
	}
	.offline {
		border: 4px solid #747f8d;
	}
</style>
