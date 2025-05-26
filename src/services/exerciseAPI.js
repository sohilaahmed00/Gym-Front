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

export const fetchExerciseById = async (id) => {
  try {
    const res = await fetch(`http://gymmatehealth.runasp.net/api/Exercises/GetExerciseById${id}`);
    if (!res.ok) throw new Error('Failed to fetch exercise with ID ' + id);
    const data = await res.json();
    console.log(`✅ Exercise ${id} API response:`, data);
    return data;
  } catch (err) {
    console.error(`❌ Error fetching exercise ${id}:`, err);
    return null;
  }
};
