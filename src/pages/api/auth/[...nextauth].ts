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