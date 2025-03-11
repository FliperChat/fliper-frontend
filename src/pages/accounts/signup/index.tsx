import { serverSideTranslations } from "next-i18next/serverSideTranslations";

function SignUp() {
  return <>Register</>;
}

SignUp.requireAuth = false;

export default SignUp;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}
