import React, { useState, useEffect } from 'react';
import { Segmented, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { BasicAggregation } from './settings/BasicAggregation';
import { AdvancedCustom } from './settings/AdvancedCustom';
import { useCollection } from '@nocobase/client';

const { Title } = Typography;

interface CustomLabelsSettingsProps {
  value?: {
    isAdvancedMode: boolean;
    configFunction: string;
  };
  onChange?: (value: { isAdvancedMode: boolean; configFunction: string }) => void;
}

export const CustomLabelsSettings: React.FC<CustomLabelsSettingsProps> = ({ value, onChange }) => {
  const { t } = useTranslation('action-custom-labels');
  const [inputValue, setInputValue] = useState(value?.configFunction || '');
  const [isAdvancedMode, setIsAdvancedMode] = useState(value?.isAdvancedMode || false);
  const collection = useCollection();

  // Parse existing value and determine the mode
  useEffect(() => {
    if (value?.configFunction) {
      console.log('Component received value:', value);
      // First, set the input value
      setInputValue(value.configFunction);
    }
  }, [value]);

  // Update input value when switching modes
  useEffect(() => {
    if (isAdvancedMode) {
      // In advanced mode, show the original value
      setInputValue(value?.configFunction || '');
    }
    // In basic mode, code generation is handled by handleBasicConfigChange
  }, [isAdvancedMode, value]);

  const onValueChange = (configFunction) => {
    onChange && onChange({
      isAdvancedMode,
      configFunction,
    });
  };

  const handleInputChange = (configFunction: string) => {
    setInputValue(configFunction);
    onValueChange(configFunction);
  };

  const handleModeChange = (isBasic: boolean) => {
    const newMode = !isBasic;
    setIsAdvancedMode(newMode);
    onValueChange(inputValue);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={4} style={{ margin: 0 }}>
          {isAdvancedMode ? t('Advanced Custom') : t('Basic Aggregation')}
        </Title>
        <Segmented
          value={isAdvancedMode ? 'advanced' : 'basic'}
          onChange={(value) => handleModeChange(value === 'basic')}
          options={[
            { label: t('Basic Aggregation'), value: 'basic' },
            { label: t('Advanced Custom'), value: 'advanced' }
          ]}
        />
      </div>
      
      {isAdvancedMode ? (
        <AdvancedCustom
          inputValue={inputValue}
          onInputChange={handleInputChange}
        />
      ) : (
        <BasicAggregation
          inputValue={inputValue}
          onInputChange={handleInputChange}
          collectionFields={collection.fields}
        />
      )}
    </div>
  );

      
};
