import emailjs from 'emailjs-com';

export const sendMailToAdmin = async (message, role = 'user') => {
  const prefix = role.toLowerCase() === 'coach' ? 'From Coach: ' : 'From User: ';
  const templateParams = {
    message: prefix + message,
  };

  try {
    await emailjs.send(
      'service_infchs8',
      'template_90kr0ph',
      templateParams,
      '6iwEn7o7Y23OBBYDn'
    );
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
};
