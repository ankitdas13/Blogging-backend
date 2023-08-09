export const typeDef = `
 type Post {
    id: String
    content: String
    imageUrl: String
    authorId: String
    createdAt: String
    updatedAt: String
    author : Author
 }

 type Author {
   firstName: String
   lastName: String
   profileImageUrl: String
   email:String
 }

 input InputPost {
   content: String
   imageUrl: String
 }
`