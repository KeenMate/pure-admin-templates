<script lang="ts">
	import {
		Card,
		Grid,
		Column,
		Stat,
		Badge,
		Button,
		Table,
		TableResponsive,
		ActivityFeed,
		ActivityFeedItem,
		QuickActions,
		Paragraph,
		Heading,
		CodeBlock
	} from '@keenmate/svelte-pure-admin';
	__EXTRA_IMPORTS__
</script>

<Paragraph mode="muted">Real-time overview of key performance metrics</Paragraph>

<!-- KPI Cards -->
<Grid>
	<Column size="100" md="25">
		<Card>
			<Stat variant="hero" labelText="Total Revenue" number="$847,392" changeText="12.5% vs last month" changeDirection="positive" />
		</Card>
	</Column>
	<Column size="100" md="25">
		<Card>
			<Stat variant="hero" labelText="Active Users" number="24,583" changeText="8.3% vs last month" changeDirection="positive" />
		</Card>
	</Column>
	<Column size="100" md="25">
		<Card>
			<Stat variant="hero" labelText="Conversion Rate" number="3.47%" changeText="2.1% vs last month" changeDirection="negative" />
		</Card>
	</Column>
	<Column size="100" md="25">
		<Card>
			<Stat variant="hero" labelText="Avg Order Value" number="$134.52" changeText="5.7% vs last month" changeDirection="positive" />
		</Card>
	</Column>
</Grid>

<!-- Recent Orders & Activity -->
<Grid>
	<Column size="100" lg="2-3">
		<Card titleText="Recent Orders">
			<TableResponsive>
				<Table isCompact isHover>
					<thead>
						<tr>
							<th>Order</th>
							<th>Customer</th>
							<th>Amount</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						<tr><td>#1001</td><td>John Doe</td><td>$1,234.56</td><td><Badge variant="success">Delivered</Badge></td></tr>
						<tr><td>#1002</td><td>Jane Smith</td><td>$567.89</td><td><Badge variant="warning">Processing</Badge></td></tr>
						<tr><td>#1003</td><td>Bob Johnson</td><td>$2,345.67</td><td><Badge variant="info">Shipped</Badge></td></tr>
						<tr><td>#1004</td><td>Alice Williams</td><td>$890.12</td><td><Badge variant="warning">Pending</Badge></td></tr>
						<tr><td>#1005</td><td>Charlie Brown</td><td>$456.78</td><td><Badge variant="success">Delivered</Badge></td></tr>
					</tbody>
				</Table>
			</TableResponsive>
		</Card>
	</Column>

	<Column size="100" lg="1-3">
		<Card titleText="Recent Activity">
			<ActivityFeed>
				<ActivityFeedItem timeText="2 min ago">
					{#snippet icon()}
						<img src="https://ui-avatars.com/api/?name=John+D&background=0D8ABC&color=fff&size=32" alt="JD" style="border-radius: 50%;" />
					{/snippet}
					<strong>John Doe</strong> placed order #1006
				</ActivityFeedItem>
				<ActivityFeedItem timeText="15 min ago">
					{#snippet icon()}
						<img src="https://ui-avatars.com/api/?name=Jane+S&background=28a745&color=fff&size=32" alt="JS" style="border-radius: 50%;" />
					{/snippet}
					<strong>Jane Smith</strong> updated her profile
				</ActivityFeedItem>
				<ActivityFeedItem timeText="1 hour ago">
					{#snippet icon()}
						<img src="https://ui-avatars.com/api/?name=Bob+J&background=dc3545&color=fff&size=32" alt="BJ" style="border-radius: 50%;" />
					{/snippet}
					<strong>Bob Johnson</strong> cancelled order #998
				</ActivityFeedItem>
			</ActivityFeed>
		</Card>

		<Card titleText="Quick Actions" class="mt-4">
			<QuickActions>
				<Button variant="primary">
					{#snippet icon()}__ICON:plus__{/snippet}
					New Order
				</Button>
				<Button variant="secondary">
					{#snippet icon()}__ICON:user-plus__{/snippet}
					Add User
				</Button>
				<Button variant="info">
					{#snippet icon()}__ICON:file-export__{/snippet}
					Export
				</Button>
				<Button variant="success">
					{#snippet icon()}__ICON:chart-bar__{/snippet}
					Reports
				</Button>
			</QuickActions>
		</Card>
	</Column>
</Grid>

__PROJECT_INFO__
