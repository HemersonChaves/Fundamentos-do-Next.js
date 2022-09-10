import { NextApiRequest, NextApiResponse } from "next";
import { query as consulta_bd } from "faunadb";
import { getSession } from "next-auth/react";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";
type User = {
    ref: {
        id: string;
    },
    data: {
        stripe_customer_id: string
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const session = await getSession({ req });

        const user = await fauna.query<User>(
            consulta_bd.Get(
                consulta_bd.Match(
                    consulta_bd.Index("user_by_email"),
                    consulta_bd.Casefold(session.user.email)
                )
            )
        );
        

        let custumerId = user.data.stripe_customer_id;

        if(!custumerId){
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
                //metadata
            });

            await fauna.query(
                consulta_bd.Update(
                    consulta_bd.Ref(consulta_bd.Collection('users'), user.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id,
                        }
                    }
                )
            ) 
            custumerId = stripeCustomer.id;
        }
        

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: custumerId ,
            payment_method_types: ["card"],
            billing_address_collection: "required",
            line_items: [{
                price: "price_1KjtnMAPQd4W9Ck7oXm4HA2c",
                quantity: 1
            }],
            mode: "subscription",
            cancel_url: process.env.STRIPE_CANCEL_URL,
            success_url: process.env.STRIPE_SUCCESS_URL,
            allow_promotion_codes: true,
        })
        const data = { sessionId: stripeCheckoutSession.id }
        return res.status(200).json(data)


    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Método não permitido")
    }
}

// export default  Subscribe ;