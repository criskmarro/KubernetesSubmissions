const generateLog = () => { const randomHash = Math.random().toString(36).substring(2); 
    const timestamp = new Date().toISOString(); 
    console.log(`${timestamp}: ${randomHash}`); 
}; 
setInterval(generateLog, 5000);