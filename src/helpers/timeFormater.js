function UTCtoIST(dateString, options = {}) {
    const defaultOptions = {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "medium",
      };
    
      const mergedOptions = { ...defaultOptions, ...options };
    
      const date = new Date(dateString);
      const formattedDate = date.toLocaleString("en-US", mergedOptions);
    
      return formattedDate;
  }
  
  

  export default UTCtoIST;