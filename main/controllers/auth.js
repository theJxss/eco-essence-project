const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require('nodemailer');

// const sendgridTransport = require('nodemailer-sendgrid-transport');
// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       api_key:
//         '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'
//     }
//   })
// );

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'joseluizsff@gmail.com',
    pass: 'xmlv nwkj eafv arjj' // Use App Password se necessário.
  }
});

exports.getProfile = (req, res, next) => {
  req.user.populate('cart.items.productId')
    .then(user => {
      const cartProds = user.cart.items
      console.log('Fetched User Products in Cart: ' + cartProds)
      res.render('auth/profile', {
        title: 'EcoEssence | Perfil',
        nav: true,
        end: true,
        style: 'profile.css',
        user: req.user,
        cartProds: cartProds
      })
  })
}

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    title: 'EcoEssence | Cadastro',
    style: 'auth.css',
    nav: true,
    end: true,
    errorMessage: message
  }) 
}

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    title: 'EcoEssence | Login',
    style: 'auth.css',
    nav: true,
    end: true,
    errorMessage: message
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    title: 'Login | Resetar senha',
    style: 'auth.css',
    nav: true,
    end: true,
    errorMessage: message
  });
}

exports.postSignup = (req, res, next) => {
  const name = req.body.username
  const email = req.body.email;
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash(
          'error',
          'E-Mail já existente, por favor, utilize outro.'
        );
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
          return transporter.sendMail({
            to: email,
            from: 'joseluizsff@gmail.com',
            subject: 'Cadastro realizado',
            text: 'Sua conta no EcoEssence Market foi realizada com sucesso!'
          })
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'E-Mail ou senha inválidos.');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            transporter.sendMail({
              to: email,
              from: 'joseluizsff@gmail.com',
              subject: 'Login realizado',
              text: 'Seu login na EcoEssence Market foi feita com sucesso!'
            })
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'E-Mail ou senha inválidos.');
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

