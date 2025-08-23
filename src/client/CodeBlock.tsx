import React, { useState } from 'react';
import { message } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface CodeBlockProps {
  code?: string;
  children?: string;
  style?: React.CSSProperties;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, children, style }) => {
  const { t } = useTranslation('action-custom-labels');
  const [copied, setCopied] = useState(false);
  const content = code || children || '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      message.success(t('Code copied to clipboard'));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      message.error(t('Failed to copy code'));
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        padding: '12px',
        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
        fontSize: '12px',
        color: '#262626',
        cursor: 'pointer',
        position: 'relative',
        ...style,
      }}
      onClick={handleCopy}
      title="Click to copy"
    >
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          color: copied ? '#52c41a' : '#8c8c8c',
          fontSize: '14px',
        }}
      >
        {copied ? <CheckOutlined /> : <CopyOutlined />}
      </div>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {content}
      </pre>
    </div>
  );
};
