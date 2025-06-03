import * as React from "react";

import Layout from "../../components/Layout";
import IdeaRoll from "../../components/IdeaRoll";
import { PRIMARY_COLOR } from "../../style/theme";

export default class IdeaIndexPage extends React.Component {
    render() {
        return (
            <Layout>
                <div
                    className="full-width-image-container margin-top-0"
                    style={{
                        backgroundImage: `url('/img/idea-index.jpg')`,
                    }}
                >
                    <h1
                        className="has-text-weight-bold is-size-1"
                        style={{
                            backgroundColor: PRIMARY_COLOR,
                            color: "white",
                            padding: "1rem",
                        }}
                    >
                        Shared Ideas
                    </h1>
                </div>
                <section className="section">
                    <div className="container">
                        <div className="content">
                            <IdeaRoll />
                        </div>
                    </div>
                </section>
            </Layout>
        );
    }
}
