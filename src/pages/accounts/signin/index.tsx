import { serverSideTranslations } from "next-i18next/serverSideTranslations";

function SignIn() {
  return <>Login</>;
}

SignIn.requireAuth = false;

export default SignIn;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}
