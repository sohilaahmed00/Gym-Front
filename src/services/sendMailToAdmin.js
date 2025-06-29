import emailjs from 'emailjs-com';

export const sendMailToAdmin = async (message, role = 'user', senderName, senderEmail) => {
    
    
  const prefix = role.toLowerCase() === 'coach' ? 'From Coach: ' : 'From User: ';
  const templateParams = {
    message: prefix + message,
    senderName,
    senderEmail,
  };

  try {
    await emailjs.send(
      'service_nb0tac4',
      'template_4u94ois',
      templateParams,
      '4TBHmwTdTtOGDseSr'
    );
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
};
