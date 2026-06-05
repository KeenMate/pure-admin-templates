<script lang="ts">
	import {
		PureAdminProvider,
		Layout,
		LayoutInner,
		LayoutContent,
		// data-pa="navbar-imports"
		Navbar,
		Heading,
		// /data-pa="navbar-imports"
		// data-pa="sidebar-imports"
		Sidebar,
		SidebarItem,
		// /data-pa="sidebar-imports"
		Main,
		// data-pa="footer-imports"
		Footer,
		// /data-pa="footer-imports"
		// data-pa="popover-imports"
		PopoverContainer,
		// /data-pa="popover-imports"
		// data-pa="settings-imports"
		SettingsPanel,
		// /data-pa="settings-imports"
		// data-pa="profile-imports"
		ProfilePanel,
		ProfilePanelNavItem,
		ProfileButton,
		Button,
		// /data-pa="profile-imports"
	} from '@keenmate/svelte-pure-admin';
	import type { PureAdminConfig } from '@keenmate/svelte-pure-admin';
	import Router, { location } from '@keenmate/svelte-spa-router';
	import { onMount } from 'svelte';
	import { routes } from './routes';
	import { setupI18n } from './lib/i18n-setup';
	__EXTRA_IMPORTS__

	setupI18n();

	let sidebarHidden = $state(
		typeof localStorage !== 'undefined' && localStorage.getItem('sidebar-hidden') === 'true'
	);
	let sidebarUserToggled = $state(false);
	let sidebarMobileVisible = $state(false);

	// data-pa="profile-state"
	let showProfilePanel = $state(false);
	// /data-pa="profile-state"

	// data-pa="settings-data"
	const availableThemes = [
		{ id: '__DEFAULT_THEME__', name: '__DEFAULT_THEME__', cssPath: '/themes/__DEFAULT_THEME__/css/__DEFAULT_THEME__.css' }
	];
	// /data-pa="settings-data"

	const currentPath = $derived(location());

	const config: Partial<PureAdminConfig> = {
		app: {
			name: '__APP_NAME__',
			copyright: '__COPYRIGHT__',
			version: '1.0.0'
		}
	};

	function toggleSidebar() {
		if (typeof document !== 'undefined') {
			const isMobile = window.innerWidth <= 768;
			if (isMobile) {
				sidebarMobileVisible = !sidebarMobileVisible;
				sidebarUserToggled = false;
				document.body.classList.toggle('sidebar-visible', sidebarMobileVisible);
			} else {
				sidebarHidden = !sidebarHidden;
				sidebarUserToggled = !sidebarUserToggled;
				sidebarMobileVisible = false;
				document.body.classList.remove('sidebar-visible');
				document.body.classList.toggle('sidebar-hidden', sidebarHidden);
				localStorage.setItem('sidebar-hidden', String(sidebarHidden));
			}
		}
	}

	// data-pa="profile-toggle"
	function toggleProfilePanel() {
		showProfilePanel = !showProfilePanel;
	}
	// /data-pa="profile-toggle"

	onMount(() => {
		// data-pa="page-loader-onmount"
		if ((window as any).__pageLoaderReady) {
			(window as any).__pageLoaderReady();
		}
		// /data-pa="page-loader-onmount"

		const sidebarBehavior = localStorage.getItem('sidebar-behavior') || 'hide';
		const sidebar = document.querySelector('.pa-layout__sidebar');
		if (sidebar && sidebarBehavior === 'icon-collapse') {
			sidebar.classList.add('pa-layout__sidebar--icon-collapse');
		}
	});
</script>

