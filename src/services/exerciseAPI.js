export const fetchCategories = async () => {
  try {
    const res = await fetch('http://gymmatehealth.runasp.net/api/Categories/GetAllCategories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    console.log('✅ Categories API response:', data);
    return data;
  } catch (err) {
    console.error('❌ Error fetching categories:', err);
    return [];
  }
};

export const fetchExercises = async () => {
  try {
    const res = await fetch('http://gymmatehealth.runasp.net/api/Exercises/GetAllExercises');
    if (!res.ok) throw new Error('Failed to fetch exercises');
    const data = await res.json();
    console.log('✅ Exercises API response:', data);
    return data;
  } catch (err) {
    console.error('❌ Error fetching exercises:', err);
    return [];
  }
};
