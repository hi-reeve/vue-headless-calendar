<script setup lang="ts">
import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	startOfMonth,
	startOfToday,
	startOfWeek,
	isSameMonth,
	format,
	isSameDay
} from 'date-fns';
import { provide, ref, computed, watch, type Ref } from 'vue';
import type { CalendarProps } from './props';

const props = withDefaults(defineProps<CalendarProps>(), {
	as: 'div',
	selectedDates: () => [],
	disabledDates: () => [],
	events: () => ({})
});

const emit = defineEmits<{
	'update:selectedDate': [date: Date | undefined];
	'update:selectedDates': [dates: Date[]];
	'date-select': [date: Date];
	'date-deselect': [date: Date];
	'month-change': [date: Date];
}>();

const date = ref<Date>(props.startDate ?? startOfToday());
const selectedDate = ref<Date | undefined>(props.selectedDate);
const selectedDates = ref<Date[]>([...props.selectedDates]);
const disabledDates = ref<Date[]>([...props.disabledDates]);

const startDate = computed(() => startOfWeek(startOfMonth(date.value)));
const endDate = computed(() => endOfWeek(endOfMonth(date.value)));

const dateInterval = computed(() => 
	eachDayOfInterval({
		start: startDate.value,
		end: endDate.value,
	})
);

const daysWithMetadata = computed(() => {
	return dateInterval.value.map(dayDate => {
		const dateKey = format(dayDate, 'yyyy-MM-dd');
		return {
			date: dayDate,
			isCurrentMonth: isSameMonth(dayDate, date.value),
			isSelected: selectedDate.value ? isSameDay(dayDate, selectedDate.value) : 
				selectedDates.value.some(selected => isSameDay(dayDate, selected)),
			isDisabled: disabledDates.value.some(disabled => isSameDay(dayDate, disabled)) ||
				(props.minDate && dayDate < props.minDate) ||
				(props.maxDate && dayDate > props.maxDate),
			events: props.events[dateKey] || []
		};
	});
});

const handleDateSelect = (selectedDateValue: Date) => {
	if (props.selectedDate !== undefined) {
		// Single date selection mode
		selectedDate.value = selectedDateValue;
		emit('update:selectedDate', selectedDateValue);
	} else {
		// Multiple date selection mode
		const index = selectedDates.value.findIndex(d => isSameDay(d, selectedDateValue));
		if (index === -1) {
			selectedDates.value.push(selectedDateValue);
		}
		emit('update:selectedDates', [...selectedDates.value]);
	}
	
	emit('date-select', selectedDateValue);
	props.onDateSelect?.(selectedDateValue);
};

const handleDateDeselect = (deselectedDate: Date) => {
	if (props.selectedDate !== undefined) {
		// Single date selection mode
		selectedDate.value = undefined;
		emit('update:selectedDate', undefined);
	} else {
		// Multiple date selection mode
		const index = selectedDates.value.findIndex(d => isSameDay(d, deselectedDate));
		if (index !== -1) {
			selectedDates.value.splice(index, 1);
		}
		emit('update:selectedDates', [...selectedDates.value]);
	}
	
	emit('date-deselect', deselectedDate);
	props.onDateDeselect?.(deselectedDate);
};

const navigateToMonth = (newDate: Date) => {
	date.value = newDate;
	emit('month-change', newDate);
};

// Watch for prop changes
watch(() => props.selectedDate, (newValue) => {
	selectedDate.value = newValue;
});

watch(() => props.selectedDates, (newValue) => {
	selectedDates.value = [...newValue];
});

watch(() => props.disabledDates, (newValue) => {
	disabledDates.value = [...newValue];
});

// Provide context to child components
provide<Ref<Date>>('date', date);
provide<Ref<Date | undefined>>('selectedDate', selectedDate);
provide<Ref<Date[]>>('selectedDates', selectedDates);
provide<Ref<Date[]>>('disabledDates', disabledDates);
provide<(date: Date) => void>('onDateSelect', handleDateSelect);
provide<(date: Date) => void>('onDateDeselect', handleDateDeselect);
provide<(date: Date) => void>('navigateToMonth', navigateToMonth);
</script>

<template>
	<component :is="props.as">
		<slot
			:date="date"
			:start-date="startDate"
			:end-date="endDate"
			:date-interval="dateInterval"
			:days-with-metadata="daysWithMetadata"
			:selected-date="selectedDate"
			:selected-dates="selectedDates"
			:disabled-dates="disabledDates"
			:navigate-to-month="navigateToMonth"
			:on-date-select="handleDateSelect"
			:on-date-deselect="handleDateDeselect"
		/>
	</component>
</template>

<style scoped></style>
