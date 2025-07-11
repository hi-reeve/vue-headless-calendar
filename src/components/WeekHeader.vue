<script setup lang="ts">
import { computed } from 'vue';
import { format, startOfWeek, addDays } from 'date-fns';
import type { WeekHeaderProps } from './props';

const props = withDefaults(defineProps<WeekHeaderProps>(), {
	weekFormat: 'EEEEE',
	weekStartsOn: 0,
	as: 'div'
});

const weekDays = computed(() => {
	const start = startOfWeek(new Date(), { weekStartsOn: props.weekStartsOn });
	const days = [];
	
	for (let i = 0; i < 7; i++) {
		const day = addDays(start, i);
		days.push({
			date: day,
			formatted: format(day, props.weekFormat),
			fullName: format(day, 'EEEE')
		});
	}
	
	return days;
});
</script>

<template>
	<component :is="props.as">
		<slot :week-days="weekDays">
			<div 
				v-for="day in weekDays" 
				:key="day.fullName"
				:title="day.fullName"
			>
				{{ day.formatted }}
			</div>
		</slot>
	</component>
</template>

<style scoped></style>