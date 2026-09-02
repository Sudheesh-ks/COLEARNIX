export const formatters = {
  date: (date: string | Date | undefined): string => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  },

  capitalize: (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  number: (num: number): string => {
    return new Intl.NumberFormat().format(num);
  },
};
