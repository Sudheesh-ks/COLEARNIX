import userModel from "../models/userModel";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        },
        async (accessToken, refreshToken, profile: Profile, done) => {
            try {
                const email = profile.emails?.[0].value;
                if (!email) {
                    return done(new Error('No email found in Google profile'), undefined);
                }

                const user = await userModel.findOne({ email });

                if(user){
                    if(!user.googleId){
                        user.googleId = profile.id;
                        await user.save();
                    }
                    return done(null, user);
                }else{
                    const newuser = new userModel({
                        name: profile.displayName,
                        email,
                        googleId: profile.id,
                    });
                    await newuser.save();
                    return done(null, newuser);
                }
        }catch (error) {
                return done(error as Error, undefined);
        }
    }
    )
);


passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    userModel
        .findById(id)
        .then((user) => done(null, user))
        .catch((err) => done(err, null));
});


export default passport;