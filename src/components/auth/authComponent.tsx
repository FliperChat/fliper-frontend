import Image from "next/image";
import "@/styles/auth.scss";
import styles from "./auth.module.scss";
import { useMemo } from "react";

function AuthComponent({ children }: { children: React.ReactNode }) {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className={styles.auth_background}>
      <div className={styles.image} data-auth-img="bi1">
        <Image
          src="/assets/images/bi1.jpg"
          alt="bi1"
          height={214}
          width={177}
          draggable={false}
          priority
        />
      </div>
      <div className={styles.image} data-auth-img="bi2">
        <Image
          src="/assets/images/bi2.jpg"
          alt="bi2"
          height={184}
          width={152}
          draggable={false}
        />
      </div>
      <div className={styles.image} data-auth-img="bi3">
        <Image
          src="/assets/images/bi3.jpg"
          alt="bi3"
          height={144}
          width={119}
          draggable={false}
        />
      </div>
      <div className={styles.image} data-auth-img="bi4">
        <Image
          src="/assets/images/bi4.jpg"
          alt="bi4"
          height={122}
          width={101}
          draggable={false}
        />
      </div>
      <div className={styles.image} data-auth-img="bi5">
        <Image
          src="/assets/images/bi5.jpg"
          alt="bi5"
          height={79}
          width={65}
          draggable={false}
        />
      </div>
      <div className={styles.image} data-auth-img="bi6">
        <Image
          src="/assets/images/bi6.jpg"
          alt="bi6"
          height={151}
          width={125}
          draggable={false}
        />
      </div>
      <div className={styles.image} data-auth-img="bi7">
        <Image
          src="/assets/images/bi7.jpg"
          alt="bi7"
          height={138}
          width={114}
          draggable={false}
        />
      </div>
      <div className={styles.image} data-auth-img="bi8">
        <Image
          src="/assets/images/bi8.jpg"
          alt="bi8"
          height={144}
          width={119}
          draggable={false}
        />
      </div>
      <div className={styles.image} data-auth-img="bi9">
        <Image
          src="/assets/images/bi9.jpg"
          alt="bi9"
          height={155}
          width={124}
          draggable={false}
        />
      </div>
      <div className={styles.circle} data-circle-type="type1"></div>
      <div className={styles.circle} data-circle-type="type2"></div>
      <div className={styles.circle} data-circle-type="type3"></div>
      <div className={styles.circle} data-circle-type="type4"></div>
      <div className={styles.circle} data-circle-type="type5"></div>
      <div className={styles.circle} data-circle-type="type7"></div>
      <div className={styles.circle} data-circle-type="type8"></div>
      <div className={styles.circle} data-circle-type="type9"></div>
      <div className={styles.circle} data-circle-type="type10"></div>
      <div className={styles.circle} data-circle-type="type11"></div>
      <div className={styles.circle} data-circle-type="type12"></div>
      <div className={styles.heart} data-heart-type="type1">
        &#x2764;
      </div>
      <div className={styles.heart} data-heart-type="type2">
        &#x2764;
      </div>
      <div className={styles.heart} data-heart-type="type3">
        &#x2764;
      </div>
      <div className={styles.heart} data-heart-type="type4">
        &#x2764;
      </div>
      <div className={styles.heart} data-heart-type="type5">
        &#x2764;
      </div>
      <div className={styles.point}></div>
      <main className={styles.auth_block}>{children}</main>
      <footer className={styles.auth_footer}>&#169; {year} Flip</footer>
    </div>
  );
}

export default AuthComponent;
