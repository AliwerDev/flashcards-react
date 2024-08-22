import { BooleanReturnType } from "src/hooks/use-boolean";
import axiosInstance, { endpoints } from "src/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Form, Input, message, Modal } from "antd";
import { TFunction } from "i18next";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { paths } from "src/routes/paths";
import get from "lodash.get";

type Props = {
  open: BooleanReturnType;
  t: TFunction;
  closeSidebar: VoidFunction;
};

const AddEditCategoryModal = ({ open: openBool, closeSidebar, t }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { mutate: onFinish, isPending } = useMutation({
    mutationKey: ["add-category"],
    mutationFn: (data: { title: string }) => (openBool.data ? axiosInstance.put(endpoints.category.edit(openBool?.data?._id), data) : axiosInstance.post(endpoints.category.create, data)),
    onSuccess: ({ data }) => {
      closeSidebar();
      navigate(paths.dashboard.main(get(data, "_id", "")));
      queryClient.invalidateQueries({ queryKey: ["categories"], exact: true });
      message.success(openBool.data ? t("successfully_changed") : t("successfully_created"));
      openBool.onFalse();
      form.resetFields();
    },
    onError: () => "",
  });

  const cancel = () => {
    form.setFieldsValue({ title: "" });
    openBool.onFalse();
  };

  useEffect(() => {
    if (openBool.value) {
      if (openBool.data) form.setFieldsValue(openBool.data);
    }
  }, [form, openBool]);

  return (
    <Modal open={openBool.value} onClose={cancel} onCancel={cancel} title={t("create-new-category")} footer={null}>
      <Form initialValues={{ type: "1" }} form={form} name="add-box" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="title"
          label={t("name")}
          rules={[
            {
              required: true,
              message: t("name-is-required"),
            },
          ]}
        >
          <Input min={1} className="w-full" size="large" placeholder={t("name")} />
        </Form.Item>

        <Flex justify="flex-end" gap="10px">
          <Button onClick={cancel} type="default">
            {t("cancel")}
          </Button>
          <Button loading={isPending} type="primary" htmlType="submit">
            {t("save")}
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

export default AddEditCategoryModal;
