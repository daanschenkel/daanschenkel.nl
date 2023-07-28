<script>
	import { useLanyard } from 'svelte-lanyard';
	import Fa from 'svelte-fa';
	import {
		faCode,
		faEnvelope,
		faHeadphones,
		faLink,
		faHeart,
		faFile,
		faVolumeHigh,
		faBackward
	} from '@fortawesome/free-solid-svg-icons';
	import { faDiscord, faGithub, faLinkedin, faSpotify } from '@fortawesome/free-brands-svg-icons';
	import { beforeUpdate, onMount } from 'svelte';
	export let data;
	let theActualData = data.data;
	let takingLong = false;
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
	async function stuff() {
		let lanyard = await fetch('https://api.lanyard.rest/v1/users/654390669472694284');
		lanyard = await lanyard.json();
		theActualData = lanyard.data;
	}
	onMount(() => {
		let fetchInterval = setInterval(stuff, 5000);
		//remove interval on unmount
		document.getElementById('sounds').addEventListener('click', () => {
			clearInterval(fetchInterval);
		});
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
			<br />

			<a
				href="sounds"
				class="flex flex-row items-center justify-center bg-gray-800 rounded p-4"
				id="sounds"
			>
				<h2 class="text-xl font-bold flex items-center justify-center">
					<Fa icon={faVolumeHigh} class="mr-2" /> Sounds
				</h2>
			</a>
			<br />
			<div class="flex flex-col items-center justify-center">
				{#if theActualData.activities.length <= 1}
					<h1 class="text-2xl text-center">
						{#if theActualData.activities.length <= 1}
							<p class="text-gray-400">I'm currently not doing anything.</p>
						{/if}
					</h1>
				{/if}
				{#if theActualData.spotify}
					<div class="bg-gray-800 rounded p-4 w-full">
						<h2 class="text-xl font-bold flex items-center justify-left">
							<Fa icon={faSpotify} class="mr-2" /> Listening to Spotify
						</h2>
						<div class="flex items-center justify-left mt-4">
							<img
								src={theActualData.spotify.album_art_url}
								alt="Album art"
								class="w-16 h-16 rounded"
							/>
							<div class="flex flex-col">
								<h1 class="text-xl font-bold ml-4">{theActualData.spotify.song}</h1>
								<p class="text-gray-400 ml-4">by {theActualData.spotify.artist}</p>
							</div>
						</div>
					</div>
				{/if}
				{#each theActualData.activities as activity}
					{#if activity.name === 'Code'}
						<br />
						<div class="bg-gray-800 rounded p-4 w-full">
							<h2 class="text-xl font-bold flex items-center justify-left">
								<Fa icon={faCode} class="mr-2" /> Coding
							</h2>
							<div class="flex items-center justify-left mt-4">
								<img
									src={`https://${activity.assets.large_image.split('https')[1]}`}
									alt="VSCode"
									class="w-16 h-16 rounded"
								/>
								<div class="flex flex-col">
									<h1 class="text-xl font-bold ml-4">{activity.details}</h1>
									<p class="text-gray-400 ml-4">{activity.state || ''}</p>
								</div>
							</div>
						</div>
					{:else if activity.type === 0}
						<br />
						<div class="bg-gray-800 rounded p-4 w-full">
							<h2 class="text-xl font-bold flex items-center justify-left">
								{activity.name || 'No activity'}
							</h2>
							<div class="flex items-center justify-left mt-4">
								<img
									alt="Album art"
									class={`w-16 h-16 rounded ${
										activity?.assets?.large_image === undefined ? 'hidden' : ''
									}`}
									src={activity?.assets?.large_image
										? `https://${activity.assets.large_image.split('https')[1]}`
										: ``}
								/>
								<div class="flex flex-col">
									<h1 class="text-xl font-bold ml-4">{activity.details || ''}</h1>
									<p class="text-gray-400 ml-4">{activity.state || ''}</p>
								</div>
							</div>
						</div>
						<br />
					{/if}
				{/each}
			</div>
			<br />

			<br />
			<h4 class="text-2xl font-bold flex items-center justify-center">
				<Fa icon={faLink} class="mr-2" /> Links
			</h4>
			<div class="flex flex-row items-center justify-center flex-wrap">
				{#each links as link}
					<a
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						class="flex flex-row items-center justify-center bg-gray-800 rounded p-4 m-4"
					>
						<Fa icon={link.icon} class="mr-2" />
						<h1 class="text-xl">{link.name}</h1>
					</a>
				{/each}
			</div>
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
