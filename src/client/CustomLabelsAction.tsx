import React, { useMemo, useEffect, useState } from 'react';
import { useFieldSchema } from '@formily/react';
import { useTranslation } from 'react-i18next';
import { Tag, Space, theme, message } from 'antd';
import {
  Action,
  useDesignable,
  useCollection,
  mergeFilter,
  useDataBlockRequest,
  useAPIClient,
} from '@nocobase/client';
import { parseFunctionString } from './utils/functionParser';

const NAMESPACE = 'action-custom-labels';

export const CustomLabelsAction = (props) => {
  const { t } = useTranslation(NAMESPACE);
  const service = useDataBlockRequest() as any;
  const [labels, setLabels] = useState([]);
  const { designable } = useDesignable();
  const { token } = theme.useToken();
  const apiClient = useAPIClient();
  const collection = useCollection();
  const fieldSchema = useFieldSchema();
  
  const mergedFilter = useMemo(() => {
    return mergeFilter([service.params[0]?.filter || {}, {}]);
  }, [service]);

  // Get configuration function from schema
  const getConfigFunction = useMemo(() => {
    const customLabelsConfig = fieldSchema?.['x-component-props']?.customLabelsConfig;
    const configFunctionStr = customLabelsConfig?.configFunction;
    if (!configFunctionStr) {
      return null;
    }

    const func = parseFunctionString(configFunctionStr);
    if (!func) {
      message.error(t('Invalid configuration function'));
      return null;
    }
    
    return func;
  }, [fieldSchema]);

  // Generate config using the user-defined function
  const generateConfig = useMemo(() => {
    if (!getConfigFunction) {
      return null;
    }

    try {
      const config = getConfigFunction(collection.name, mergedFilter);
      return config;
    } catch (error) {
      console.error('Failed to execute config function:', error);
      message.error(t('Failed to execute configuration function'));
      return null;
    }
  }, [getConfigFunction, collection.name, mergedFilter]);

  // Call backend API to fetch custom labels
  const fetchCustomLabels = async (config, filter) => {
    if (!config) {
      setLabels([]);
      return;
    }

    try {
      const response = await apiClient.request({
        url: 'collections:custom_labels-fetch',
        method: 'POST',
        data: {
          repo: collection.name,
          filter,
          config,
        },
      });
      
      if (response?.data?.data?.data) {
        setLabels(response.data.data.data);
      } else {
        setLabels([]);
      }
    } catch (error) {
      console.error('Failed to fetch custom labels:', error);
      message.error(t('Failed to fetch custom labels'));
      setLabels([]);
    }
  };

  useEffect(() => {
    fetchCustomLabels(generateConfig, mergedFilter);
  }, [mergedFilter, generateConfig, apiClient]);
  
  const labelsComponent = (
    <Space wrap size={[token.marginXXS, token.marginXXS]}>
      {designable && labels.length < 1 ? <div>{t('Please configure the custom labels')}</div> : labels.map((item, index) => (
        <Tag
          key={index}
          color={item.color}
          style={{
            margin: 0,
            fontSize: token.fontSizeSM,
            lineHeight: '1.4',
            padding: `${token.paddingXXS}px ${token.paddingXS}px`,
            borderRadius: token.borderRadiusSM,
            border: 'none',
          }}
        >
          <span style={{ fontWeight: 500 }}>{item.label}:</span> {item.value}
        </Tag>
      ))}
    </Space>
  );

  if (designable) {
    return <Action {...props} type={'link'} title={labelsComponent} onClick={() => {}} style={{ padding: 0 }}></Action>;
  } else {
    return labelsComponent;
  }
};
