const express = require('express');
const morgan = require('morgan');
const graphqlHTTP = require('express-graphql')

const app = express()
app.use(morgan('dev'))

app.use('/graphql', graphqlHTTP({
  graphiql: true
}))

const PORT = process.env.PORT || 8000;

app.listen(PORT, err=> {
  if(err) return console.console.log((`Error: ${err}`));
  console.log( `App running on port ${PORT}`);
})
