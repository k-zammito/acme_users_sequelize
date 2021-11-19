const { db, syncAndSeed, models: { User } } = require('./db')
const express = require('express')
const path = require('path')
const app = express();

app.use(express.urlencoded({ extended:false })) // use for forms 

app.get('/styles.css', (req, res) => res.sendFile(path.join(__dirname, 'styles.css')))

app.get('/', (req, res) => res.redirect('/users')); // redicted link to /users

app.delete('/users/:foo', async(req, res, next) => { // need to add button for funtionality... & methodoverride from POST to DELETE...
    try {
        const user = await User.findByPk(req.params.foo)
        await user.destroy();
        res.redirect('/users')
    }
    catch(ex) {
        next(ex)
    }
})

app.post('/users', async(req, res, next) => {
    try {
        const user = await User.create(req.body)
        res.redirect(`/users/${user.id}`)
    }
    catch(ex) {
        next(ex)
    }
})

app.get('/users', async(req, res, next) => {
    try {
        const users = await User.findAll();
        res.send(`
        <html>
            <head>
                <link rel='stylesheet' href='/styles.css'/>
            </head>
            <body>
                <h1>Users (${ users.length }) </h1>
                <form method='POST' id='user-form'> 
                    <input name='email' placeHolder='enter email'/>
                    <textarea name='bio'></textarea>
                    <button>Create User</button>
                </form>
                <ul>
                    ${ users.map( user => `
                    <li>
                        <a href='/users/${user.id}'>
                        ${ user.email }
                        </a>
                    </li>
                    `).join('')}
                </ul>
            </body>
        </html>
        `);
    }
    catch(ex) {
        next(ex);
    }
});

app.get('/users/:foo', async(req, res, next) => {
    try {
        const user = await User.findByPk(req.params.foo);
        const users = await User.findAll();
        res.send(`
        <html>
            <head>
                <link rel='stylesheet' href='/styles.css'/>
            </head>
            <body>
                <h1>Users ${ users.length } </h1>
                <a href='/users/'>
                ${ user.email }
                </a>
                <p>
                ${ user.bio }
                </p>
            </body>
        </html>
        `);
    }
    catch(ex) {
        next(ex);
    }
});

const init = async() => {    
    try { 
        await syncAndSeed()
        const port = process.env.PORT || 3000;
        app.listen(port, ()=> console.log(`listening on port ${port}`))
    }
    catch(ex) {
        console.log(ex);
    }
}

init(); 