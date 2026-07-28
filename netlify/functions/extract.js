exports.handler = async (event) => {

  const url = event.queryStringParameters.url;

  if (!url) {
    return {
      statusCode:400,
      body:"Missing url"
    };
  }

  try {

    const res = await fetch(url, {
      headers:{
        "User-Agent":"Mozilla/5.0"
      }
    });

    const html = await res.text();

    return {
      statusCode:200,
      headers:{
        "Access-Control-Allow-Origin":"*",
        "Content-Type":"text/html"
      },
      body:html
    };

  } catch(err){

    return {
      statusCode:500,
      body:err.toString()
    };

  }

};
