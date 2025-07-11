<script setup lang="ts">
import { ref, computed, provide, type Ref } from 'vue';
import { isSameDay, isWithinInterval, isAfter, isBefore } from 'date-fns';
import type { DateRangeProps } from './props';

const props = withDefaults(defineProps<DateRangeProps>(), {
	as: 'div'
});

const emit = defineEmits<{
	'update:startDate': [date: Date | undefined];
	'update:endDate': [date: Date | undefined];
	'range-select': [start: Date, end: Date];
	'range-clear': [];
}>();

const startDate = ref<Date | undefined>(props.startDate);
const endDate = ref<Date | undefined>(props.endDate);
const hoverDate = ref<Date | undefined>();
const isSelectingRange = ref(false);

const isValidRange = computed(() => {
	return startDate.value && endDate.value && 
		(isSameDay(startDate.value, endDate.value) || isAfter(endDate.value, startDate.value));
});

const previewRange = computed(() => {
	if (!startDate.value || !hoverDate.value || endDate.value) return null;
	
	const start = startDate.value;
	const end = hoverDate.value;
	
	return {
		start: isBefore(start, end) ? start : end,
		end: isAfter(start, end) ? start : end
	};
});

const handleDateSelect = (date: Date) => {
	if (!isSelectingRange.value) {
		// Start new range selection
		startDate.value = date;
		endDate.value = undefined;
		isSelectingRange.value = true;
		emit('update:startDate', date);
		emit('update:endDate', undefined);
	} else {
		// Complete range selection
		if (startDate.value && isSameDay(startDate.value, date)) {
			// Same date selected, treat as single day range
			endDate.value = date;
		} else if (startDate.value && isAfter(date, startDate.value)) {
			// Valid end date
			endDate.value = date;
		} else if (startDate.value && isBefore(date, startDate.value)) {
			// Swap dates if end is before start
			endDate.value = startDate.value;
			startDate.value = date;
		}
		
		isSelectingRange.value = false;
		emit('update:startDate', startDate.value);
		emit('update:endDate', endDate.value);
		
		if (startDate.value && endDate.value) {
			emit('range-select', startDate.value, endDate.value);
			props.onRangeSelect?.(startDate.value, endDate.value);
		}
	}
};

const handleDateHover = (date: Date) => {
	if (isSelectingRange.value) {
		hoverDate.value = date;
	}
};

const clearRange = () => {
	startDate.value = undefined;
	endDate.value = undefined;
	hoverDate.value = undefined;
	isSelectingRange.value = false;
	emit('update:startDate', undefined);
	emit('update:endDate', undefined);
	emit('range-clear');
};

const isDateInRange = (date: Date) => {
	if (!startDate.value || !endDate.value) return false;
	return isWithinInterval(date, { start: startDate.value, end: endDate.value });
};

const isDateInPreviewRange = (date: Date) => {
	if (!previewRange.value) return false;
	return isWithinInterval(date, { start: previewRange.value.start, end: previewRange.value.end });
};

const isRangeStart = (date: Date) => {
	return startDate.value && isSameDay(date, startDate.value);
};

const isRangeEnd = (date: Date) => {
	return endDate.value && isSameDay(date, endDate.value);
};

// Provide context to child components
provide<Ref<Date | undefined>>('rangeStartDate', startDate);
provide<Ref<Date | undefined>>('rangeEndDate', endDate);
provide<Ref<Date | undefined>>('hoverDate', hoverDate);
provide<Ref<boolean>>('isSelectingRange', isSelectingRange);
provide<(date: Date) => void>('onRangeDateSelect', handleDateSelect);
provide<(date: Date) => void>('onRangeDateHover', handleDateHover);
provide<() => void>('clearRange', clearRange);
provide<(date: Date) => boolean>('isDateInRange', isDateInRange);
provide<(date: Date) => boolean>('isDateInPreviewRange', isDateInPreviewRange);
provide<(date: Date) => boolean>('isRangeStart', isRangeStart);
provide<(date: Date) => boolean>('isRangeEnd', isRangeEnd);
</script>

<template>
	<component :is="props.as">
		<slot
			:start-date="startDate"
			:end-date="endDate"
			:hover-date="hoverDate"
			:is-selecting-range="isSelectingRange"
			:is-valid-range="isValidRange"
			:preview-range="previewRange"
			:on-date-select="handleDateSelect"
			:on-date-hover="handleDateHover"
			:clear-range="clearRange"
			:is-date-in-range="isDateInRange"
			:is-date-in-preview-range="isDateInPreviewRange"
			:is-range-start="isRangeStart"
			:is-range-end="isRangeEnd"
		/>
	</component>
</template>

<style scoped></style>