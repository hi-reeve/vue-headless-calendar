# Vue Headless Calendar

A flexible, headless calendar component library for Vue 3 with TypeScript support. This library provides the logic and state management for calendars while giving you complete control over the rendering and styling.

## Features

- 🎯 **Headless Design**: Complete control over rendering and styling
- 📅 **Multiple Calendar Types**: Single date, multiple dates, and date range selection
- 🚫 **Disabled Dates**: Support for disabling specific dates
- 📝 **Events Support**: Attach events to specific dates
- 🎨 **Customizable**: Flexible slot-based API
- 🔧 **TypeScript**: Full TypeScript support with proper type definitions
- 📱 **Accessible**: Built with accessibility in mind
- 🪶 **Lightweight**: Minimal dependencies (only Vue 3 and date-fns)

## Installation

```bash
npm install vue-headless-calendar
# or
yarn add vue-headless-calendar
# or
pnpm add vue-headless-calendar
```

## Basic Usage

### Simple Calendar with Date Selection

```vue
<template>
  <Calendar v-model:selected-date="selectedDate">
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
        />
      </div>
    </template>
  </Calendar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Calendar, MonthTitle, ButtonPrev, ButtonNext, Day, WeekHeader } from 'vue-headless-calendar';

const selectedDate = ref<Date | undefined>();
</script>
```

### Multiple Date Selection

```vue
<template>
  <Calendar v-model:selected-dates="selectedDates">
    <template #default="{ daysWithMetadata }">
      <!-- Calendar structure -->
    </template>
  </Calendar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Calendar } from 'vue-headless-calendar';

const selectedDates = ref<Date[]>([]);
</script>
```

### Date Range Selection

```vue
<template>
  <DateRange 
    v-model:start-date="rangeStart"
    v-model:end-date="rangeEnd"
    @range-select="handleRangeSelect"
  >
    <template #default="{ onDateSelect, isDateInRange, isRangeStart, isRangeEnd }">
      <Calendar>
        <template #default="{ daysWithMetadata }">
          <Day
            v-for="day in daysWithMetadata"
            :key="day.date.toISOString()"
            :date="day.date"
            :class="{
              'in-range': isDateInRange(day.date),
              'range-start': isRangeStart(day.date),
              'range-end': isRangeEnd(day.date)
            }"
            @click="onDateSelect(day.date)"
          />
        </template>
      </Calendar>
    </template>
  </DateRange>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DateRange, Calendar, Day } from 'vue-headless-calendar';

const rangeStart = ref<Date | undefined>();
const rangeEnd = ref<Date | undefined>();

const handleRangeSelect = (start: Date, end: Date) => {
  console.log('Range selected:', start, 'to', end);
};
</script>
```

## Components

### Calendar

The main calendar component that provides date state and logic.

**Props:**
- `startDate?: Date` - Initial date for the calendar
- `selectedDate?: Date` - Currently selected date (for single selection)
- `selectedDates?: Date[]` - Currently selected dates (for multiple selection)
- `disabledDates?: Date[]` - Array of disabled dates
- `minDate?: Date` - Minimum selectable date
- `maxDate?: Date` - Maximum selectable date
- `events?: Record<string, any[]>` - Events object with date keys
- `onDateSelect?: (date: Date) => void` - Callback for date selection
- `onDateDeselect?: (date: Date) => void` - Callback for date deselection
- `as?: string` - HTML element type (default: 'div')

**Events:**
- `@date-select` - Emitted when a date is selected
- `@date-deselect` - Emitted when a date is deselected
- `@month-change` - Emitted when the month changes

**Slot Props:**
- `date: Date` - Current calendar date
- `startDate: Date` - Start date of the calendar view
- `endDate: Date` - End date of the calendar view
- `dateInterval: Date[]` - Array of all dates in the view
- `daysWithMetadata: DayMetadata[]` - Array of days with selection/disabled states

### Day

Individual day component for rendering calendar days.

