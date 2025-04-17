import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init("AbPU12YJqRHcJO4R0");

export const sendAlertEmail = async (
  to: string,
  userName: string,
  location: { latitude: number; longitude: number },
  timestamp: number
) => {
  try {
    const templateParams = {
      to_email: to,
      user_name: userName,
      alert_time: new Date(timestamp).toLocaleString(),
      location_link: `https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
      message: "Is in danger. Please checkout his/her location and reach out!"
    };

    const result = await emailjs.send(
      "service_adum5ys",
      "template_lsc3pht",
      templateParams
    );

    console.log('Email sent successfully:', result.text);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}; 