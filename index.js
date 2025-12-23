//#region Part1: Core Modules
const path = require("path");
const fs = require("fs");
const zlib = require("zlib");
const { pipeline } = require("stream");

// Part1: Core Modules ( 1.5 Grades)
// 1. Use a readable stream to read a file in chunks and log each chunk. (0.5 Grade)
// • Input Example: "./big.txt"
// • Output Example: log each chunk

// const filePath = path.resolve("./big.txt");
// const readableStream = fs.createReadStream(filePath, { encoding: "utf-8" });

// readableStream.on("data", (chunk) => {
//   console.log(chunk);
// });
// // end
// readableStream.on("end", () => {
//   console.log("End of stream.");
// });
// // error
// readableStream.on("error", (err) => {
//   console.log("Error!", err.message);
// });

// // 2. Use readable and writable streams to copy content from one file to another. (0.5 Grade)
// // • Input Example: "./source.txt", "./dest.txt"
// // • Output Example: File copied using streams

// const sourcePath = path.resolve("source.txt");
// const destPath = path.resolve("dest.txt");
// const sourceStream = fs.createReadStream(sourcePath);
// const destStream = fs.createWriteStream(destPath);

// // destStream.write("File copied using streams");
// // sourceStream.pipe(destStream);

// sourceStream.on("data", (chunk) => {
//   console.log("write");
//   destStream.write(chunk);
// });

// destStream.on("error", (err) => {
//   console.log("Error!", err.message);
// });
// sourceStream.on("error", (err) => {
//   console.log("Error!", err.message);
// });

// // 3. Create a pipeline that reads a file, compresses it, and writes it to another file. (0.5 Grade)
// // • Input Example: "./data.txt", "./data.txt.gz"

// const inputFile = "./data.txt";
// const outputFile = "./data.txt.gz";

// // Create streams
// const readStream = fs.createReadStream(inputFile);
// const gzipStream = zlib.createGzip();
// const writeStream = fs.createWriteStream(outputFile);

// // Create pipeline
// pipeline(readStream, gzipStream, writeStream, (err) => {
//   if (err) {
//     console.error("Pipeline failed:", err.message);
//   } else {
//     console.log("File compressed successfully using pipeline");
//   }
// });

//#endregion
//--------------------------------------------------------------------
//#region Part2: Simple CRUD Operations Using HTTP

const http = require("http");
let port = 3000;
// const path = require("psth");
// const fs = require("fs");

const usersPath = path.resolve("./users.json");
const readFile = fs.readFileSync(usersPath, { encoding: "utf-8" });
const user = JSON.parse(readFile);
console.log(user);

const server = http.createServer((req, res) => {
  const { url, method } = req;
  if ((url == "/addUser", method == "POST")) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      body = JSON.parse(body);

      const { email } = body;
      const userEmail = user.find((value) => {
        return value.email == email;
      });

      if (userEmail) {
        res.writeHead(400, { "content-type": "teat.plain" });
        res.write("Email already exists");
        return res.end();
      }

      user.push(body);
      fs.writeFileSync(path.resolve("./users.json"), JSON.stringify(user));

      res.writeHead(200, { "content-type": "application/json" });
      res.write("User added successfully");
      //   res.write(JSON.stringify(user));
      res.end();
    });
  } else if (url.includes("/updateUser") && method == "PATCH") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      body = JSON.parse(body);
      const id = url.split("/")[2];
      const userId = user.find((value) => {
        return value.id == id;
      });

      if (userId == undefined) {
        res.writeHead(400, { "content-type": "text/plain" });
        res.write("User ID not found");
        return res.end();
      }

      const { name, age } = body;
      userId.name = name;
      userId.age = age;

      fs.writeFileSync(path.resolve("./users.json"), JSON.stringify(user));

      res.writeHead(201, { "content-type": "text/plain" });
      res.write("User age updated successfully.");
      res.end();
    });
  } else if (url.includes("/deleteUser") && method == "DELETE") {
    const id = url.split("/")[2];
    const userId = user.findIndex((ele) => {
      return ele.id == id;
    });

    if (userId == -1) {
      res.writeHead(400, { "content-type": "text/plain" });
      res.write("User ID not found");
      return res.end();
    }

    user.splice(userId, 1);

    fs.writeFileSync(path.resolve("./users.json"), JSON.stringify(user));

    res.writeHead(201, { "content-type": "text/plain" });
    res.write("User deleted successfully.");
    res.end();
  } else if (url == "/allUser" && method == "GET") {
    res.writeHead(200, { "content-type": "application/json" });
    res.write(JSON.stringify(user));
    return res.end();
  } else if (url.includes("/user") && method == "GET") {
    const id = url.split("/")[2];
    const userId = user.findIndex((ele) => {
      return ele.id == id;
    });

    if (userId == -1) {
      res.writeHead(400, { "content-type": "text/plain" });
      res.write("User not found");
      return res.end();
    }

    const userById = user[userId];
    console.log(userById);
    fs.writeFileSync(path.resolve("./users.json"), JSON.stringify(user));

    res.writeHead(201, { "content-type": "application/json" });
    res.write(JSON.stringify(userById));
    res.end();
  } else {
    res.writeHead(400, { "content-type": "text/plain" });
    res.write("Invalid url or method");
    res.end();
  }
});

server.listen(port, () => {
  console.log("Server is running on port: " + port);
});

server.on("error", (err) => {
  console.log(err);

  if (err.code == "EADDRINUSE") {
    port += 1;
    server.listen(port);
  }
});

//#endregion
//--------------------------------------------------------------------
//#region Part3: Node Internals
// 1. What is the Node.js Event Loop?
// Organizing the execution of the flow code
// 2. What is Libuv and What Role Does It Play in Node.js?
// libuv هي مكتبة إدخال/إخراج غير متزامنة متعددة المنصات، طُوّرت في الأصل لـ Node.js.
// تتولى libuv العمليات المعقدة غير المتزامنة في الخلفية.
/// Role
/*
timerOperations = [] // setTimeout setIntervel setImmediate
longRunningOperations = [] // fs - crypto
osOperations = [] // http request

1- check any timer to execute (or finished) (setTimeout setIntervel)
2- check any timer longRunningOperations or  osOperations finished 
3- await
4- check setImmediate
5- check any close event
6- next tick() => next iteration

while(timerOperations.length != 0 ||
longRunningOperations.length != 0 || 
osOperations.length != 0){
}
*/

// 3. How Does Node.js Handle Asynchronous Operations Under the Hood?
/*
Node.js handles asynchronous operations by delegating I/O to the OS or libuv’s thread pool, 
then using the event loop to execute callbacks without blocking the single JavaScript thread.
*/

// 4. What is the Difference Between the Call Stack, Event Queue, and Event Loop in Node.js?
/*
Call Stack =>	Executes JS functions	(V8)
Event Queue =>	Stores async callbacks	(libuv)
Event Loop =>	Orchestrates execution	(libuv)

The call stack executes code, the event queue stores async callbacks,
 and the event loop moves callbacks from the queue to the stack when it’s safe to run them.
*/

// 5. What is the Node.js Thread Pool and How to Set the Thread Pool Size?
/*
4 threads => (file system - crypto - compression - dns)
Set the Thread Pool Size => UV_THREADPOOL_SIZE

-- Thread Pool Works
JS calls an async API
Node.js hands the task to libuv
libuv assigns it to a worker thread
Task completesb
Callback/Promise is queued
Event loop executes it on the JS thread
*/

// 6. How Does Node.js Handle Blocking and Non-Blocking Code Execution?

//#endregion
