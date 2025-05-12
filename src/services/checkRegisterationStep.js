

export const CheckRegistrationProgress = () => {
    const step1Completed = localStorage.getItem('step1Completed');
    const step2Completed = localStorage.getItem('step2Completed');
    const step3Completed = localStorage.getItem('step3Completed');

  
    if (step1Completed && !step2Completed) {
      return 'step2'; 
    } else if (step2Completed && !step3Completed) {
        return 'step3'; 
      } else if (step3Completed) {
        return 'completed'; 
      }else{
        return 'step1'
      }
  };
  
  export const SaveRegistrationProgress = (step) => {
    if (step === 1) {
      localStorage.setItem('step1Completed', 'true');
    } else if (step === 2) {
      localStorage.setItem('step2Completed', 'true');
    } else if (step === 3) {
        localStorage.setItem('step3Completed', 'true');
      }
  };
  