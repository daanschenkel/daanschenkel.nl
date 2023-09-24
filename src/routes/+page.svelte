<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	let page;
	let mounted = false;
	onMount(() => {
		mounted = true;
		page = 'home';
	});
	function switchPage(newPage) {
		page = null;
		mounted = false;
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
			name: 'Talentissimo',
			description: 'Made a custom-coded PHP blogging website for people with giftedness.'
		},
		{
			name: 'Starling Days',
			description:
				'Designed and created a band website for the band "Starling Days".<br/><a href="https://starlingdays.com" target="_blank" class="underline">Visit the website</a>'
		},
		{
			name: 'PraktijkBijBaan',
			description:
				'Developing a full stack website where people with less knowledge can find jobs that appeal to them and bring them in contact with people that can give them this job!'
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
			name: 'Wearning',
			description:
				'Developed a website that would get the current weather and the wardrobe of the user, and would give the user the best combination of clothes to wear for the day.'
		},
		{
			name: 'Minecraft Quest',
			description:
				'Developing a website that shows users a bingocard, and lets them complete it in Minecraft. The 2 systems are linked to each other using Java and web APIs. This would automate (almost) the entire event.<br/><a href="https://mcquest.nl" target="_blank" class="underline">Visit the website</a>'
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
			<img src="https://media4.giphy.com/media/Pjs1kqtH1KTaU/giphy.gif" />
			<p class="text-white text-center text-3xl p-4">
				Please enable JavaScript to load 3tb of animations, thanks!
			</p>
		</div></noscript
	>
{/if}
<div>
	{#if page == 'home'}
		<div
			class="flex justify-center items-center min-h-screen flex-col"
			out:fade={{
				duration: 500
			}}
		>
			<span
				in:fade={{ duration: 1000, delay: 300 }}
				class="flex items-center gap-2 lg:flex-row flex-col"
			>
				<h1 class="text-5xl font-bold text-white wave">👋</h1>
				<h1 class="text-5xl font-bold text-white text-center">
					Hi, welcome to my little website!
				</h1></span
			>
			<span in:fade={{ duration: 1000, delay: 1500 }} class="flex items-center">
				<h1 class="text-3xl text-white text-center">What brings you here today?</h1>
			</span>
			<span in:fade={{ duration: 1000, delay: 2500 }} class="flex items-center mt-2 gap-2">
				<button
					class="bg-white text-black font-bold py-2 px-4 rounded"
					on:click={() => switchPage('about')}
				>
					About
				</button>
				<button
					class="bg-white text-black font-bold py-2 px-4 rounded"
					on:click={() => switchPage('projects')}
				>
					Projects
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
							in:fade|global={{ duration: 500, delay: 1500 + 200 * projects.indexOf(project) }}
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
</div>

<style>
	.wave {
		animation-name: wave-animation;
		animation-duration: 2.5s;
		animation-iteration-count: infinite;
		transform-origin: 70% 70%;
		display: inline-block;
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
</style>
