<script setup lang="ts">
import { ref } from 'vue';
import { addDays, subDays } from 'date-fns';
import Calendar from './components/Calendar.vue';
import MonthTitle from './components/MonthTitle.vue';
import ButtonNext from './components/ButtonNext.vue';
import ButtonPrev from './components/ButtonPrev.vue';
import Day from './components/Day.vue';
import WeekHeader from './components/WeekHeader.vue';
import DateRange from './components/DateRange.vue';

// Example state for single date selection
const selectedDate = ref<Date | undefined>();

// Example state for multiple date selection  
const selectedDates = ref<Date[]>([]);

// Example disabled dates
const disabledDates = ref<Date[]>([
	addDays(new Date(), 3),
	addDays(new Date(), 7),
	subDays(new Date(), 2)
]);

// Example events
const events = ref<Record<string, any[]>>({
	'2024-01-15': [{ title: 'Meeting', color: 'blue' }],
	'2024-01-20': [{ title: 'Birthday', color: 'red' }, { title: 'Lunch', color: 'green' }]
});

// Example date range selection
const rangeStart = ref<Date | undefined>();
const rangeEnd = ref<Date | undefined>();

const handleDateSelect = (date: Date) => {
	console.log('Date selected:', date);
};

const handleDateDeselect = (date: Date) => {
	console.log('Date deselected:', date);
};

const handleRangeSelect = (start: Date, end: Date) => {
	console.log('Range selected:', start, 'to', end);
};
</script>

<template>
	<div class="app">
		<h1>Vue Headless Calendar Demo</h1>
		
		<!-- Basic Calendar with Date Selection -->
		<div class="calendar-section">
			<h2>Basic Calendar with Date Selection</h2>
			<Calendar 
				v-model:selected-date="selectedDate"
				:disabled-dates="disabledDates"
				:events="events"
				@date-select="handleDateSelect"
				@date-deselect="handleDateDeselect"
			>
				<template #default="{ daysWithMetadata }">
					<div class="calendar-header">
						<ButtonPrev />
						<MonthTitle />
						<ButtonNext />
					</div>
					
					<div class="calendar-grid">
						<WeekHeader />
						<Day
							v-for="day in daysWithMetadata"
							:key="day.date.toISOString()"
							:date="day.date"
							:is-current-month="day.isCurrentMonth"
							:is-selected="day.isSelected"
							:is-disabled="day.isDisabled"
							:events="day.events"
							class="calendar-day"
						/>
					</div>
				</template>
			</Calendar>
		</div>

		<!-- Calendar with Multiple Date Selection -->
		<div class="calendar-section">
			<h2>Multiple Date Selection</h2>
			<Calendar 
				v-model:selected-dates="selectedDates"
				:disabled-dates="disabledDates"
			>
				<template #default="{ daysWithMetadata }">
					<div class="calendar-header">
						<ButtonPrev />
						<MonthTitle />
						<ButtonNext />
					</div>
					
					<div class="calendar-grid">
						<WeekHeader />
						<Day
							v-for="day in daysWithMetadata"
							:key="day.date.toISOString()"
							:date="day.date"
							:is-current-month="day.isCurrentMonth"
							:is-selected="day.isSelected"
							:is-disabled="day.isDisabled"
							class="calendar-day"
						/>
					</div>
				</template>
			</Calendar>
		</div>

		<!-- Date Range Selection -->
		<div class="calendar-section">
			<h2>Date Range Selection</h2>
			<DateRange 
				v-model:start-date="rangeStart"
				v-model:end-date="rangeEnd"
				@range-select="handleRangeSelect"
			>
				<template #default="{ onDateSelect, onDateHover, isDateInRange, isDateInPreviewRange, isRangeStart, isRangeEnd }">
					<Calendar>
						<template #default="{ daysWithMetadata }">
							<div class="calendar-header">
								<ButtonPrev />
								<MonthTitle />
								<ButtonNext />
							</div>
							
							<div class="calendar-grid">
								<WeekHeader />
								<Day
									v-for="day in daysWithMetadata"
									:key="day.date.toISOString()"
									:date="day.date"
									:is-current-month="day.isCurrentMonth"
									:is-disabled="day.isDisabled"
									:class="{
										'in-range': isDateInRange(day.date),
										'in-preview-range': isDateInPreviewRange(day.date),
										'range-start': isRangeStart(day.date),
										'range-end': isRangeEnd(day.date)
									}"
									class="calendar-day"
									@click="onDateSelect(day.date)"
									@mouseenter="onDateHover(day.date)"
								/>
							</div>
						</template>
					</Calendar>
				</template>
			</DateRange>
		</div>

		<!-- Debug Info -->
		<div class="debug-section">
			<h3>Debug Info</h3>
			<p><strong>Selected Date:</strong> {{ selectedDate?.toDateString() || 'None' }}</p>
			<p><strong>Selected Dates:</strong> {{ selectedDates.map(d => d.toDateString()).join(', ') || 'None' }}</p>
			<p><strong>Range Start:</strong> {{ rangeStart?.toDateString() || 'None' }}</p>
			<p><strong>Range End:</strong> {{ rangeEnd?.toDateString() || 'None' }}</p>
		</div>
	</div>
</template>

<style scoped>
.app {
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
	font-family: Arial, sans-serif;
}

.calendar-section {
	margin-bottom: 40px;
	padding: 20px;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
}

.calendar-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
}

.calendar-grid {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 1px;
	background: #e0e0e0;
	border: 1px solid #e0e0e0;
}

.calendar-day {
	background: white;
	border: none;
	padding: 10px;
	min-height: 40px;
	cursor: pointer;
	transition: background-color 0.2s;
}

.calendar-day:hover {
	background: #f0f0f0;
}

.calendar-day.is-selected {
	background: #007bff;
	color: white;
}

.calendar-day.is-disabled {
	background: #f5f5f5;
	color: #ccc;
	cursor: not-allowed;
}

.calendar-day.is-today {
	font-weight: bold;
	background: #fff3cd;
}

.calendar-day.has-events {
	position: relative;
}

.calendar-day.has-events::after {
	content: '';
	position: absolute;
	bottom: 2px;
	right: 2px;
	width: 6px;
	height: 6px;
	background: #28a745;
	border-radius: 50%;
}

.calendar-day.in-range {
	background: #e3f2fd;
}

.calendar-day.in-preview-range {
	background: #f3e5f5;
}

.calendar-day.range-start,
.calendar-day.range-end {
	background: #2196f3;
	color: white;
}

.debug-section {
	background: #f8f9fa;
	padding: 15px;
	border-radius: 5px;
	margin-top: 20px;
}
</style>
