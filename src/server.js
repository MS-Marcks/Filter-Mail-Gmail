const express = require('express')
const helmet = require("helmet")
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const fs = require('fs');
const path = require('path');
const app = express()

app.use(morgan('common'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(helmet());

app.use('/page', express.static(__dirname + '/public'));
app.get('/api', (req, res) => { res.send('Welcome orchestrator') })

app.post('/api/prueba', (req, res) => {
    let body = req.body;

    const name = 'src/file/' + body.target.replace(/\//g, '_').replace(/ /g,'_') + '' + Date.now() + '.xml';
    fs.writeFileSync(name, `<?xml version='1.0' encoding='UTF-8'?><feed xmlns='http://www.w3.org/2005/Atom' xmlns:apps='http://schemas.google.com/apps/2006'>`);


    if (body.emails.split('\r\n').length > 1) {
        let email = body.emails.split('\r\n');
        for (let index = 0; index < email.length; index++) {
            if (email[index] !== '') {
                fs.appendFileSync(name, `
    <entry>
		<category term='filter'></category>
		<title>Mail Filter</title>
		<content></content>
		<apps:property name='from' value='${email[index]}'/>
		<apps:property name='label' value='${body.target}'/>
		<apps:property name='shouldNeverSpam' value='true'/>
		<apps:property name='shouldAlwaysMarkAsImportant' value='true'/>
		<apps:property name='sizeOperator' value='s_sl'/>
		<apps:property name='sizeUnit' value='s_smb'/>
	</entry>
                `);
            }
        }
    }
    if (body.emails.split(',').length > 1) {
        let email = body.emails.split(',');
        for (let index = 0; index < email.length; index++) {
            if (email[index] !== '') {
                fs.appendFileSync(name, `
    <entry>
		<category term='filter'></category>
		<title>Mail Filter</title>
		<content></content>
		<apps:property name='from' value='${email[index]}'/>
		<apps:property name='label' value='${body.target}'/>
		<apps:property name='shouldNeverSpam' value='true'/>
		<apps:property name='shouldAlwaysMarkAsImportant' value='true'/>
		<apps:property name='sizeOperator' value='s_sl'/>
		<apps:property name='sizeUnit' value='s_smb'/>
	</entry>
                `);
            }
        }
    }
    fs.appendFileSync(name, `
    </feed>`);

    res.json(name.split('/')[2]);
})

app.get('/api/file/:document', (req, res) => {
    var options = {
        root: path.join(__dirname)
    };
    res.sendFile(path.join(__dirname,'file', req.params.document), function (err) {
        if (err) {
            next(err);
        } else {
            // console.log('Sent:', fileName);
        }
    });
})

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`http://localhost:${server.address().port}`)
})

