import Link from "next/link";

const CookieModal = () => {
  return (
    <div>
      <p>
        Этот сайт использует файлы cookies для обеспечения безопасности,
        улучшения работы и анализа данных. Продолжая использование сайта, вы
        соглашаетесь с нашей{" "}
        <Link href="/privacy">Политикой конфиденциальности</Link> и{" "}
        <Link href="/cookies">Политикой cookies</Link>.
      </p>
      <button>Принять</button>
      <button>Настройки</button>
    </div>
  );
};

export default CookieModal;
