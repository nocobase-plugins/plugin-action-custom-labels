import {
  SchemaSettings,
  createModalSettingsItem,
} from '@nocobase/client';

const NAMESPACE = 'action-custom-labels';

export const customLabelsActionSettings = new SchemaSettings({
  name: `actionSettings:customLabels`,
  items: [
    createModalSettingsItem({
      name: 'customLabelsSettings',
      title: `{{t('CustomLabelsSettings', { ns: '${NAMESPACE}' })}}`,
      parentSchemaKey: 'x-component-props',
      valueKeys: ['customLabelsConfig'],
      schema(values) {
        return {
          type: 'object',
          title: `{{t('CustomLabelsSettings', { ns: '${NAMESPACE}' })}}`,
          properties: {
            customLabelsConfig: {
              type: 'object',
              'x-component': 'CustomLabelsSettings',
              default: {
                isAdvancedMode: values?.customLabelsConfig?.isAdvancedMode || false,
                configFunction: values?.customLabelsConfig?.configFunction || '',
              },
            },
          },
        };
      },
    }),
    {
      name: 'remove',
      type: 'remove',
    },
  ],
});
