<script>
	import '../app.postcss';

	console.log('%cDaan Schenkel', 'color: green; font-size: 40px;');
	console.log('%chttps://daanschenkel.nl', 'color: white; font-size: 15px;');
</script>

<div class="bg-black min-h-screen">
	<slot />
	<div class="fixed bottom-0 pointer-events-none">
		<p class="text-white text-center text-md p-4">Made with ❤️ by Daan Schenkel</p>
	</div>
</div>
