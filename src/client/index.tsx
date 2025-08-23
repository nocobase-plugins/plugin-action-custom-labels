/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { Plugin } from '@nocobase/client';
import { CodeBlock } from './CodeBlock';
import { CustomLabelsSettings } from './CustomLabelsSettings';
import { CustomLabelsAction } from './CustomLabelsAction';
import { createCustomLabelsActionInitializerItem } from './CustomLabelsActionInitializer';
import { customLabelsActionSettings } from './CustomLabelsActionSettings';

export class PluginActionCustomLabels extends Plugin {
  async load() {
    this.app.addComponents({ 
      CustomLabelsSettings,
      CustomLabelsAction,
      CodeBlock,
    });
    this.app.schemaSettingsManager.add(customLabelsActionSettings);
    this.app.schemaInitializerManager.addItem(
      'table:configureActions',
      'customLabels',
      createCustomLabelsActionInitializerItem(),
    );
  }
}

export default PluginActionCustomLabels;
