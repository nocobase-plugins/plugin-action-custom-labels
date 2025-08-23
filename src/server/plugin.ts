/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { Plugin } from '@nocobase/server';
import axios from 'axios';

const fetchDataFromSum = async (ctx, next, repo, config, filter) => {
  if (!config || !config.fields || !Array.isArray(config.fields)) {
    ctx.throw(400, 'fields array is required for sum type');
  }

  try {
    const repository = ctx.db.getRepository(repo);
    if (!repository) {
      ctx.throw(400, `Repository ${repo} not found`);
    }

    const results = [];

    // Process each field in the config
    for (const fieldConfig of config.fields) {
      const { field, label, color } = fieldConfig;

      if (!field) {
        ctx.log.warn('Field name is missing in field config:', { fieldConfig });
        continue;
      }

      try {
        ctx.log.info(`Executing SUM aggregation for field: ${field}`, { filter: JSON.stringify(filter) });

        // Use NocoBase's built-in aggregate method - much simpler!
        const sum = await repository.aggregate({
          field: field,
          method: 'sum',
          filter: filter
        });

        ctx.log.info(`SUM aggregation result:`, { field, sum });

        // Add to results array
        results.push({
          label: label || `${field}-汇总`,
          value: sum ? sum.toString() : '0',
          color: color
        });

      } catch (fieldError) {
        ctx.log.error(`Error summing field ${field}:`, { error: fieldError.message, stack: fieldError.stack });
        // Add error result for this field
        results.push({
          label: label || `${field}-汇总`,
          value: '0',
          color: color
        });
      }
    }

    ctx.body = { data: results };

    await next();
  } catch (error) {
    ctx.log.error('Error in fetchDataFromSum:', { error: error.message, stack: error.stack });
    ctx.throw(500, `Sum aggregation failed: ${error.message}`);
  }
};

const fetchDataFromLocalSQL = async (ctx, next, repo, config, filter) => {
  if (!config || !config.fields || !Array.isArray(config.fields)) {
    ctx.throw(400, 'fields array is required for sql type');
  }

  try {
    const results = [];

    // Process each field in the config
    for (const fieldConfig of config.fields) {
      const { field, label, color, value: sql } = fieldConfig;
      
      if (!sql) {
        ctx.log.warn('SQL value is missing in field config:', { fieldConfig });
        continue;
      }

      try {
        // Execute the SQL query directly (ignore filter, let frontend handle it)
        const rows = await ctx.db.sequelize.query(sql, {
          type: ctx.db.sequelize.QueryTypes.SELECT,
        });

        // Extract the result value from the first row
        let resultValue = '-';
        if (rows && rows.length > 0) {
          const firstRow = rows[0];
          // Try to get the value from common aggregate function aliases
          resultValue = firstRow.sum || firstRow.count || firstRow.avg || firstRow.max || firstRow.min || firstRow.total || '0';
        }

        // Add to results array
        results.push({
          label: label || `${field}`,
          value: resultValue.toString(),
          color: color
        });

      } catch (fieldError) {
        ctx.log.error(`Error executing SQL for field ${field}:`, { error: fieldError.message, stack: fieldError.stack });
        // Add error result for this field
        results.push({
          label: label || `${field}`,
          value: '-',
          color: color
        });
      }
    }

    ctx.body = { data: results };

    await next();
  } catch (error) {
            ctx.log.error('Error in fetchDataFromLocalSQL:', { error: error.message, stack: error.stack });
    ctx.throw(500, `SQL query failed: ${error.message}`);
  }
};

const fetchDataFromRemoteAPI = async (ctx, next, repo, config, filter) => {
  try {
    let { url, headers } = config?.data || {};
    const { method = 'get', query = {}, body = {} } = config?.data || {};
    if (!url) {
      ctx.throw(400, 'url is required for api type');
    }
    // 解析 basic auth
    let authHeader = '';
    try {
      const urlObj = new URL(url);
      if (urlObj.username && urlObj.password) {
        const basic = Buffer.from(`${urlObj.username}:${urlObj.password}`).toString('base64');
        authHeader = `Basic ${basic}`;
        urlObj.username = '';
        urlObj.password = '';
        url = urlObj.toString();
      }
    } catch (e) {
      // URL 解析失败，忽略 basic auth
    }
    if (authHeader) {
      headers = { ...headers, Authorization: authHeader };
    }
    const axiosConfig = {
      url,
      method: method.toLowerCase(),
      headers,
      params: query,
      data: body,
      validateStatus: () => true, // 让我们自己处理错误码
    };
    let response;
    try {
      response = await axios(axiosConfig);
    } catch (err) {
      ctx.throw(500, `Remote API request error: ${err.message}`);
      return;
    }
    if (!response || typeof response.status !== 'number') {
      ctx.throw(500, 'Remote API response is invalid');
      return;
    }
    if (response.status < 200 || response.status >= 300) {
      ctx.throw(response.status, `Remote API request failed: ${response.statusText}`);
      return;
    }
    ctx.body = { data: response.data?.data ?? response.data };
    await next();
  } catch (err) {
    ctx.throw(500, `fetchDataFromRemoteAPI error: ${err.message}`);
  }
};

const fetchData = async (ctx, next) => {
  if (!ctx || !ctx.action || !ctx.action.params) {
    ctx.throw(400, 'params is required');
  }
          ctx.log.info('Action params:', { params: ctx.action.params });
  const { repo, filter, config } = ctx.action.params.values;
  if (!config) {
    ctx.throw(400, 'config is required');
  }
  if (config.type === 'sum') {
    await fetchDataFromSum(ctx, next, repo, config, filter);
  } else if (config.type === 'sql') {
    await fetchDataFromLocalSQL(ctx, next, repo, config, filter);
  } else if (config.type === 'api') {
    await fetchDataFromRemoteAPI(ctx, next, repo, config, filter);
  } else {
    ctx.throw(400, 'type must be sql or api');
  }
};

export class PluginActionCustomLabelsServer extends Plugin {
  async load() {
    this.app.resourceManager.registerActionHandlers({
      'collections:custom_labels-fetch': async (ctx, next) => {
        await fetchData(ctx, next);
      },
    });
  }
}

export default PluginActionCustomLabelsServer;