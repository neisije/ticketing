import mongoose from "mongoose";
import { Password } from "../services/password";

// Interface that describes the properties required to create a new user
interface userAttrs {
  email: string;
  password: string;
}

// Interface that describes the properties that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: userAttrs) : UserDoc;
}

// Interface that describes the properties that the user document has
interface UserDoc extends mongoose.Document {
  email: string;
  password : string;
}

export class UserClass implements userAttrs {
  public email: string = '';
  public password: string = '';

}

const userSchema = new mongoose.Schema ({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }}, {
    toJSON : {
      transform(doc, ret) {
        delete ret.password;
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false
    }
});

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  } 
  done();
});

userSchema.statics.build = ( attrs : userAttrs) => {
  return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);


export {User};
