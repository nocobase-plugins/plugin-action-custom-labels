import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Select, Button, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCompile } from '@nocobase/client';
import { parseFunctionString } from '../utils/functionParser';

const { Text } = Typography;
const { Option } = Select;

interface FieldConfig {
  field: string | undefined;
  label: string | undefined;
  color: string | undefined;
}

interface BasicAggregationConfig {
  type: 'sum';
  fields: FieldConfig[];
}

interface BasicAggregationProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  collectionFields?: any[];
}

export const BasicAggregation: React.FC<BasicAggregationProps> = ({
  inputValue,
  onInputChange,
  collectionFields
}) => {
  const { t } = useTranslation('action-custom-labels');
  const compile = useCompile();
  const [basicConfig, setBasicConfig] = useState<BasicAggregationConfig>({
    type: 'sum',
    fields: []
  });

  // Parse existing inputValue and populate form
  useEffect(() => {
    if (inputValue) {
      try {
        const func = parseFunctionString(inputValue);
        if (func) {
          const config = func('test', {});
          if (config && config.type === 'sum' && config.fields && Array.isArray(config.fields)) {
            setBasicConfig(config);
          }
        }
      } catch (e) {
        console.warn('Failed to parse existing config:', e);
      }
    }
  }, [inputValue]);

  const handleBasicConfigChange = (newConfig: BasicAggregationConfig) => {
    setBasicConfig(newConfig);
    
    // Generate nicely formatted code with proper indentation
    const previewCode = `(repo, filter) => {
  return ${JSON.stringify(newConfig, null, 2).split('\n').map((line, index) => 
      index === 0 ? line : '  ' + line
    ).join('\n')};
}`;
    
    onInputChange(previewCode);
  };

  const addField = () => {
    const newFields = [...basicConfig.fields, { field: undefined, label: undefined, color: 'default' }];
    handleBasicConfigChange({ ...basicConfig, fields: newFields });
  };

  const removeField = (index: number) => {
    const newFields = basicConfig.fields.filter((_, i) => i !== index);
    handleBasicConfigChange({ ...basicConfig, fields: newFields });
  };

  const updateField = (index: number, field: Partial<FieldConfig>) => {
    const newFields = [...basicConfig.fields];
    newFields[index] = { ...newFields[index], ...field };
    handleBasicConfigChange({ ...basicConfig, fields: newFields });
  };

  return (
    <div>
      <Text type="secondary">
        {t('Configure sum aggregation fields through visual interface')}
      </Text>

      <div style={{ marginTop: '20px' }}>
        {basicConfig.fields.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px', 
            color: '#999',
            border: '2px dashed #d9d9d9',
            borderRadius: '6px',
            backgroundColor: '#fafafa',
            marginBottom: '16px'
          }}>
            <Text type="secondary">{t('No fields configured yet. Click "Add Field" to get started.')}</Text>
          </div>
        ) : (
          basicConfig.fields.map((field, index) => (
            <Card key={index} style={{ marginBottom: '16px', border: '1px solid #f0f0f0' }}>
              <Row gutter={16} align="middle">
                <Col span={8}>
                  <Text strong>{t('Field Name')}</Text>
                  <Select
                    placeholder={t('Select a field')}
                    value={field.field}
                    onChange={(value) => {
                      // Handle empty value (when user clears the selection)
                      if (!value) {
                        updateField(index, {});
                        return;
                      }
                      
                      // Find the selected field item to get its label
                      const selectedField = collectionFields?.find(item => item.name === value);
                      const fieldLabel = selectedField ? (compile(selectedField.uiSchema?.title) || selectedField.name) : '';
                      
                      // Update both field name and label
                      updateField(index, { 
                        field: value, 
                        label: `${fieldLabel} ${t('Summary')}` 
                      });
                    }}
                    style={{ marginTop: '8px', width: '100%' }}
                  >
                    {collectionFields?.map((fieldItem) => (
                      <Option key={fieldItem.name} value={fieldItem.name} label={compile(fieldItem.uiSchema?.title) || fieldItem.name}>
                        {compile(fieldItem.uiSchema?.title) || fieldItem.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={8}>
                  <Text strong>{t('Display Label')}</Text>
                  <Input
                    placeholder={t('e.g., Total Amount, Quantity Summary')}
                    value={field.label}
                    onChange={(e) => updateField(index, { label: e.target.value })}
                    style={{ marginTop: '8px' }}
                  />
                </Col>
                <Col span={6}>
                  <Text strong>{t('Color')}</Text>
                  <Select
                    value={field.color}
                    onChange={(color) => updateField(index, { color })}
                    style={{ marginTop: '8px', width: '100%' }}
                  >
                    <Option value="blue">{t('Blue')}</Option>
                    <Option value="green">{t('Green')}</Option>
                    <Option value="red">{t('Red')}</Option>
                    <Option value="orange">{t('Orange')}</Option>
                    <Option value="purple">{t('Purple')}</Option>
                    <Option value="cyan">{t('Cyan')}</Option>
                    <Option value="magenta">{t('Magenta')}</Option>
                    <Option value="gold">{t('Gold')}</Option>
                    <Option value="volcano">{t('Volcano')}</Option>
                    <Option value="lime">{t('Lime')}</Option>
                    <Option value="geekblue">{t('Geek Blue')}</Option>
                    <Option value="default">{t('Default')}</Option>
                  </Select>
                </Col>
                <Col span={2}>
                  <Button
                    type="text"
                    danger
                    onClick={() => removeField(index)}
                  >
                    {t('Remove')}
                  </Button>
                </Col>
              </Row>
            </Card>
          ))
        )}

        <Button type="dashed" onClick={addField} style={{ width: '100%' }}>
          + {t('Add Field')}
        </Button>
      </div>
    </div>
  );
};
