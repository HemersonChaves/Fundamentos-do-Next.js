import { GetStaticProps } from "next";
import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services";
import styles from "./home.module.scss";


interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}
export default function Home({ product }: HomeProps) {

  return (
    <>
      <Head>
        <title>Home| IGNews</title>
      </Head>
      <main className={styles.contentContainer} >
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} mouth</span>
          </p>
          <SubscribeButton priceId = {product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />

      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1KjtnMAPQd4W9Ck7oXm4HA2c", { expand: ["product"] });
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 horas
  }
}