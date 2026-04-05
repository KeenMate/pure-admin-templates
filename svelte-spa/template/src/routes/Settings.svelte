<script lang="ts">
	import {
		Card,
		Grid,
		Column,
		Button,
		ButtonGroup,
		FormGroup,
		FormLabel,
		Input,
		Textarea,
		Select,
		Checkbox,
		Alert,
		Heading,
		Paragraph,
		Field,
		Fields
	} from '@keenmate/svelte-pure-admin';
	__EXTRA_IMPORTS__

	let appName = $state('__APP_NAME__');
	let appDescription = $state('A modern admin dashboard built with Svelte Pure Admin.');
	let timezone = $state('UTC');
	let emailNotifications = $state(true);
	let pushNotifications = $state(false);
	let saved = $state(false);

	function handleSave() {
		saved = true;
		setTimeout(() => saved = false, 3000);
	}
</script>

<Paragraph mode="muted">Configure your application settings.</Paragraph>

{#if saved}
	<Alert variant="success" isDismissible>
		Settings saved successfully!
	</Alert>
{/if}

<Grid>
	<Column size="100" lg="1-2">
		<Card titleText="General">
			<FormGroup>
				<FormLabel>Application Name</FormLabel>
				<Input bind:value={appName} placeholder="Enter app name" />
			</FormGroup>

			<FormGroup>
				<FormLabel>Description</FormLabel>
				<Textarea bind:value={appDescription} rows={3} placeholder="Describe your application" />
			</FormGroup>

			<FormGroup>
				<FormLabel>Timezone</FormLabel>
				<Select bind:value={timezone}>
					<option value="UTC">UTC</option>
					<option value="US/Eastern">US/Eastern</option>
					<option value="US/Pacific">US/Pacific</option>
					<option value="Europe/London">Europe/London</option>
					<option value="Europe/Prague">Europe/Prague</option>
					<option value="Asia/Tokyo">Asia/Tokyo</option>
				</Select>
			</FormGroup>

			<Button variant="primary" onclick={handleSave}>
				{#snippet icon()}__ICON:save__{/snippet}
				Save Changes
			</Button>
		</Card>

		<Card titleText="Notifications">
			<FormGroup>
				<Checkbox id="email-notifications" bind:checked={emailNotifications} labelText="Email Notifications" />
			</FormGroup>
			<FormGroup>
				<Checkbox id="push-notifications" bind:checked={pushNotifications} labelText="Push Notifications" />
			</FormGroup>
		</Card>
	</Column>

	<Column size="100" lg="1-2">
		<Card titleText="Application Info">
			<Fields>
				<Field labelText="Version" valueText="1.0.0" />
				<Field labelText="Framework" valueText="Svelte 5" />
				<Field labelText="UI Library" valueText="@keenmate/svelte-pure-admin" />
				<Field labelText="Router" valueText="@keenmate/svelte-spa-router" />
			</Fields>
		</Card>

		<Card titleText="Danger Zone">
			<Alert variant="danger">
				These actions are irreversible. Please proceed with caution.
			</Alert>
			<ButtonGroup class="mt-4">
				<Button variant="danger" isOutline onclick={() => alert('Would clear cache')}>
					{#snippet icon()}__ICON:broom__{/snippet}
					Clear Cache
				</Button>
				<Button variant="danger" onclick={() => alert('Would reset app')}>
					{#snippet icon()}__ICON:trash__{/snippet}
					Reset Application
				</Button>
			</ButtonGroup>
		</Card>
	</Column>
</Grid>
