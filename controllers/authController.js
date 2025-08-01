const { where } = require('sequelize');
const { User } = require('../models');
const bcrypt = require('bcrypt');

class authController {

    static showRegister(req, res) {
        res.render('register');
    }

    static async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const hash = await bcrypt.hash(password, 10);

            await User.create({ name, email, password: hash });
            res.redirect('/login')
        } catch (error) {
            req.flash('error', 'Email might already be used');
            res.redirect('/register')
        }
    }

    static showLogin(req, res) {
        res.render('login')
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            console.log('Email:', email);
            console.log('Password (plain):', password);

            const user = await User.findOne({ where: { email } });

            if (!user) {
                console.log('Email tidak ditemukan');
                req.flash('error', 'Email salah');
                return res.redirect('/login');
            }

            console.log('Password di database (hash):', user.password);

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                console.log('Password tidak cocok');
                req.flash('error', 'Password salah');
                return res.redirect('/login');
            }
            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            };

            console.log('Login berhasil:', req.session.user);


            res.redirect('/home')
        } catch (error) {
            console.log('Login gagal');
            res.send(error)

        }
    }

    static logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
                return res.send('Gagal logout');
            }
            res.redirect('/login');
        });
    }

}

module.exports = authController