<PureAdminProvider {config}>
	<!-- data-pa="navbar-component" -->
	<Navbar
		onburgerclick={toggleSidebar}
		showBurger={true}
		burgerActive={sidebarMobileVisible || sidebarUserToggled}
	>
		{#snippet brand()}
			<Heading level={1}>__APP_NAME__</Heading>
		{/snippet}

		{#snippet navEnd()}
			<li><a href="#/">Dashboard</a></li>
			<!-- data-pa="demo-pages-nav" -->
			<li><a href="#/users">Users</a></li>
			<li><a href="#/settings">Settings</a></li>
			<!-- /data-pa="demo-pages-nav" -->
		{/snippet}

		<!-- data-pa="navbar-profile-snippet" -->
		{#snippet profile()}
			<ProfileButton name="__USER_NAME__" onclick={toggleProfilePanel}>
				{#snippet icon()}👤{/snippet}
			</ProfileButton>
		{/snippet}
		<!-- /data-pa="navbar-profile-snippet" -->
	</Navbar>
	<!-- /data-pa="navbar-component" -->

	<Layout>
		<LayoutInner>
			<!-- data-pa="sidebar-component" -->
			<Sidebar>
				<!-- data-pa="sidebar-items" -->
				<SidebarItem href="#/getting-started" labelText="Getting Started" active={currentPath === '/getting-started'}>
					{#snippet icon()}__ICON:rocket__{/snippet}
				</SidebarItem>
				<SidebarItem href="#/" labelText="Dashboard" active={currentPath === '/'}>
					{#snippet icon()}__ICON:chart-line__{/snippet}
				</SidebarItem>
				<!-- data-pa="demo-pages-sidebar" -->
				<SidebarItem labelText="Management" hasSubmenu>
					{#snippet icon()}__ICON:briefcase__{/snippet}
					{#snippet submenu()}
						<SidebarItem href="#/users" labelText="Users" active={currentPath === '/users'}>
							{#snippet icon()}__ICON:users__{/snippet}
						</SidebarItem>
						<SidebarItem href="#/settings" labelText="Settings" active={currentPath === '/settings'}>
							{#snippet icon()}__ICON:settings__{/snippet}
						</SidebarItem>
					{/snippet}
				</SidebarItem>
				<!-- /data-pa="demo-pages-sidebar" -->
				<!-- Preset-added pages (e.g. Products under --preset full). The
				     helper filters out entities already represented by the
				     hardcoded items above (dashboard, users, settings). Empty
				     when no preset/extra pages. -->
				__PRESET_PAGES_SIDEBAR__
				<!-- /data-pa="sidebar-items" -->
			</Sidebar>
			<!-- /data-pa="sidebar-component" -->

			<LayoutContent>
				<Main>
					<Router {routes} />
				</Main>

				<!-- data-pa="footer-component" -->
				<Footer>
					{#snippet start()}
						<span>__COPYRIGHT__</span>
					{/snippet}
					{#snippet end()}
						<span>v1.0.0</span>
					{/snippet}
				</Footer>
				<!-- /data-pa="footer-component" -->
			</LayoutContent>
		</LayoutInner>
	</Layout>

	<!-- data-pa="profile-panel-component" -->
	<ProfilePanel
		bind:show={showProfilePanel}
		name="__USER_NAME__"
		email="__USER_EMAIL__"
		role="Administrator"
	>
		{#snippet avatar()}
			<img src="https://ui-avatars.com/api/?name=__USER_NAME_URL__&background=0D8ABC&color=fff" alt="__USER_NAME__" />
		{/snippet}
		{#snippet nav()}
			<ProfilePanelNavItem href="#/settings">
				{#snippet icon()}__ICON:settings__{/snippet}
				Settings
			</ProfilePanelNavItem>
		{/snippet}
		{#snippet actions()}
			<Button variant="danger" isBlock onclick={() => alert('Logout')}>
				{#snippet icon()}__ICON:log-out__{/snippet}
				Sign Out
			</Button>
		{/snippet}
	</ProfilePanel>
	<!-- /data-pa="profile-panel-component" -->

	<!-- data-pa="settings-panel-component" -->
	<SettingsPanel
		themes={availableThemes}
		defaultTheme="__DEFAULT_THEME__"
	/>
	<!-- /data-pa="settings-panel-component" -->

	<!-- data-pa="popover-container" -->
	<PopoverContainer />
	<!-- /data-pa="popover-container" -->
</PureAdminProvider>
