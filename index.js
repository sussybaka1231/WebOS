const os = require('os');
const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.write("Welcome to the home of WebOS!\nVisit /raminfo to see RAM info\nVisit /log to log text into console!")
        res.end();
    }
    else if (req.url === '/raminfo') {
        res.write(`${os.freemem() / 1024 / 1024 / 1024} GB of free memory\n${os.totalmem() / 1024 / 1024 / 1024} GB of RAM found`);
        res.end();
    }
    else if (req.url.startsWith('/log:')) {
        console.log(decodeURIComponent(req.url.substring(5)));
        res.write("Done!");
        res.end();
    }
    else if (req.url.startsWith("/vd:")) {
        fs.readdir(decodeURIComponent(req.url.substring(4)), (err, files) => {
            if (err) {
                res.write("Error: Target not found.");
                res.end();
            }
            else {
                res.write(`Result: ${files.join(", ")}`);
                res.end();
            }
        });
    }
    else if (req.url.startsWith("/rfc:")) {
        fs.readFile(decodeURIComponent(req.url.substring(5)), { encoding: 'utf8' }, (err, data) => {
            if (err) {
                res.write("Error: Target not found.");
                res.end();
            }
            else {
                res.write(data);
                res.end();
            }
        });
    }
    else if (req.url.startsWith("/overwritefile:")) {
        const fixedReqUrl = decodeURIComponent(req.url.substring(15)).split(",")
        fs.writeFile(fixedReqUrl[0], fixedReqUrl.slice(1).join(","), (err) => {
            if (err) {
                res.write("An error occured.");
                res.end();
            }
            else {
                res.write("Success!");
                res.end();
            }
        });
    }
    else if (req.url.startsWith("/appendfile:")) {
        const fixedReqUrl = decodeURIComponent(req.url.substring(12)).split(",")
        fs.appendFile(fixedReqUrl[0], fixedReqUrl.slice(1).join(","), (err) => {
            if (err) {
                res.write("An error occured.");
                res.end();
            }
            else {
                res.write("Success!");
                res.end();
            }
        });
    }
    else if (req.url == '/exit') {
        res.write("Exiting server in 1 second...");
        res.end();
        setTimeout(1000, process.exit(0));
    }
});

server.listen(8);

console.log('Listening on port 8...');