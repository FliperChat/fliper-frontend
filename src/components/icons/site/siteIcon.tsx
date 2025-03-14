import Image from "next/image";
import styles from "./siteIcon.module.scss";

function SiteIcon(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`${styles.icon_site} ${props.className}`}>
      <span className={styles.icon_title}>Flip</span>
      <Image
        alt="siteIcon"
        src="/assets/icons/siteIcon.svg"
        width={50}
        height={80}
        draggable={false}
        className={styles.icon_image}
      />
    </div>
  );
}

export default SiteIcon;
