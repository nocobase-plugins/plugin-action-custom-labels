import React from 'react';
import {
  ActionInitializerItem,
  useSchemaInitializerItem,
  SchemaInitializerItemType,
} from '@nocobase/client';

const NAMESPACE = 'action-custom-labels';

export const CustomLabelsActionInitializer = (props) => {
  const itemConfig = useSchemaInitializerItem();
  return (
    <ActionInitializerItem
      {...itemConfig}
      {...props}
      item={itemConfig}
      schema={{
        type: 'void',
        'x-action': 'customLabels',
        'x-toolbar': 'ActionSchemaToolbar',
        'x-component': 'CustomLabelsAction',
        'x-settings': 'actionSettings:customLabels',
      }}
      type={'x-action'}
    />
  );
};

export const createCustomLabelsActionInitializerItem = (): SchemaInitializerItemType => ({
  name: 'customLabels',
  title: `{{t('Custom Labels', { ns: '${NAMESPACE}' })}}`,
  Component: CustomLabelsActionInitializer,
  schema: {
    'x-action-settings': {},
  },
});
