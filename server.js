const Sequelize = require('sequelize');
const faker = require('faker')
const { STRING, TEXT } = Sequelize;
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_users_db');

const User = db.define('User', { // MODELS
    email: {
        type: STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    }, 
    bio: {
        type: TEXT
    }
});

User.beforeSave(user => {
    if (!user.bio) {
        user.bio = `${user.email} BIO is ${faker.lorem.paragraphs(3)}!`
    }
})

const syncAndSeed = async() => {
    await db.sync({ force:true }); // drops/adds new tables if they already
    await User.create({ email: 'moe@gmail.com', bio: 'This is the bio for Moe'}) // creates new users with specified field
    await User.create({ email: 'lucy@yahoo.com'})
    await User.create({ email: 'ethyl@aol.com'})
};

const init = async() => {    
    try { 
        await syncAndSeed()
    }
    catch(ex) {
        console.log(ex);
    }
}

init();