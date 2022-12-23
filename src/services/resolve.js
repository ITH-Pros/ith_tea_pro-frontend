export async function resolve(promise) {
    //when headers needed , transfer them from promises
    const resolved = {
      data: null,
      error: null
    };
  
    try {
      resolved.data = await promise;
    } catch(e) {
      resolved.error = e;
    }
    console.log(resolved)
  
    return resolved;
  }