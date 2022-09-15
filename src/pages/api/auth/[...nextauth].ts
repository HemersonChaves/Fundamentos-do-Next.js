import { query as consulta_bd } from "faunadb";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { fauna } from "../../../services/fauna";


export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: process.env.SIGNING_KEY,
  callbacks: {
    async session({ session }) {
      try {
        const userActiveSubscription = await fauna.query(
          consulta_bd.Get(
            consulta_bd.Intersection([
              consulta_bd.Match(
                consulta_bd.Index("subscription_by_user_ref"),
                consulta_bd.Select(
                  "ref",
                  consulta_bd.Get(
                    consulta_bd.Match(
                      consulta_bd.Index(
                        "user_by_email"),
                        consulta_bd.Casefold(session.user.email)
                      )
                    )
                  )
                
              ),
              consulta_bd.Match(
                consulta_bd.Index("subscription_by_status"),
                "active"
              )
            ])
          )
        )
        return {
          ...session,
          activeSubscription: userActiveSubscription
        }
      } catch (error) {
        return{
          ...session,
          activeSubscription: null,
        }
      }


    },
    async signIn({ user, account, profile }) {
      const { email } = user;
      try {
        await fauna.query(
          consulta_bd.If(
            consulta_bd.Not(
              consulta_bd.Exists(
                consulta_bd.Match(
                  consulta_bd.Index("user_by_email"),
                  consulta_bd.Casefold(user.email)
                )
              )
            ),
            consulta_bd.Create(
              consulta_bd.Collection("users"),
              { data: { email } }
            ),
            consulta_bd.Get(

              consulta_bd.Match(
                consulta_bd.Index("user_by_email"),
                consulta_bd.Casefold(user.email)
              )
            )
          )

        )
        // console.log(user);
        return true
      } catch (err) {
        console.log(err)
        return false;
      }
    },
  }
})