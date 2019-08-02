import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import uuid from 'uuid/v4';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import { GraphQLLocalStrategy, buildContext } from 'graphql-passport';
import { ApolloServer } from 'apollo-server-express';
import User from './User';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

const PORT = 4000;
const SESSION_SECRECT = 'bad secret';

const facebookOptions = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:4000/auth/facebook/callback',
  profileFields: ['id', 'email', 'first_name', 'last_name'],
};

const facebookCallback = (accessToken, refreshToken, profile, done) => {
  const users = User.getUsers();
  const matchingUser = users.find(user => user.facebookId === profile.id);

  if (matchingUser) {
    done(null, matchingUser);
    return;
  }

  const newUser = {
    id: uuid(),
    facebookId: profile.id,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    email: profile.emails && profile.emails[0] && profile.emails[0].value,
  };
  users.push(newUser);
  done(null, newUser);
};

passport.use(new FacebookStrategy(
  facebookOptions,
  facebookCallback,
));

passport.use(
  new GraphQLLocalStrategy((email, password, done) => {
    const users = User.getUsers();
    const matchingUser = users.find(user => email === user.email && password === user.password);
    const error = matchingUser ? null : new Error('no matching user');
    done(error, matchingUser);
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const users = User.getUsers();
  const matchingUser = users.find(user => user.id === id);
  done(null, matchingUser);
});

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

app.use(session({
  genid: (req) => uuid(),
  secret: SESSION_SECRECT,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: 'http://localhost:4000/graphql',
  failureRedirect: 'http://localhost:4000/graphql',
}));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => buildContext({ req, res, User }),
  playground: {
    settings: {
      'request.credentials': 'same-origin',
    },
  },
});

server.applyMiddleware({ app, cors: false });

app.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});