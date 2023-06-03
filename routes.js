const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'/><button type='submit'>Send</button></form></body>"
    );
    res.write("</html>");

    //return was stated here to prevent the code from continuing, because after calling 'res.end()'
    //any other coded you call will throw an error
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];

    //'req.on("data"' is used to read data in chunks, untill the data is conplete;
    //the second argument(function) passed to it is executed for every incoming chunk
    req.on("data", (chunk) => {
      //the array body is a const but we are pushing to it because we are editing the data
      //inside the object not the object it-self
      console.log(chunk);
      body.push(chunk);
    });

    //'req.on("end")' the second arguement(function) here is executed when the data is fully
    //read(the chunks is complete)
    return req.on("end", () => {
      //this creates a new Buffer and adds all the data it read bit by bit(chuks),
      //this is allow us to read that data first in chunks, then just add it to the buffer,
      //than to wait for it to complete, to read to whole data
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];

      //the first argument to 'writeFileSync' is a path to the file
      //the second argument is what you are writing to the file
      //the 3rd arguement is a callbk-fn that executes when the file writing is done,
      //which receives an error parameter incase there is an error.
      //there is writeFile and there is writeFileSync, the difference is that
      //writeFileSync pauses code execution untill it is done writing to file while
      //writeFile doesn't
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302;

        //the code below is used to redirect to '/'
        res.setHeader("Location", "/");

        //return was stated here to prevent the code from continuing, because after calling 'res.end()'
        //any other coded you call will throw an error
        return res.end();
      });
    });
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  res.write("<body><h1>Hello from my Node.js Server!</h1></body>");
  res.write("</html>");
  res.end();
};

exports.handler = requestHandler;

//alternatives
//module.exports.handler = requestHandler;

// module.exports = { handler: requestHandler };

// module.exports =  requestHandler;
 