<script lang="ts">
	import {
		_,
		Heading,
		Card,
		Paragraph,
		Grid,
		Column,
		Fields,
		Field,
		CodeBlock
	} from '@keenmate/svelte-pure-admin';
</script>

<Heading level={1}>{$_('app.dashboard.title')}</Heading>

<Grid>
	<Column size="100" md="50" lg="1-3">
		<Card titleText={$_('app.dashboard.welcome.title')}>
			<Paragraph>{$_('app.dashboard.welcome.body')}</Paragraph>
		</Card>
	</Column>
	<Column size="100" md="50" lg="1-3">
		<Card titleText={$_('app.dashboard.theme.title')}>
			<Paragraph>{$_('app.dashboard.theme.body')}</Paragraph>
		</Card>
	</Column>
	<Column size="100" md="50" lg="1-3">
		<Card titleText={$_('app.dashboard.components.title')}>
			<Paragraph>
				{$_('app.dashboard.components.body')}
				<a href={$_('app.dashboard.components.linkUrl')}>{$_('app.dashboard.components.linkText')}</a>
			</Paragraph>
		</Card>
	</Column>
</Grid>

__PROJECT_INFO__
