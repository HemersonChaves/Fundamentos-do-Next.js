import Head from "next/head";
import styles from "./styles.module.scss";

export default function Posts() {
    return (
        <>
            <Head>
                <title>Posts | Ignews</title>
            </Head>
            <main>
                <div>
                    <a>
                        <time>12 de setembro de 2022</time>
                        <strong>Boas práticas para devs em início de carreira</strong>
                        <p>As principais lições e dicas compiladas para quem está começando na programação ou migrando para a área.</p>
                    </a>
                    <a>
                        <time>12 de setembro de 2022</time>
                        <strong>Boas práticas para devs em início de carreira</strong>
                        <p>As principais lições e dicas compiladas para quem está começando na programação ou migrando para a área.</p>
                    </a>
                    <a>
                        <time>12 de setembro de 2022</time>
                        <strong>Boas práticas para devs em início de carreira</strong>
                        <p>As principais lições e dicas compiladas para quem está começando na programação ou migrando para a área.</p>
                    </a>
                </div>
            </main>
        </>
    );
}