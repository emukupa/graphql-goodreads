
const fetch = require('node-fetch');
const xml2js_promise = require('node-xml2js-promise');
const { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
require("dotenv").config()
const KEY = process.env.KEY;

// const superagent = require('superagent');
//const id = 2345;
// superagent.get(`https://www.goodreads.com/author/show.xml?id=${id}&key=${KEY}`)
// .then(res=> {
//   const data = Buffer.from(res.body, 'binary').toString('utf-8');
//   console.log(data)
// })
// .catch(err => console.log(err))

/*
const id = 1431
const result = fetch(`https://www.goodreads.com/author/show.xml?id=${id}&key=${KEY}`)
.then(response=> response.text())
.then(xml2js_promise)
.catch(err=> console.log(err))

result.then(res => {
  //console.log(res.GoodreadsResponse.Request)
  console.log(res.GoodreadsResponse.author)
})
*/
const BookType = new GraphQLObjectType({
  name: "Books",
  description: "",
  fields: () =>({
    isbn: {
      type: GraphQLString,
      resolve: res => res.isbn[0]
    },
    isbn13: {
      type: GraphQLString,
      resolve: res => res.isbn13[0]
    },
    title: {
      type: GraphQLString,
      resolve: res => res.title[0]
    },
    title_without_series: {
      type: GraphQLString,
      resolve: res => res.title_without_series[0]
    },
    uri: {
      type: GraphQLString,
      resolve: res => res.uri[0]
    },
    image_url: {
      type: GraphQLString,
      resolve: res => res.image_url[0]
    },
    description: {
      type: GraphQLString,
      resolve: res => res.description[0]
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "",
  fields: () =>({
    id: {
      type: GraphQLInt,
      resolve: xml =>
        xml.GoodreadsResponse.author[0].id[0]
    },
    name: {
      type: GraphQLString,
      resolve: xml =>
        xml.GoodreadsResponse.author[0].name[0]
    },
    link: {
      type: GraphQLString,
      resolve: xml =>
        xml.GoodreadsResponse.author[0].link[0]
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: xml =>
        xml.GoodreadsResponse.author[0].books[0].book
    }


  })
});

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    description: "",
    fields: () => ({
      author: {
        type: AuthorType,
        args: {
          id: {
            type: GraphQLInt
          }
        },
        resolve: (root, args) => fetch(`https://www.goodreads.com/author/show.xml?id=${args.id}&key=${KEY}`)
        .then(response=> response.text())
        .then(xml2js_promise)
        .catch(err=> console.log(err))
      }
    })
  })
})
