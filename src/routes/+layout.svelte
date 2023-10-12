<script>
	import '../styles.css';

	import { menu, auth } from '$lib/stores/menu';
	import { theme } from '$lib/stores/theme';

	import Menu from './Menu.svelte';
	import Auth from './Auth.svelte';

	import { onMount } from 'svelte';

	onMount(() => {
		$theme = localStorage.getItem('theme') || 'light';
		document.documentElement.dataset.theme = $theme;
	});
</script>

<main>
	{#if $auth}
		<Auth />
	{:else if $menu}
		<Menu />
	{:else}
		<slot />
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
