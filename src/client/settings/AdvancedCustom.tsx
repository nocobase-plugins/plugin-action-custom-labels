import React from 'react';
import { Card, Typography, Space, Divider, Input, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { CodeBlock } from '../CodeBlock';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface AdvancedCustomProps {
  inputValue: string;
  onInputChange: (configFunction: string) => void;
}

export const AdvancedCustom: React.FC<AdvancedCustomProps> = ({
  inputValue,
  onInputChange
}) => {
  const { t } = useTranslation('action-custom-labels');

  return (
    <div>
      <Text type="secondary">
        {t('Write custom JavaScript function for advanced custom configurations')}
      </Text>
      
      <div style={{ marginTop: '20px' }}>
        <TextArea
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={t('Enter your configuration function here...')}
          rows={20}
          style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
        />
      </div>

      <Divider />

      <Title level={4}>{t('Parameter Description')}</Title>
      <Card style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
        <Space direction="vertical" size="small">
          <Text strong>{t('repo')}:</Text>
          <Text>{t('Current collection name (string), e.g., "users", "orders", "products"')}</Text>
          
          <Text strong>{t('filter')}:</Text>
          <Text>{t('Merged filter object from collection filter blocks and filter operations. Includes $and, $or operators and field conditions.')}</Text>
        </Space>
      </Card>

      <Divider />

      <Title level={4}>{t('Return Value Format Requirements')}</Title>
      <Card style={{ backgroundColor: '#fff7e6', border: '1px solid #ffd591' }}>
        <Text>{t('Your function must return an object with the following structure. Choose one of three supported types:')}</Text>
        
        <div style={{ 
          marginTop: '16px', 
          padding: '16px', 
          border: '1px solid #f0f0f0', 
          borderRadius: '8px',
          backgroundColor: '#fafafa'
        }}>
          <Text strong style={{ 
            backgroundColor: '#fff2e8', 
            padding: '4px 8px', 
            borderRadius: '4px',
            display: 'block',
            marginBottom: '12px'
          }}>
            {t('type: \'sum\' - Aggregation Type')}
          </Text>
          <Text style={{ display: 'block', marginBottom: '12px' }}>
            {t('Calculate sum of numeric fields in the collection.')}
          </Text>
          <pre style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #e8e8e8', 
            borderRadius: '4px', 
            padding: '12px',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: '12px',
            color: '#262626',
            margin: 0
          }}>{`fields: [
  { field: "fieldName", label: "Display Label", color: "color" }
]`}</pre>
        </div>

        <div style={{ 
          marginTop: '16px', 
          padding: '16px', 
          border: '1px solid #f0f0f0', 
          borderRadius: '8px',
          backgroundColor: '#fafafa'
        }}>
          <Text strong style={{ 
            backgroundColor: '#fff2e8', 
            padding: '4px 8px', 
            borderRadius: '4px',
            display: 'block',
            marginBottom: '12px'
          }}>
            {t('type: \'sql\' - SQL Query Type')}
          </Text>
          <Text style={{ display: 'block', marginBottom: '12px' }}>
            {t('Directly execute custom SQL queries.')}
          </Text>
          <pre style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #e8e8e8', 
            borderRadius: '4px', 
            padding: '12px',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: '12px',
            color: '#262626',
            margin: 0
          }}>{`fields: [
  { field: "fieldName", label: "Display Label", color: "color", value: "SQL_STATEMENT" }
]`}</pre>
        </div>

        <div style={{ 
          marginTop: '16px', 
          padding: '16px', 
          border: '1px solid #f0f0f0', 
          borderRadius: '8px',
          backgroundColor: '#fafafa'
        }}>
          <Text strong style={{ 
            backgroundColor: '#fff2e8', 
            padding: '4px 8px', 
            borderRadius: '4px',
            display: 'block',
            marginBottom: '12px'
          }}>
            {t('type: \'api\' - External API Type')}
          </Text>
          <Text style={{ display: 'block', marginBottom: '12px' }}>
            {t('Fetch data from external APIs.')}
          </Text>
          <pre style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #e8e8e8', 
            borderRadius: '4px', 
            padding: '12px',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: '12px',
            color: '#262626',
            margin: 0
          }}>{`data: {
  url: "API_URL",
  method: "GET/POST",
  query: {...},
  body: {...},
  headers: {...}
}`}</pre>
          <Text type="secondary" style={{ display: 'block', marginTop: '12px', color: '#d46b08' }}>
            {t('Important: Your API must return data in the following format to be processed correctly:')}
          </Text>
          <pre style={{ 
            backgroundColor: '#fff7e6', 
            border: '1px solid #ffd591', 
            borderRadius: '4px', 
            padding: '12px',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: '12px',
            color: '#d46b08',
            margin: 0
          }}>{`// API Response Format (JSON)
{
  "success": true,
  "data": [
    {
      "field": "fieldName",
      "label": "Display Label", 
      "color": "color",
      "value": "API_RETURNED_VALUE"
    }
  ]
}`}</pre>
          <Text type="secondary" style={{ display: 'block', marginTop: '8px', color: '#d46b08' }}>
            {t('The plugin will use the "data" array from your API response to generate labels.')}
          </Text>
        </div>
      </Card>

      <Divider />

      <Title level={4}>{t('Example Configurations')}</Title>
      <Tabs
        defaultActiveKey="sum"
        items={[
          {
            key: 'sum',
            label: t('Sum Type Example'),
            children: (
              <div>
                <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                  {t('Calculate sum of numeric fields from the collection')}
                </Text>
                <CodeBlock code={`(repo, filter) => {
  // repo: collection name, e.g., "users", "orders"
  // filter: combined filter object with $and, $or operators
  
  console.log('Collection:', repo);
  console.log('Filter:', filter);
  
  return {
    type: 'sum',
    fields: [
      {
        field: 'id',
        label: 'ID Summary',
        color: 'green',
      },
      {
        field: 'amount',
        label: 'Total Amount',
        color: 'blue',
      },
    ]
  };
}`} />
              </div>
            ),
          },
          {
            key: 'filter-aware',
            label: t('Filter-Aware Example'),
            children: (
              <div>
                <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                  {t('Example of using filter conditions to customize labels')}
                </Text>
                <CodeBlock code={`(repo, filter) => {
  // Example of using filter conditions
  let label = 'All Records';
  
  if (filter && filter.$and) {
    // Check if there are specific filter conditions
    const hasFilters = filter.$and.length > 0;
    if (hasFilters) {
      label = 'Filtered Records';
    }
  }
  
  return {
    type: 'sum',
    fields: [
      {
        field: 'id',
        label: label,
        color: 'green',
      },
    ]
  };
}`} />
              </div>
            ),
          },
          {
            key: 'sql',
            label: t('SQL Type Example'),
            children: (
              <div>
                <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                  {t('Execute custom SQL queries and display results')}
                </Text>
                <CodeBlock code={`(repo, filter) => {
  // Build dynamic SQL based on collection and filters
  let sql = \`SELECT COUNT(*) as count FROM \${repo}\`;
  
  if (filter && filter.$and && filter.$and.length > 0) {
    sql += ' WHERE 1=1'; // Add WHERE clause if filters exist
  }
  
  return {
    type: 'sql',
    fields: [
      {
        field: 'id',
        label: 'Custom SQL Result',
        color: 'blue',
        value: sql,
      },
    ]
  };
}`} />
              </div>
            ),
          },
          {
            key: 'api',
            label: t('API Type Example'),
            children: (
              <div>
                <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                  {t('Fetch data from external APIs with authentication support')}
                </Text>
                <CodeBlock code={`(repo, filter) => {
  // Use collection and filter info in API calls
  const queryParams = {
    collection: repo,
    hasFilters: filter && filter.$and && filter.$and.length > 0,
    filterCount: filter?.$and?.length || 0
  };
  
  return {
    type: 'api',
    data: {
      url: 'https://api.example.com/data',
      method: 'POST',
      query: queryParams,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN'
      }
    }
  };
}`} />
              </div>
            ),
          },
          {
            key: 'api-response',
            label: t('API Response Example'),
            children: (
              <div>
                <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                  {t('Example of what your API should return:')}
                </Text>
                <CodeBlock code={`// Your API should return this JSON structure
{
  "success": true,
  "data": [
    {
      "field": "total_users",
      "label": "Total Users",
      "color": "blue",
      "value": "1,234"
    },
    {
      "field": "active_users", 
      "label": "Active Users",
      "color": "green",
      "value": "987"
    }
  ]
}

// The plugin will automatically use the "data" array
// to generate labels with the specified field, label, color, and value`} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};
