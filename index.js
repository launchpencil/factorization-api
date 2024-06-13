const mysql = require('mysql2');
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    console.log(req.url);

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    const queryObject = url.parse(req.url, true).query;
    /*const username = process.env.user;
    const password = process.env.pass;*/

    username='factorization'
    password='_skTZbH[xy@7VOv2'

    const connection = mysql.createConnection({
        host: '192.168.0.3',
        user: username,
        password: password,
        database: 'factorization'
    });

    if (req.url.startsWith('/factorization/fetch')) {
        const player = queryObject.name;

        connection.connect((err) => {
            if (err) {
                console.error('error connecting: ' + err.message);
                res.end('エラー,' + err.message);
                return;
            }

            const sql = "SELECT * FROM `score` WHERE `name` = ?";
            const params = [player];

            connection.query(sql, params, (err, results, fields) => {
                if (err) {
                    console.error('error querying: ' + err.stack);
                    res.write('エラー,' + err.message);
                    return;
                }

                if (results.length) {
                    res.write(String(results[0].score))
                }

                connection.end();
                res.end();
            });
        });

    } else if (req.url.startsWith('/factorization/update')) {
        const player = queryObject.name;
        const score = queryObject.score;

        connection.connect((err) => {
            if (err) {
                console.error('error connecting: ' + err.message);
                res.end('エラー,' + err.message);
                return;
            }

            const sql = `
            INSERT INTO score (name, score) VALUES (?, ?)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                score = VALUES(score)`;
            
            const params = [player, score];

            connection.query(sql, params, (err, results, fields) => {
                if (err) {
                    console.error('error querying: ' + err.stack);
                    res.write('エラー,' + err.message);
                    return;
                }

                connection.end();
                res.end();
            });
        });

    } else {
        connection.connect((err) => {
            if (err) {
                console.error('error connecting: ' + err.message);
                res.end('エラー,' + err.message);
                return;
            }

            const sql = "SELECT * FROM `score` ORDER BY score ASC";

            connection.query(sql, (err, results, fields) => {
                if (err) {
                    console.error('error querying: ' + err.stack);
                    res.write('エラー,' + err.message);
                    return;
                }

                results.forEach((user,index) => {
                    res.write(`
                        <tr>
                            <td class="user-rank">${index + 1}</td>
                            <td class="user-name">${user.name}</td>
                            <td class="user-score">${user.score}</td>
                        </tr>
                    `)
                });

                connection.end();
                res.end();
            });
        });
    }
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});