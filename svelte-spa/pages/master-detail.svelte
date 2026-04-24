<script lang="ts">
	import {
		_,
		Heading,
		Card,
		Table,
		Badge,
		DetailView,
		DetailPanel,
		Fields,
		Field
	} from '@keenmate/svelte-pure-admin';

	// TODO: Replace with real data source
	const items = [
		{ id: 1, name: '__PAGE_LABEL__ 1', description: 'Description for item 1', status: 'Active' },
		{ id: 2, name: '__PAGE_LABEL__ 2', description: 'Description for item 2', status: 'Active' },
		{ id: 3, name: '__PAGE_LABEL__ 3', description: 'Description for item 3', status: 'Inactive' },
		{ id: 4, name: '__PAGE_LABEL__ 4', description: 'Description for item 4', status: 'Active' },
	];

	let selectedId = $state<number | null>(null);
	const selected = $derived(items.find(i => i.id === selectedId));
	const showPanel = $derived(selected != null);

	function toggle(id: number) {
		selectedId = selectedId === id ? null : id;
	}
</script>

<Heading level={1}>__PAGE_LABEL__</Heading>

<DetailView show={showPanel} onclose={() => selectedId = null}>
	{#snippet main()}
		<Card>
			<Table isStriped isHover>
				<thead>
					<tr>
						<th>{$_('app.fields.name')}</th>
						<th>{$_('app.fields.status')}</th>
					</tr>
				</thead>
				<tbody>
					{#each items as item}
						<tr
							class:is-selected={selectedId === item.id}
							onclick={() => toggle(item.id)}
							style="cursor: pointer;"
						>
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
	{/snippet}

	{#if selected}
		<DetailPanel titleText={selected.name} onclose={() => selectedId = null}>
			<Fields isHorizontal isBordered>
				<Field labelText={$_('app.fields.id')} valueText={selected.id} />
				<Field labelText={$_('app.fields.description')} valueText={selected.description} />
				<Field labelText={$_('app.fields.status')}>
					<Badge variant={selected.status === 'Active' ? 'success' : 'secondary'}>
						{selected.status === 'Active' ? $_('app.status.active') : $_('app.status.inactive')}
					</Badge>
				</Field>
			</Fields>
		</DetailPanel>
	{/if}
</DetailView>
