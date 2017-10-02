var ObjectId = require('mongodb').BSONNative.ObjectID;

exports.User = {
    user1: {
        _id: new ObjectId(),
        firstName: 'Birhanu',
        lastName: 'Hailemariam',
        email: 'text@test.com',
        password: 'pw'
    },
    user2: {
        _id: new ObjectId(),
        name: 'George Michael',
        father: exports.User.user1._id
    }
}