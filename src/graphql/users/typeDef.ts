export const typeDefs = `
type User {
    id: String
    firstName: String
    lastName: String
    profileImageUrl: String
    email:String
    password: String
}

input UserInput {
    firstName: String!
    lastName: String!
    email:String!
    password: String!
}

input UserProfileInput {
    id:String!
    firstName: String
    lastName: String
    profileImageUrl: String
    password: String
}
`