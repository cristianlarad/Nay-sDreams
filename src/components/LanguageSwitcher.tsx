import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="fixed top-4 right-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => changeLanguage('en')}
        className={i18n.language === 'en' ? 'bg-gray-200' : ''}
      >
        EN
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => changeLanguage('es')}
        className={i18n.language === 'es' ? 'bg-gray-200' : 'ml-2'}
      >
        ES
      </Button>
    </div>
  );
};

export default LanguageSwitcher;