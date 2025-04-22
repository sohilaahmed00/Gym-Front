export const validateFullName = (name) => {
  const regex = /^[a-zA-Z\s]*$/;
  if (!name) return "Please enter your full name";
  if (!regex.test(name)) return "Please enter a valid name (no numbers or special characters)";
  return "";
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Please enter your email address";
  if (!regex.test(email)) return "Please enter a valid email address";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Please enter a password";
  if (password.length < 8) return "Password must be at least 8 characters long";
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
    return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
  }
  return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
};

export const validatePhone = (phone) => {
  if (!phone) return "";
  const regex = /^\+?[1-9]\d{1,14}$/;
  if (!regex.test(phone)) return "Please enter a valid phone number";
  return "";
};

export const validateBirthDate = (date) => {
  if (!date) return "Please enter your date of birth";
  const birthDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  if (age < 18) return "You must be at least 18 years old";
  return "";
};

export const validateGender = (gender) => {
  if (!gender) return "Please select your gender";
  return "";
};

export const validateHeight = (height) => {
  if (!height) return "Please enter your height";
  if (isNaN(height) || height <= 0) return "Please enter a valid height";
  return "";
};

export const validateWeight = (weight) => {
  if (!weight) return "Please enter your weight";
  if (isNaN(weight) || weight <= 0) return "Please enter a valid weight";
  return "";
};

export const validateActivityLevel = (level) => {
  if (!level) return "Please select your activity level";
  return "";
};

export const validateGoal = (goal) => {
  if (!goal) return "Please select your goal";
  return "";
};

export const validateTerms = (terms) => {
  if (!terms) return "You must agree to the Terms & Conditions";
  return "";
}; 