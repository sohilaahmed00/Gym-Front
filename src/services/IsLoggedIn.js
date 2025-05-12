

export const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    localStorage.getItem('fullName')
    return token !== null; 
  };
  
  export const getUserId = () => {
    return localStorage.getItem('id'); 
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('fullName');
  };
  