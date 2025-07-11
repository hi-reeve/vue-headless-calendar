<script setup lang="ts">
import { inject, computed, ref, type Ref } from 'vue';
import { format, isSameDay, isToday } from 'date-fns';
import type { DayProps } from './props';

const props = withDefaults(defineProps<DayProps>(), {
	as: 'button',
	isCurrentMonth: true,
	isSelected: false,
	isDisabled: false,
	isToday: false,
	events: () => []
});

const selectedDate = inject<Ref<Date | undefined>>('selectedDate');
const selectedDates = inject<Ref<Date[]>>('selectedDates', ref([]));
const disabledDates = inject<Ref<Date[]>>('disabledDates', ref([]));
const onDateSelect = inject<(date: Date) => void>('onDateSelect');
const onDateDeselect = inject<(date: Date) => void>('onDateDeselect');

const isSelectedComputed = computed(() => {
	if (selectedDate?.value && isSameDay(props.date, selectedDate.value)) {
		return true;
	}
	return selectedDates?.value.some(date => isSameDay(props.date, date)) || false;
});

const isDisabledComputed = computed(() => {
	if (props.isDisabled) return true;
	return disabledDates?.value.some(date => isSameDay(props.date, date)) || false;
});

const isTodayComputed = computed(() => {
	return isToday(props.date);
});

const handleClick = () => {
	if (isDisabledComputed.value) return;
	
	if (isSelectedComputed.value) {
		onDateDeselect?.(props.date);
	} else {
		onDateSelect?.(props.date);
	}
};
</script>

<template>
	<component 
		:is="props.as"
		:disabled="isDisabledComputed"
		@click="handleClick"
		:class="{
			'is-current-month': props.isCurrentMonth,
			'is-selected': isSelectedComputed,
			'is-disabled': isDisabledComputed,
			'is-today': isTodayComputed,
			'has-events': props.events.length > 0
		}"
	>
		<slot 
			:date="props.date"
			:is-current-month="props.isCurrentMonth"
			:is-selected="isSelectedComputed"
			:is-disabled="isDisabledComputed"
			:is-today="isTodayComputed"
			:events="props.events"
			:day-number="format(props.date, 'd')"
		>
			{{ format(props.date, 'd') }}
		</slot>
	</component>
</template>

<style scoped></style>