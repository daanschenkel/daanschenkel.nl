<script>
	import { useLanyard } from 'svelte-lanyard';
	import Fa from 'svelte-fa';
	import { faCode, faEnvelope, faHeadphones, faLink } from '@fortawesome/free-solid-svg-icons';
	import { faDiscord, faGithub, faLinkedin, faSpotify } from '@fortawesome/free-brands-svg-icons';

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
		}
	];

	let data = useLanyard('654390669472694284', { type: 'rest', restInterval: 1e3 });

	let wsData = useLanyard('654390669472694284');
	let switchWS = setInterval(() => {
		if ($wsData.discord_user.id) {
			$data = $wsData;
			clearInterval(switchWS);
		}
	}, 1e3);
</script>

<div class="text-white flex flex-col items-center justify-center h-screen">
	{#if $data}
		<div class="flex flex-col items-center justify-center w-full">
			<img
				src={`https://cdn.discordapp.com/avatars/${$data.discord_user.id}/${$data.discord_user.avatar}.png`}
				alt="Avatar"
				class={`rounded-full w-32 h-32 ${$data.discord_status}`}
			/>
			<h1 class="text-4xl font-bold mt-4">Danny</h1>
			<br />
			<div class="flex flex-col items-center justify-center">
				{#if $data.activities.length <= 1}
					<h1 class="text-2xl text-center">
						{#if $data.activities.length <= 1}
							<p class="text-gray-400">I'm currently not doing anything.</p>
						{/if}
					</h1>
				{/if}
				{#if $data.spotify}
					<div class="bg-gray-800 rounded p-4 w-full">
						<h2 class="text-xl font-bold flex items-center justify-left">
							<Fa icon={faSpotify} class="mr-2" /> Listening to Spotify
						</h2>
						<div class="flex items-center justify-left mt-4">
							<img src={$data.spotify.album_art_url} alt="Album art" class="w-16 h-16 rounded" />
							<h1 class="text-2xl font-bold ml-4">{$data.spotify.song} - {$data.spotify.artist}</h1>
						</div>
					</div>
				{/if}
				{#each $data.activities as activity}
					{#if activity.name === 'Code'}
						{#if $data.spotify} <br /> {/if}
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
						{#if $data.spotify} <br /> {/if}
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
					{/if}
				{/each}
			</div>
			<br />
			<h3 class="text-3xl font-bold flex items-center justify-center">
				<Fa icon={faLink} class="mr-2" /> Links
			</h3>
			<div class="flex flex-row items-center justify-center">
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
		</div>
	{:else}
		<pre>
      <code>Loading...</code>
    </pre>
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