**Props:**
- `date: Date` - The date this day represents
- `isCurrentMonth?: boolean` - Whether this day is in the current month
- `isSelected?: boolean` - Whether this day is selected
- `isDisabled?: boolean` - Whether this day is disabled
- `isToday?: boolean` - Whether this day is today
- `events?: any[]` - Events for this day
- `as?: string` - HTML element type (default: 'button')

### WeekHeader

Component for rendering weekday headers.

**Props:**
- `weekFormat?: string` - Format for weekday names (default: 'EEEEE')
- `weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6` - First day of the week (default: 0)
- `as?: string` - HTML element type (default: 'div')

### MonthTitle

Component for displaying the current month and year.

**Props:**
- `monthFormat?: string` - Format for the month title (default: 'MMMM yyyy')
- `as?: string` - HTML element type (default: 'div')

### ButtonNext / ButtonPrev

Navigation buttons for changing months.

**Props:**
- `as?: string` - HTML element type (default: 'button')

### DateRange

Component for handling date range selection.

**Props:**
- `startDate?: Date` - Range start date
- `endDate?: Date` - Range end date
- `onRangeSelect?: (start: Date, end: Date) => void` - Callback for range selection
- `as?: string` - HTML element type (default: 'div')

**Events:**
- `@range-select` - Emitted when a range is selected
- `@range-clear` - Emitted when the range is cleared

## Advanced Usage

### Custom Styling

Since this is a headless library, you have complete control over styling:

```vue
<style scoped>
.calendar-day {
  @apply px-3 py-2 hover:bg-gray-100 cursor-pointer;
}

.calendar-day.is-selected {
  @apply bg-blue-500 text-white;
}

.calendar-day.is-disabled {
  @apply bg-gray-200 text-gray-400 cursor-not-allowed;
}

.calendar-day.is-today {
  @apply font-bold ring-2 ring-blue-300;
}
</style>
```

### Working with Events

```vue
<template>
  <Calendar :events="events">
    <template #default="{ daysWithMetadata }">
      <Day
        v-for="day in daysWithMetadata"
        :key="day.date.toISOString()"
        :date="day.date"
        :events="day.events"
      >
        <template #default="{ dayNumber, events }">
          <div>
            <span>{{ dayNumber }}</span>
            <div v-if="events.length > 0" class="event-indicators">
              <span 
                v-for="event in events" 
                :key="event.id"
                :class="`event-dot event-${event.type}`"
              />
            </div>
          </div>
        </template>
      </Day>
    </template>
  </Calendar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { format } from 'date-fns';

const events = ref({
  [format(new Date(), 'yyyy-MM-dd')]: [
    { id: 1, title: 'Meeting', type: 'work' },
    { id: 2, title: 'Lunch', type: 'personal' }
  ]
});
</script>
```

### Conditional Disabled Dates

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { isWeekend, isBefore, startOfToday } from 'date-fns';

const disabledDates = computed(() => {
  const today = startOfToday();
  const dates = [];
  
  // Disable past dates
  for (let i = 1; i <= 30; i++) {
    const date = subDays(today, i);
    dates.push(date);
  }
  
  // Disable weekends
  for (let i = 0; i <= 30; i++) {
    const date = addDays(today, i);
    if (isWeekend(date)) {
      dates.push(date);
    }
  }
  
  return dates;
});
</script>
```

## TypeScript Support

The library is written in TypeScript and provides full type definitions:

```typescript
import type { 
  CalendarProps, 
  DayProps, 
  WeekHeaderProps, 
  DateRangeProps 
} from 'vue-headless-calendar';

// All props are fully typed
const calendarProps: CalendarProps = {
  startDate: new Date(),
  selectedDate: new Date(),
  disabledDates: [],
  onDateSelect: (date: Date) => console.log(date)
};
```

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build library
pnpm build

# Run tests
pnpm test:unit

# Run linting
pnpm lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.
