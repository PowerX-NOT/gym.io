import { addMonths, addYears, format } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const calculateNextPaymentDate = (
  startDate: string | Date,
  plan: '1-month' | '3-months' | '6-months' | '1-year'
): string => {
  const date = new Date(startDate);
  
  switch (plan) {
    case '1-month':
      return formatDate(addMonths(date, 1));
    case '3-months':
      return formatDate(addMonths(date, 3));
    case '6-months':
      return formatDate(addMonths(date, 6));
    case '1-year':
      return formatDate(addYears(date, 1));
    default:
      return formatDate(addMonths(date, 1));
  }
};

export const isPaymentOverdue = (dueDate: string): boolean => {
  const today = new Date();
  const paymentDate = new Date(dueDate);
  return today > paymentDate;
};