import {
  ProFormDateTimePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Modal, message } from 'antd';
import React, { cloneElement, useCallback, useState } from 'react';
import { updateRule } from '@/services/ant-design-pro/api';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;

export type UpdateFormProps = {
  trigger?: React.ReactElement<any>;
  onOk?: () => void;
  values: Partial<API.RuleListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { onOk, values, trigger } = props;

  const intl = useIntl();

  const [open, setOpen] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const { run } = useRequest(updateRule, {
    manual: true,
    onSuccess: () => {
      messageApi.success('Configuration is successful');
      onOk?.();
    },
    onError: () => {
      messageApi.error('Configuration failed, please try again!');
    },
  });

  const onCancel = useCallback(() => {
    setOpen(false);
  }, []);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const onFinish = useCallback(
    async (values?: any) => {
      await run({ data: values });

      onCancel();
    },
    [onCancel, run],
  );

  return (
    <>
      {contextHolder}
      {trigger
        ? cloneElement(trigger, {
            onClick: onOpen,
          })
        : null}
      <StepsForm
        stepsProps={{
          size: 'small',
        }}
        stepsFormRender={(dom, submitter) => {
          return (
            <Modal
              width={640}
              styles={{
                body: {
                  padding: '32px 40px 48px',
                },
              }}
              destroyOnHidden
              title={intl.formatMessage({
                id: 'pages.searchTable.updateForm.ruleConfig',
                defaultMessage: 'Rule Configuration',
              })}
              open={open}
              footer={submitter}
              onCancel={onCancel}
            >
              {dom}
            </Modal>
          );
        }}
        onFinish={onFinish}
      >
        <StepsForm.StepForm
          initialValues={values}
          title={intl.formatMessage({
            id: 'pages.searchTable.updateForm.basicConfig',
            defaultMessage: 'Basic Information',
          })}
        >
          <ProFormText
            name="name"
            label={intl.formatMessage({
              id: 'pages.searchTable.updateForm.ruleName.nameLabel',
              defaultMessage: 'Rule Name',
            })}
            width="md"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.searchTable.updateForm.ruleName.nameRules"
                    defaultMessage="Please enter the rule name!"
                  />
                ),
              },
            ]}
          />
          <ProFormTextArea
            name="desc"
            width="md"
            label={intl.formatMessage({
              id: 'pages.searchTable.updateForm.ruleDesc.descLabel',
              defaultMessage: 'Rule Description',
            })}
            placeholder={intl.formatMessage({
              id: 'pages.searchTable.updateForm.ruleDesc.descPlaceholder',
              defaultMessage: 'Please enter at least five characters',
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.searchTable.updateForm.ruleDesc.descRules"
                    defaultMessage="Please enter a rule description of at least five characters!"
                  />
                ),
                min: 5,
              },
            ]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          initialValues={{
            target: '0',
            template: '0',
          }}
          title={intl.formatMessage({
            id: 'pages.searchTable.updateForm.ruleProps.title',
            defaultMessage: 'Configure Rule Properties',
          })}
        >
          <ProFormSelect
            name="target"
            width="md"
            label={intl.formatMessage({
              id: 'pages.searchTable.updateForm.object',
              defaultMessage: 'Monitoring Target',
            })}
            valueEnum={{
              0: 'Table 1',
              1: 'Table 2',
            }}
          />
          <ProFormSelect
            name="template"
            width="md"
            label={intl.formatMessage({
              id: 'pages.searchTable.updateForm.ruleProps.templateLabel',
              defaultMessage: 'Rule Template',
            })}
            valueEnum={{
              0: 'Template 1',
              1: 'Template 2',
            }}
          />
          <ProFormRadio.Group
            name="type"
            label={intl.formatMessage({
              id: 'pages.searchTable.updateForm.ruleProps.typeLabel',
              defaultMessage: 'Rule Type',
            })}
            options={[
              {
                value: '0',
                label: 'Strong',
              },
              {
                value: '1',
                label: 'Weak',
              },
            ]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          initialValues={{
            type: '1',
            frequency: 'month',
          }}
          title={intl.formatMessage({
            id: 'pages.searchTable.updateForm.schedulingPeriod.title',
            defaultMessage: 'Set Scheduling Period',
          })}
        >
          <ProFormDateTimePicker
            name="time"
            width="md"
            label={intl.formatMessage({
              id: 'pages.searchTable.updateForm.schedulingPeriod.timeLabel',
              defaultMessage: 'Start Time',
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.searchTable.updateForm.schedulingPeriod.timeRules"
                    defaultMessage="Please select a start time!"
                  />
                ),
              },
            ]}
          />
          <ProFormSelect
            name="frequency"
            label={intl.formatMessage({
              id: 'pages.searchTable.updateForm.object',
              defaultMessage: 'Monitoring Target',
            })}
            width="md"
            valueEnum={{
              month: 'Monthly',
              week: 'Weekly',
            }}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </>
  );
};

export default UpdateForm;
