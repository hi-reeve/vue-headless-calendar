export interface DefaultProps {
	as?: string;
}

export interface MonthProps extends DefaultProps {
	monthFormat?: string;
}

export interface CalendarProps extends DefaultProps {
	startDate?: Date;
	selectedDate?: Date;
	selectedDates?: Date[];
	disabledDates?: Date[];
	minDate?: Date;
	maxDate?: Date;
	onDateSelect?: (date: Date) => void;
	onDateDeselect?: (date: Date) => void;
	events?: Record<string, any[]>;
}

export interface DayProps extends DefaultProps {
	date: Date;
	isCurrentMonth?: boolean;
	isSelected?: boolean;
	isDisabled?: boolean;
	isToday?: boolean;
	events?: any[];
}

export interface WeekHeaderProps extends DefaultProps {
	weekFormat?: string;
	weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export interface DateRangeProps extends DefaultProps {
	startDate?: Date;
	endDate?: Date;
	onRangeSelect?: (start: Date, end: Date) => void;
}
