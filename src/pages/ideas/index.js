import * as React from "react";

import Layout from "../../components/Layout";
import IdeaRoll from "../../components/IdeaRoll";

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
                            boxShadow: "0.5rem 0 0 #f40, -0.5rem 0 0 #f40",
                            backgroundColor: "#f40",
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
