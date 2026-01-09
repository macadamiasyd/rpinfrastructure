import styles from "./index.module.scss";

export default function ExitPreview() {
  return (
    <div className={styles["exit-preview"]}>
      <div className="container row">
        <div className={styles["exit-preview__holder"]}>
          <p>You are in draft mode</p>
          <form action="/api/exit-preview">
            <button type="submit">Exit Preview</button>
          </form>
        </div>
      </div>
    </div>
  );
}
