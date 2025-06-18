// 📁 utils/date.js

export const formatDateForBackend = (isoDateString) => {
  const d = new Date(isoDateString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const isSameDate = (d1, d2) => {
  const format = (dateStr) => {
    if (!dateStr) return null;

    if (typeof dateStr === 'string' && dateStr.includes('T')) {
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    } else if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [dd, mm, yyyy] = dateStr.split('-');
      return `${yyyy}-${mm}-${dd}`;
    }
    return dateStr;
  };

  return format(d1) === format(d2);
};

export const parseCustomDate = (str) => {
  if (!str) return null;
  if (str.includes('T')) return new Date(str);
  if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
    const [day, month, year] = str.split('-');
    return new Date(`${year}-${month}-${day}`);
  }
  return new Date(str);
};
