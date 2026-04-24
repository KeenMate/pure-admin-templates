<script lang="ts">
	import { _, Heading, Card, Fields, Field, Badge } from '@keenmate/svelte-pure-admin';
	import { page } from '$app/stores';

	const id = $derived($page.params.id);
</script>

<Heading level={1}>__PAGE_LABEL__ #{id}</Heading>

<Card titleText={$_('app.detail.title')}>
	<Fields isHorizontal isBordered>
		<Field labelText={$_('app.fields.id')} valueText={id} />
		<Field labelText={$_('app.fields.name')} valueText="Item {id}" />
		<Field labelText={$_('app.fields.status')}>
			<Badge variant="success">{$_('app.status.active')}</Badge>
		</Field>
	</Fields>
</Card>
