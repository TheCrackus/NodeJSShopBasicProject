const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>My first page</title></head>');
        res.write(
            '<body>' + 
            '<form action="/message" method="POST">' + 
            '<input type="text" name="message"/>' + 
            '<button type="submit">Enviar</button>' + 
            '</form>' + 
            '</body>'
        );
        res.write('</html>');
        return res.end();
    }
    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on(
            'data',
            (chunk) => {
                body.push(chunk);
            }
        );
        req.on(
            'end',
            () => {
                const parseBody = Buffer.concat(body).toString()
                const message = parseBody.split('=')[1];
                fs.writeFile(
                    'message.txt', 
                    message,
                    (err) => {
                        res.statusCode = 302;
                        res.setHeader('Location', '/');
                        return res.end(); 
                    }
                );
            }
        );
    }
};

module.exports = {
    handler: requestHandler
};
