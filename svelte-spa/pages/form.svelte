<script lang="ts">
	import {
		_,
		Heading,
		Card,
		Form,
		FormGroup,
		FormLabel,
		Input,
		Textarea,
		Select,
		Button
	} from '@keenmate/svelte-pure-admin';

	let formData = $state({
		name: '',
		description: '',
		status: 'active'
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		console.log('Submit:', formData);
		alert($_('app.forms.submitToast'));
	}
</script>

<Heading level={1}>__PAGE_LABEL__</Heading>

<Card titleText="__PAGE_LABEL__">
	<Form onsubmit={handleSubmit}>
		<FormGroup>
			<FormLabel for="name">{$_('app.fields.name')}</FormLabel>
			<Input id="name" bind:value={formData.name} placeholder={$_('app.forms.namePlaceholder')} />
		</FormGroup>

		<FormGroup>
			<FormLabel for="description">{$_('app.fields.description')}</FormLabel>
			<Textarea id="description" bind:value={formData.description} placeholder={$_('app.forms.descriptionPlaceholder')} rows={3} />
		</FormGroup>

		<FormGroup>
			<FormLabel for="status">{$_('app.fields.status')}</FormLabel>
			<Select id="status" bind:value={formData.status}>
				<option value="active">{$_('app.status.active')}</option>
				<option value="inactive">{$_('app.status.inactive')}</option>
				<option value="draft">{$_('app.status.draft')}</option>
			</Select>
		</FormGroup>

		<FormGroup class="d-flex justify-content-end gap-2">
			<Button type="button" variant="secondary">{$_('app.forms.cancel')}</Button>
			<Button type="submit" variant="primary">{$_('app.forms.save')}</Button>
		</FormGroup>
	</Form>
</Card>
