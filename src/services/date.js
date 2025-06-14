// utils/date.js

export const formatDateForBackend = (isoDateString) => {
  const d = new Date(isoDateString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const isSameDate = (d1, d2) => {
  if (!d1 || !d2) return false;

  const parseDate = (dateStr) => {
    if (dateStr instanceof Date || dateStr.includes('T')) {
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('-');
      return `${year}-${month}-${day}`;
    }

    return dateStr;
  };

  return parseDate(d1) === parseDate(d2);
};
