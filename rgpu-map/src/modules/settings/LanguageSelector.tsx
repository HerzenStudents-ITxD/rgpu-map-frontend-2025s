import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FlagCard from '../../UI/FlagCard';
import PrimaryButton from '../../UI/PrimaryButton';
import ukFlag from '../../assets/images/uk-flag.svg';
import ruFlag from '../../assets/images/ru-flag.svg';
import cnFlag from '../../assets/images/cn-flag.svg';

const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language || 'ru');

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
  };

  const handleSave = () => {
    i18n.changeLanguage(selectedLanguage);
    console.log('Selected language:', selectedLanguage);
  };

  return (
    <div>
      <FlagCard
        flagImage={ukFlag}
        alt="UK Flag"
        selected={selectedLanguage === 'en'}
        onClick={() => handleLanguageSelect('en')}
      />
      <FlagCard
        flagImage={ruFlag}
        alt="Russia Flag"
        selected={selectedLanguage === 'ru'}
        onClick={() => handleLanguageSelect('ru')}
      />
      <FlagCard
        flagImage={cnFlag}
        alt="China Flag"
        selected={selectedLanguage === 'cn'}
        onClick={() => handleLanguageSelect('cn')}
      />
      <PrimaryButton label={t('settings.save')} onClick={handleSave} />
    </div>
  );
};

export default LanguageSelector;