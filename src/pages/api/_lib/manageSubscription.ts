import { fauna } from "../../../services/fauna";
import { query as consulta_bd } from "faunadb";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
    createAction = false
) {
    // buscar usuario no banco do FaunaDB com ID {customerId} Stripe.c  ustomerId
    // Salvar os dados da subscription no FaunaDB
    const userRef = await fauna.query(
        consulta_bd.Select(
            "ref",
            consulta_bd.Get(
                consulta_bd.Match(
                    consulta_bd.Index('user_by_stripe_customer_id'),
                    customerId
                )
            )
        )
    )

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,

    }
    if (createAction) {
        await fauna.query(
            consulta_bd.Create(
                consulta_bd.Collection("subscriptions"),
                { data: subscriptionData }
            )
        )
    } else {
        await fauna.query(
            consulta_bd.Replace(
                consulta_bd.Select(
                    "ref",
                    consulta_bd.Get(
                        consulta_bd.Match(
                            consulta_bd.Index("subscription_by_id"),
                            subscriptionId
                        )
                    )
                ),
                {data: subscriptionData}
            )
        )
    }
}