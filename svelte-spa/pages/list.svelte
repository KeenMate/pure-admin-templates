<script lang="ts">
	import { _, Heading, Card, Table, Badge, Button, ButtonGroup } from '@keenmate/svelte-pure-admin';

	// TODO: Replace with real data source
	const items = [
		{ id: 1, name: 'Item 1', status: 'Active' },
		{ id: 2, name: 'Item 2', status: 'Active' },
		{ id: 3, name: 'Item 3', status: 'Inactive' },
	];
</script>

<Heading level={1}>__PAGE_LABEL__</Heading>

<Card>
	<Table isStriped isHover>
		<thead>
			<tr>
				<th class="col-auto">{$_('app.fields.actions')}</th>
				<th>{$_('app.fields.id')}</th>
				<th>{$_('app.fields.name')}</th>
				<th>{$_('app.fields.status')}</th>
			</tr>
		</thead>
		<tbody>
			{#each items as item}
				<tr>
					<td class="col-auto">
						<ButtonGroup>
							<Button href="/__PAGE_ENTITY__/{item.id}" variant="primary" size="xs" isIconOnly title={$_('app.list.view')}>👁️</Button>
							<Button href="/__PAGE_ENTITY__/{item.id}/edit" variant="secondary" size="xs" isIconOnly title={$_('app.list.edit')}>✏️</Button>
							<Button variant="danger" size="xs" isIconOnly title={$_('app.list.delete')}>🗑️</Button>
						</ButtonGroup>
					</td>
					<td>{item.id}</td>
					<td>{item.name}</td>
					<td>
						<Badge variant={item.status === 'Active' ? 'success' : 'secondary'}>
							{item.status === 'Active' ? $_('app.status.active') : $_('app.status.inactive')}
						</Badge>
					</td>
				</tr>
			{/each}
		</tbody>
	</Table>
</Card>
