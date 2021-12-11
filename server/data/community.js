const mongoCollection = require("../config/mongoCollection");
const {
  isValidUsername,
  isValidPassword,
  isValidString,
  isValidEmail,
  defaultNewUser,
  isValidObject,
  isValidObjectId,
} = require("../utils");
const community = mongoCollection.community;
const users = mongoCollection.users;
const { ObjectId } = require("mongodb");

// community collection
// [
//     {
//         creator: userID,
//         name: "CS 546",
//         replies: [{
//           creator: userID,
//           reply: "this is a reply"
// }],
//         likes: [
//             userID
// ],
//         date: date,
//     }
// ]

module.exports = {
  async getAllPosts() {
    const communityCollection = await community();
    const allPosts = await communityCollection
      .find({})
      .sort({
        date: -1,
      })
      .toArray();
    return allPosts;
  },

  async createPost(userId, name) {
    // test the userid name
    if (!userId) throw "No userId provided";
    isValidObjectId(userId);
    isValidString(name, "postName", 1);
    if (name.trim().length < 1) {
      throw "Title is blank!";
    }
    const communityCollection = await community();
    const newPost = {
      creator: userId,
      name: name,
      replies: [],
      likes: [],
      date: new Date(),
    };
    const insertInfo = await communityCollection.insertOne(newPost);
    if (insertInfo.insertedCount === 0)
      throw { message: "Could not add post", code: 500 };
    const newId = insertInfo.insertedId;
    const newPostWithId = await communityCollection.findOne({ _id: newId });
    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: userId });
    const parsedUser = {
      name: user.name,
      email: user.email,
      photo: user.photo,
    };
    return { ...newPostWithId, user: parsedUser };
  },

  async getPost(postId) {
    if (!postId) throw "No postId provided";
    isValidObjectId(postId);

    const communityCollection = await community();
    const post = await communityCollection.findOne({
      _id: ObjectId(postId),
    });
    if (!post) throw "No post found";
    return post;
  },

  async likePost(postId, userId) {
    if (!postId) throw "No postId provided";
    isValidObjectId(postId);

    if (!userId) throw "No postId provided";
    isValidObjectId(userId);
    postId = ObjectId(postId);
    userId = ObjectId(userId);

    const communityCollection = await community();
    const post = await communityCollection.findOne({
      _id: postId,
    });
    if (!post) throw "No post found";
    if (post.likes.some((id) => id.equals(userId))) {
      const newLikes = post.likes.filter((id) => {
        return !id.equals(userId);
      });
      const updateInfo = await communityCollection.updateOne(
        {
          _id: postId,
        },
        {
          $set: {
            likes: newLikes,
          },
        }
      );
      if (updateInfo.modifiedCount === 0)
        throw { message: "could not unlike post", code: 500 };
      const tempPost = await communityCollection.findOne({
        _id: postId,
      });
      return tempPost;
    }
    const updatedPost = await communityCollection.updateOne(
      {
        _id: postId,
      },
      {
        $push: { likes: userId },
      }
    );
    const tempPost = await communityCollection.findOne({
      _id: postId,
    });

    if (!updatedPost) throw "Could not like post";
    return tempPost;
  },

  async replyToPost(postId, userId, reply) {
    if (!postId) throw "No postId provided";
    isValidObjectId(postId);
    if (!reply) throw "No reply provided";
    isValidObjectId(userId);
    postId = ObjectId(postId);
    userId = ObjectId(userId);
    const communityCollection = await community();
    const post = await communityCollection.findOne({ _id: postId });
    if (!post) throw "No post found";
    const replyObject = {
      _id: ObjectId(),
      creator: userId,
      reply: reply,
    };
    if (!reply || reply.trim().length < 1) {
      throw "Reply cannot be blank!";
    }
    const updatedPost = await communityCollection.updateOne(
      {
        _id: postId,
      },
      {
        $push: { replies: replyObject },
      }
    );

    const tempPost = await communityCollection.findOne({
      _id: postId,
    });

    if (!updatedPost) throw { message: "Could not like post", code: 500 };
    return tempPost.replies;
  },

  async getRepliesById(replyId) {
    if (!replyId) throw "No replyId provided";
    isValidObjectId(replyId);
    replyId = ObjectId(replyId);

    const communityCollection = await community();
    const usersCollection = await users();
    let reply = await communityCollection.findOne({
      "replies._id": replyId,
    });
    if (!reply) throw "No reply found";
    reply = reply.replies.find((reply) => reply._id.equals(replyId));
    const userId = reply.creator;
    const userWithData = await usersCollection.findOne({ _id: userId });

    reply.user = { name: userWithData.name, photo: userWithData.photo };
    return reply;
  },

  async getPostRepliesWithUser(postId) {
    if (!postId) throw "No postId provided";
    isValidObjectId(postId);
    postId = ObjectId(postId);
    const communityCollection = await community();
    const post = await communityCollection.findOne({ _id: postId });
    if (!post) throw "No post found";
    const usersCollection = await users();
    const replies = await Promise.all(
      post.replies.map(async (reply) => {
        const user = await usersCollection.findOne({
          _id: reply.creator,
        });
        const parsedUser = {
          name: user.name,
          email: user.email,
          photo: user.photo,
        };
        return { ...reply, user: parsedUser };
      })
    );
    return replies;
  },

  async getPostsWithUser() {
    const communityCollection = await community();
    const usersCollection = await users();
    const allPosts = await communityCollection
      .find({})
      .sort({
        date: -1,
      })
      .toArray();
    const allPostsWithUser = await Promise.all(
      allPosts.map(async (post) => {
        const user = await usersCollection.findOne({
          _id: post.creator,
        });
        const parsedUser = {
          name: user.name,
          email: user.email,
          photo: user.photo,
        };
        const newPost = { ...post, user: parsedUser };
        return newPost;
      })
    );
    return allPostsWithUser;
  },
};
