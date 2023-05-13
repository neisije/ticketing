import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError , validateRequest} from '@jk2b/common';
import { User } from "../models/user";
import { Password } from "../services/password";
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post("/api/users/signin",
  [
    body("email")
      .isEmail()
      .withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password")
  ],  
  validateRequest,
  async (req : Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({email});

    if (! existingUser) {
      throw new BadRequestError('Invalid credentials');
    } else {

      const passwordMatch = await Password.compare(existingUser.password,password);
      if (! passwordMatch ) {
        throw new BadRequestError('Invalid credentials');
      }

      // Generate JWT
      const userJwt = jwt.sign(
        {
        id: existingUser.id,
        email: email,
        }, 
        process.env.JWT_KEY!
      );
  
      // store it on the session object
      req.session = {
        jwt : userJwt
      };

      res.status(200).send(existingUser);
    }

});

export { router as signinRouter };
