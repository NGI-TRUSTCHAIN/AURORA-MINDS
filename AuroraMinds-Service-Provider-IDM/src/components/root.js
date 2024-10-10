import React from "react";

function Root(props) {
  return <div style={styles.content}>{props.children}</div>;
}

const styles = {
  content: {
    padding: "1.5em",
    flex: "1 0 auto",
  },
};

export default Root;
