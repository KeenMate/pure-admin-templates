import { defineRoutes } from '@keenmate/svelte-spa-router';
import Dashboard from './Dashboard.svelte';
import Users from './Users.svelte';
import Settings from './Settings.svelte';
import GettingStarted from './GettingStarted.svelte';

export const { routes, nav, paths } = defineRoutes({
	dashboard: {
		path: '/',
		component: Dashboard,
		title: 'Dashboard'
	},
	gettingStarted: {
		path: '/getting-started',
		component: GettingStarted,
		title: 'Getting Started'
	},
	users: {
		path: '/users',
		component: Users,
		title: 'Users'
	},
	settings: {
		path: '/settings',
		component: Settings,
		title: 'Settings'
	}
});
