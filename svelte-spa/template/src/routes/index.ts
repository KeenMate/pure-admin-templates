import Dashboard from './Dashboard.svelte';
import Users from './Users.svelte';
import Settings from './Settings.svelte';
import GettingStarted from './GettingStarted.svelte';

export const routes = {
	'/': Dashboard,
	'/getting-started': GettingStarted,
	'/users': Users,
	'/settings': Settings
};
